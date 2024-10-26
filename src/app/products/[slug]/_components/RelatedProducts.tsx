"use client";

import { products } from "@wix/stores";
import ProductCard from "~/components/products/ProductCard";
import { api } from "~/trpc/react";

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const { data, isLoading } = api.products.getRelatedProducts.useQuery({
    productId,
  });

  const relatedProducts = data as products.Product[];

  if (!relatedProducts?.length && !isLoading) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Related products</h2>
      <div className="flex flex-col sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCard.Skeleton key={i} />
            ))}
          </>
        ) : (
          relatedProducts && (
            <>
              {relatedProducts.map((p, i) => (
                <ProductCard product={p} key={i} />
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
}
