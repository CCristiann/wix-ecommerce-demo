import { media as wixMedia } from "@wix/sdk";
import { ImgHTMLAttributes } from "react";

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  mediaIdentifier: string | undefined;
  placeholder?: string;
  alt?: string | null | undefined;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill: false;
      }
  );

export default function WixImage({
  mediaIdentifier,
  placeholder = "/placeholder.png",
  alt,
  scaleToFill,
  ...props
}: WixImageProps) {
  let imageUrl = placeholder; // Placeholder di default

  if (mediaIdentifier) {
    // Se scaleToFill è true o undefined, usa width e height
    if (scaleToFill || scaleToFill === undefined) {
      const { width, height } = props as { width: number; height: number };
      imageUrl = wixMedia.getScaledToFillImageUrl(mediaIdentifier, width, height, {});
    } else {
      // Altrimenti, usa solo l'URL dell'immagine
      imageUrl = wixMedia.getImageUrl(mediaIdentifier).url;
    }
  }

  return <img src={imageUrl} alt={alt || ""} {...props} />;
}