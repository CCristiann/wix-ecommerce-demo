"use state";

import { products } from "@wix/stores";
import { useEffect, useState } from "react";

import Zoom from "react-medium-image-zoom";

import { IoPlay } from "react-icons/io5";
import WixImage from "~/components/common/WixImage";
import { cn } from "~/lib/utils";

interface ProductMediaProps {
  media: products.MediaItem[];
}
export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);
  
  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="basis-2/5 md:sticky md:top-10 h-fit space-y-5">
      <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
        {selectedImage?.url ? (
          <Zoom key={selectedImage.url}>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black rounded-2xl overflow-hidden">
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="size-full"
            />
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap gap-5 mt-5">
          {media.map((mediaItem, i) => (
            <MediaPreview
              key={i}
              mediaItem={mediaItem}
              isSelected={selectedMedia?._id === mediaItem._id}
              onSelect={() => setSelectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn(
        "relative cursor-pointer bg-secondary rounded-2xl overflow-hidden",
        isSelected && "outline outline-1 outline-foreground/30"
      )}
    >
      <WixImage
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0]?.altText}
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/30 backdrop-blur-lg p-2">
          <IoPlay className="size-5" />
        </span>
      )}
    </div>
  );
}
