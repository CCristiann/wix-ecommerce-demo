"use client";

import ProductCard from "./ProductCard";
import Container from "../common/Container";
import { api } from "~/trpc/react";
import { products } from "@wix/stores";

export default function FeaturedProducts() {
  const { data, isLoading } = api.products.getFeaturedProducts.useQuery();
  const featuredProducts = data as products.Product[];

  if (!featuredProducts && !isLoading) {
    return null;
  }

  return (
    <Container>
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCard.Skeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {featuredProducts.map((p, i) => (
                <ProductCard key={i} product={p} />
              ))}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
