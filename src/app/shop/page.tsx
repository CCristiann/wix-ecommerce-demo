import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "~/components/common/Container";
import PaginationBar from "~/components/common/PaginationBar";
import ProductCard from "~/components/products/ProductCard";
import { api } from "~/trpc/server";

const QUERY_LIMIT = 12;

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
    sort: "last_updated" | "price_asc" | "price_desc";
  };
}

export function generateMetadata({ searchParams: { q } }: PageProps) {
  return {
    title: q ? `Results for: "${q}"` : "Shop products",
  };
}

export default async function Page({
  searchParams: { q, page, collection: collectionIds, sort },
}: PageProps) {
  const title = q ? `Results for: "${q}"` : "Shop products";

  return (
    <section id="main-shop" className="min-h-screen w-full h-full">
      <Container>
        <div className="flex flex-col gap-5 h-full w-full">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Suspense fallback={<ProductResults.Skeleton />}>
            <ProductResults
              q={q}
              collectionIds={collectionIds}
              page={parseInt(page || "1")}
              sort={sort}
            />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
  sort: "last_updated" | "price_asc" | "price_desc";
}

async function ProductResults({ q, page, collectionIds, sort }: ProductResultsProps) {
  const products = await api.products.queryProducts({
    q,
    collectionIds: !collectionIds
      ? undefined
      : Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds],
    limit: QUERY_LIMIT || 8,
    skip: (page - 1) * (QUERY_LIMIT || 8),
    sort
  });

  if (page > (products.totalPages || 1)) notFound();
  return (
    <>
      {products && products.length ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.items.map((p, i) => (
              <ProductCard product={p} key={i} />
            ))}
          </div>
          <PaginationBar
            totalPages={products.totalPages || 1}
            currentPage={page}
          />
        </div>
      ) : (
        <div className="w-full h-full py-20 max-w-xs mx-auto">
          <div className="flex flex-col items-center justify-center gap-y-2.5">
            <h1 className="text-center text-xl font-medium">
              There are no products that match <span className="font-bold">&quot;{q}&quot;</span>
            </h1>
            <p className="text-center text-muted-foreground">
              Please try to search for something else.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

ProductResults.Skeleton = function ProductResultsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard.Skeleton key={i} />
        ))}
      </div>
    </div>
  );
};
