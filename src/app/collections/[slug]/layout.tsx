import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "~/components/common/Container";
import WixImage from "~/components/common/WixImage";
import { Skeleton } from "~/components/ui/shadcn/skeleton";
import { api } from "~/trpc/server";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <Suspense fallback={<Layout.Skeleton />}>
      <CollectionsLayout params={params}>{children}</CollectionsLayout>
    </Suspense>
  );
}
async function CollectionsLayout({
  children,
  params: { slug },
}: LayoutProps) {
  const collection = await api.collections.getCollectionBySlug({ slug });

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return (
    <Container>
      <div className="space-y-10 px-5 py-10">
        <div className="flex flex-col gap-10">
          {banner && (
            <div className="relative hidden sm:block rounded-2xl overflow-hidden">
              <WixImage
                mediaIdentifier={banner.url}
                width={1280}
                height={400}
                alt={banner.altText}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black">
                <h1 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl lg:text-5xl font-bold text-white">
                  {collection.name}
                </h1>
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    </Container>
  );
}

Layout.Skeleton = function ProductCardSkeleton() {
  return (
    <Container>
      <div className="space-y-10 px-5 py-10">
        <Skeleton className="mx-auto h-10 w-48 sm:block sm:aspect-[1280/400] sm:h-full sm:w-full rounded-2xl" />
        <div className="space-y-5">
          <h2 className="text-2xl font-bold">Products</h2>
          <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[26rem] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
