import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { publicProcedure } from "../../trpc";
import { reviewsService } from "./service/reviews.service";
import { CreateProductReviewSchema, GetProductReviewsCountSchema, GetProductReviewsSchema } from "./service/reviews.service.types";
export const reviewsRouter = createTRPCRouter({
    createProductReview: protectedProcedure.input(CreateProductReviewSchema).mutation(({ ctx, input }) => {
        return reviewsService.createProductReview(ctx.wixClient, input);
    }),
    getProductReviews: publicProcedure.input(GetProductReviewsSchema).query(({ ctx, input }) => {
        return reviewsService.getProductReviews(ctx.wixClient, input);
    }),
    getProductReviewsCount: publicProcedure.input(GetProductReviewsCountSchema).query(({ ctx, input }) => {
        return reviewsService.getProductReviewsCount(ctx.wixClient, input);
    })
})