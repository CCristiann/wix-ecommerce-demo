import { products } from "@wix/stores";
import { Badge } from "~/components/ui/shadcn/badge";
import { cn } from "~/lib/utils";

interface ProductPriceProps {
  product: products.Product;
  selectedVariant: products.Variant | null;
}
export default function ProductPrice({
  product,
  selectedVariant,
}: ProductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null;

  const hasDiscount = priceData.discountedPrice !== priceData.price;

  return (
    <div className="flex items-center gap-2.5 text-3xl font-semibold py-6">
      <span className={cn(hasDiscount && "text-muted-foreground line-through")}>
        {priceData.formatted?.price}
      </span>
      {hasDiscount && <span>{priceData.formatted?.discountedPrice}</span>}
      {product.discount?.type === "PERCENT" && <Badge>-%{product.discount?.value}</Badge>}
    </div>
  );
}
