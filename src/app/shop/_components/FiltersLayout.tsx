"use client";

import { collections } from "@wix/stores";
import CollectionsFilters from "./CollectionsFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import SortFilter from "./SortFilter";
import Container from "~/components/common/Container";

interface FiltersLayoutProps {
  children: React.ReactNode;
  collections: collections.Collection[];
}

export default function FiltersLayout({
  children,
  collections,
}: FiltersLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    collection: searchParams.getAll("collection"),
    sort: searchParams.get("sort") || undefined,
  });

  const [isPending, startTransition] = useTransition();

  const updateFilters = (updates: Partial<typeof optimisticFilters>) => {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  };

  return (
    <Container>
      <div className="group flex flex-col gap-10 items-center justify-center px-5 py-10 lg:flex-row lg:items-start">
        <aside className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-64">
          <CollectionsFilters
            collections={collections}
            selectedCollectionIds={optimisticFilters.collection}
            updateCollectionIds={(collectionIds) =>
              updateFilters({ collection: collectionIds })
            }
          />
        </aside>
        <div className="w-full h-full flex flex-col">
            <div className="self-end items-center">
                <SortFilter sort={optimisticFilters.sort} updateSort={(sort) => updateFilters({ sort })} />
            </div>
            {children}
            </div>
      </div>
    </Container>
  );
}
