import { products } from "@wix/stores";
import Link from "next/link";
import WixImage from "../common/WixImage";
import { Badge } from "../ui/shadcn/badge";
import { formatProductPrice } from "~/lib/formatProductPrice";
import { Skeleton } from "../ui/shadcn/skeleton";

interface ProductCardProps {
  product: products.Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="relative shadow-md bg-background border border-input/50 rounded-2xl h-full p-3.5 space-y-3"
    >
      <div className="relative overflow-hidden">
        <WixImage
          scaleToFill={false}
          mediaIdentifier={product.media?.mainMedia?.thumbnail?.url}
          alt={product.media?.mainMedia?.thumbnail?.altText}
          className="rounded-xl object-cover aspect-[16/12]"
        />

        {product.ribbon && (
          <div className="absolute bottom-3 right-3">
            <Badge>{product.ribbon}</Badge>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">{product.name}</h3>

        <div
          className="line-clamp-2 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
        <div className="font-medium">
          <span>{formatProductPrice(product)}</span>
        </div>
      </div>
    </Link>
  );
}

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <div className="relative shadow-md bg-background border border-input/50 rounded-2xl h-full p-3.5 space-y-3">
      <Skeleton className="w-full aspect-[16/12]" />

      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />

        <div className="space-y-0.5">
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[75%]" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};
