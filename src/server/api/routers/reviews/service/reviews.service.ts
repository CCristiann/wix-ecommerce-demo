import { WixClient } from "~/lib/wix-client.base";
import {
  CreateProductReviewSchema,
  GetProductReviewsCountSchema,
  GetProductReviewsSchema,
  TCreateProductReviewSchema,
  TGetProductReviewsCountSchema,
  TGetProductReviewsSchema,
} from "./reviews.service.types";
import { validateSchema } from "~/lib/zod";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { authService } from "../../auth/service/auth.service";
import { reviews } from "@wix/reviews";

class ReviewsService {
  public async createProductReview(
    wixClient: WixClient,
    input: TCreateProductReviewSchema,
  ) {
    const { productId, rating, title, body, media } = validateSchema(
      CreateProductReviewSchema,
      input,
    );

    const member = await authService.getLoggedInMember(wixClient);

    if (!member)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You are not authorized to perform this action. Please log in to continue.",
      });

    const authorName =
      member.contact?.firstName && member.contact?.lastName
        ? `${member.contact.firstName} ${member.contact.lastName}`
        : member.contact?.firstName ||
          member.contact?.lastName ||
          member.profile?.nickname ||
          "Anonymous";

    try {
      await wixClient.reviews.createReview({
        author: {
          authorName,
          contactId: member.contactId,
        },
        entityId: productId,
        namespace: "stores",
        content: {
          title,
          body,
          rating,
          media: media?.map(({ url, type }) =>
            type === "image" ? { image: url } : { video: url },
          ),
        },
      });

      return { success: true };
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create review. Please try again later.",
      });
    }
  }

  public async getProductReviews(
    wixClient: WixClient,
    args: TGetProductReviewsSchema,
  ) {
    const { productId, contactId, limit, cursor } = validateSchema(
      GetProductReviewsSchema,
      args,
    );

    let query = wixClient.reviews.queryReviews().eq("entityId", productId);

    if (contactId) {
      query = query.eq("author.contactId", contactId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (cursor) {
      query = query.skipTo(cursor);
    }

    const reviews = await query.find();

    return reviews;
  }

  public async getProductReviewsCount(
    wixClient: WixClient,
    args: TGetProductReviewsCountSchema,
  ) {
    const { productId } = validateSchema(GetProductReviewsCountSchema, args);

    let query = wixClient.reviews.queryReviews().eq("entityId", productId);
    const reviews = await query.find();

    const count = reviews.length ? reviews.length : 0;
    const averageRating =
      reviews.items.reduce((sum, review) => {
        return sum + (review.content?.rating || 0);
      }, 0) / reviews.items.length;

    return {
      count,
      averageRating,
    };
  }
}

export const reviewsService = new ReviewsService();
