"use client";

import { products } from "@wix/stores";
import { notFound } from "next/navigation";
import ProductDetails from "./_components/ProductDetails";
import RelatedProducts from "./_components/RelatedProducts";
import { api } from "~/trpc/react";
import Container from "~/components/common/Container";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params: { slug } }: PageProps) {
  const { data, isLoading } = api.products.getProductBySlug.useQuery({ slug });
  const product = data as products.Product | null | undefined;

  if (!product?._id && !isLoading) return notFound();

  return (
    <section id="product-page" className="pt-20 2xl:pt-36">
      <Container>
        <div className="space-y-10">
          {isLoading ? (
            <ProductDetails.Skeleton />
          ) : (
            product && <ProductDetails product={product} />
          )}
          {product && product._id && (
            <RelatedProducts productId={product._id} />
          )}
        </div>
      </Container>
    </section>
  );
}
