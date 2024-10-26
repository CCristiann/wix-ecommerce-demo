import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PaginationBar from "~/components/common/PaginationBar";
import ProductCard from "~/components/products/ProductCard";
import { api } from "~/trpc/server";

const QUERY_LIMIT = 12;

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const collection = await api.collections.getCollectionBySlug({ slug });

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

export default async function Page({
  params: { slug },
  searchParams: { page = "1" },
}: PageProps) {
  const collection = await api.collections.getCollectionBySlug({ slug });

  if (!collection?._id) return notFound();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<Products.Skeleton />}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  );
}

interface ProductsProps {
  collectionId: string;
  page: number;
}

async function Products({ collectionId, page }: ProductsProps) {
  const collectionProducts = await api.products.queryProducts({
    collectionIds: [collectionId],
    limit: QUERY_LIMIT || 8,
    skip: (page - 1) * (QUERY_LIMIT || 8),
  });

  if (!collectionProducts.length) notFound();

  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {collectionProducts.items.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
      <PaginationBar
        totalPages={collectionProducts.totalPages || 1}
        currentPage={page}
      />
    </div>
  );
}

Products.Skeleton = function ProductsSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCard.Skeleton key={i} />
      ))}
    </div>
  );
};
