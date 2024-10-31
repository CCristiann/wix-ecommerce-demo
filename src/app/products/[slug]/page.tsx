import { products } from "@wix/stores";
import { notFound } from "next/navigation";
import ProductDetails, { ProductDetailsSkeleton } from "./_components/ProductDetails";
import RelatedProducts from "./_components/RelatedProducts";
import { api } from "~/trpc/server";
import Container from "~/components/common/Container";
import ProductReviews from "./_components/ProductReviews";
import { Suspense } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params: { slug } }: PageProps) {
  const loggedInMember = await api.auth.getLoggedInMember();
  const data = await api.products.getProductBySlug({ slug });
  const product = data as products.Product | null | undefined;

  if (!product?._id || !product) return notFound();

  return (
    <section id="product-page" className="pt-20 2xl:pt-36">
      <Container>
        <div className="space-y-10">
          <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductDetails product={product} />
          </Suspense>
          <RelatedProducts productId={product._id} />
          <ProductReviews product={product} loggedInMember={loggedInMember ? loggedInMember : null} />
        </div>
      </Container>
    </section>
  );
}
