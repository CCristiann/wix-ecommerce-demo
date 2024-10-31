"use client";

import React, { useState } from "react";
import { products } from "@wix/stores";
import { findVariant } from "~/lib/findVariant";
import { checkInStock } from "~/lib/checkInStock";
import ProductMedia from "./ProductMedia";
import { Badge } from "~/components/ui/shadcn/badge";
import ProductPrice from "./ProductPrice";
import ProductOptions from "./ProductOptions";
import { Label } from "~/components/ui/shadcn/label";
import { Input } from "~/components/ui/shadcn/input";
import AddToCartButton from "~/components/common/AddToCartButton";
import BuyNowButton from "~/components/common/BuyNowButton";
import BackInStockButton from "~/components/common/BackInStockButton";
import { LuInfo, LuStar } from "react-icons/lu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/shadcn/accordion";
import { Skeleton } from "~/components/ui/shadcn/skeleton";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

interface ProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { data: reviewsData } = api.reviews.getProductReviewsCount.useQuery({
    productId: product._id as string,
  });
  const reviewsCount = reviewsData?.count || 0;
  const reviewsAverageRating = reviewsData?.averageRating || 0;

  const [quantity, setQuantity] = useState<number>(1);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product?.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0]?.description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  const selectedVariant = findVariant(product, selectedOptions);

  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity =
    selectedVariant?.stock?.quantity || product.stock?.quantity;

  const availableQuantityExeeded =
    !!availableQuantity && quantity > availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name || ""],
    );
    return selectedChoice?.media?.items ?? [];
  });
  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items || []
        }
      />

      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="lg:text-2xl text-xl font-semibold">{product.name}</h1>

          {product.brand && (
            <div className="text-muted-foreground">{product.brand}</div>
          )}
          {product.ribbon && (
            <Badge className="block w-fit">{product.ribbon}</Badge>
          )}
          
          {reviewsData && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <LuStar
                    key={i}
                    className={cn(
                      "size-4 text-yellow-500",
                      i < reviewsAverageRating && "fill-yellow-500",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{reviewsCount}{" "}{reviewsCount > 1 || reviewsCount === 0 ? "reviews" : "review"}</span>
            </div>
          )}
  
          <ProductPrice product={product} selectedVariant={selectedVariant} />

          <ProductOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            product={product}
          />

          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2.5">
              <Input
                name="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24"
                disabled={!inStock}
              />
              {!!availableQuantity &&
                (availableQuantityExeeded || availableQuantity < 10) && (
                  <span className="text-sm text-destructive">
                    Only {availableQuantity} left in stock
                  </span>
                )}
            </div>
          </div>

          {inStock ? (
            <div className="flex items-center gap-2.5">
              <AddToCartButton
                disabled={availableQuantityExeeded || quantity < 1}
                product={product}
                selectedOptions={selectedOptions}
                quantity={quantity}
                className="w-full"
              />
              <BuyNowButton
                disabled={availableQuantityExeeded || quantity < 1}
                product={product}
                selectedOptions={selectedOptions}
                quantity={quantity}
              />
            </div>
          ) : (
            <BackInStockButton
              product={product}
              selectedOptions={selectedOptions}
              className="w-full"
            />
          )}

          {!!product.additionalInfoSections?.length && (
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <LuInfo className="size-5" />
                <span>Addition product information</span>
              </span>
              <Accordion type="multiple">
                {product.additionalInfoSections.map((section, i) => (
                  <AccordionItem key={i} value={section.title || ""}>
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose dark:prose-invert text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: section.description || "",
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <div className="basis-2/5">
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </div>

      <div className="basis-3/5 space-y-5">
        <div className="space-y-8">
          <Skeleton className="h-8 w-44" />

          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          <Skeleton className="h-6 w-28" />

          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}
