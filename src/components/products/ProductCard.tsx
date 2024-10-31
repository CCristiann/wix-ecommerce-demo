import { products } from "@wix/stores";
import Link from "next/link";
import WixImage from "../common/WixImage";
import { Badge } from "../ui/shadcn/badge";
import { formatProductPrice } from "~/lib/formatProductPrice";
import { Skeleton } from "../ui/shadcn/skeleton";
import AddToCartButton from "../common/AddToCartButton";

interface ProductCardProps {
  product: products.Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const selectedOptions =
    product?.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0]?.description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {};

  return (
    <Link
      href={`/products/${product.slug}`}
      className="z-0 relative h-full w-full rounded-2xl border border-input/50 shadow-md"
    >
      <WixImage
        scaleToFill={false}
        mediaIdentifier={product.media?.mainMedia?.thumbnail?.url}
        alt={product.media?.mainMedia?.thumbnail?.altText}
        className="h-full w-full rounded-xl object-cover"
      />

      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2.5">
        {product.ribbon ? <Badge>{product.ribbon}</Badge> : <span></span>}

        <AddToCartButton
          selectedOptions={selectedOptions}
          quantity={1}
          product={product}
          variant={"outline"}
          size={"icon"}
          customVariant="icon-only"
          className="rounded-full z-10"
        />
      </div>

      <div className="absolute bottom-0 left-0 flex w-full items-center justify-between gap-2.5 p-2.5">
        <Badge
          variant={"secondary"}
          className="flex-grow !bg-black/30 px-3.5 py-2 backdrop-blur-lg"
        >
          <h1 className="font-medium text-background">{product.name}</h1>
        </Badge>
        <Badge className="px-3.5 py-2 font-medium">
          {formatProductPrice(product)}
        </Badge>
      </div>
    </Link>
  );
}

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-input/50">
      <Skeleton className="aspect-square h-full w-full" />

      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2.5">
        <Skeleton className="h-4 w-12 rounded-full bg-background" />
        <Skeleton className="size-8 rounded-full bg-background" />
      </div>

      <div className="absolute bottom-0 left-0 flex w-full items-center justify-between gap-2.5 p-2.5">
        <Skeleton className="h-8 w-full flex-grow rounded-full bg-background" />
        <Skeleton className="h-8 w-16 rounded-full bg-background" />
      </div>
    </div>
  );
};
