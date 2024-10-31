"use client";

import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import Image from "next/image";
import { LuLoader2, LuStar } from "react-icons/lu";
import CreateProductReviewButton from "~/components/reviews/CreateProductReviewButton";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import logo from "~/../public/assets/logo.svg";
import { members } from "@wix/members";
import { Button } from "~/components/ui/shadcn/button";

import { IoIosReturnRight } from "react-icons/io";

import Zoom from "react-medium-image-zoom";
import WixImage from "~/components/common/WixImage";

import { media as WixMedia } from "@wix/sdk";

interface ProductReviewsProps {
  product: products.Product;
  loggedInMember: members.Member | null;
}

export default function ProductReviews({
  product,
  loggedInMember,
}: ProductReviewsProps) {
  // const loggedInMember = await api.auth.getLoggedInMember()
  if (!product._id) return null;

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = api.reviews.getProductReviews.useInfiniteQuery(
    {
      productId: product._id,
      limit: 1,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursors.next,
    },
  );

  // @ts-expect-error
  const reviews = data?.pages.flatMap((page) => page?._items) || [];

  return (
    <div className="max-w-md w-full flex flex-col gap-y-4">
      <h2 className="text-2xl font-bold">Reviews</h2>

      <div className="space-y-5">
        <div className="divide-y">
          {reviews.map((review, i) => (
            <Review key={i} review={review} />
          ))}
        </div>
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            className="w-full"
            variant={"outline"}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <LuLoader2 className="size-5 animate-spin" />
            ) : (
              <span>Load more</span>
            )}
          </Button>
        )}
      </div>
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
      />
    </div>
  );
}

interface ReviewProps {
  review: reviews.Review;
}

function Review({
  review: { author, content, reply, reviewDate },
}: ReviewProps) {
  return (
    <div className="max-w-md w-full py-5 first:pt-0 last:pb-0">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <LuStar
              key={i}
              className={cn(
                "size-6 text-yellow-500",
                i < (content?.rating || 0) && "fill-yellow-500",
              )}
            />
          ))}
          {content?.title && <h3 className="font-semibold">{content.title}</h3>}
        </div>
        <p className="text-sm text-muted-foreground">
          by {author?.authorName || "Anonymous"}
          {reviewDate && <> on {new Date(reviewDate).toLocaleString()}</>}
        </p>
        {content?.body && (
          <div className="whitespace-pre-line">{content.body}</div>
        )}
        {!!content?.media?.length && (
          <div className="flex flex-wrap gap-2">
            {content.media.map((m, i) => (
              <MediaAttachment key={i} media={m} />
            ))}
          </div>
        )}
      </div>
      {reply?.message && (
        <div className="ms-10 mt-2.5 space-y-1 border-t pt-2.5">
          <div className="flex items-center gap-2">
            <IoIosReturnRight className="size-7" />
            <Image
              alt="Logo"
              src={logo}
              width={24}
              height={24}
              className="size-5"
            />
            <span className="font-semibold">Zenthes Team</span>
          </div>
          <div className="whitespace-pre-line">{reply.message}</div>
        </div>
      )}
    </div>
  );
}


interface MediaAttachmentProps {
  media: reviews.Media
}

function MediaAttachment({ media }: MediaAttachmentProps) {
  if(media.image) {
    return (
      <Zoom>
        <WixImage mediaIdentifier={media.image} alt={"Review media"} scaleToFill={false} className="max-h-40 max-w-40 object-contain rounded-lg" />
      </Zoom>
    )
  }

  if(media.video) {
    return (
      <video controls className="max-h-40 max-w-40 rounded-lg">
        <source src={WixMedia.getVideoUrl(media.video).url} type="video/mp4" />
      </video>
    )
  }

  return <span className="text-destructive">Unsupported media type</span>
}