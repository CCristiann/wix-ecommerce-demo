import { TRPCError } from "@trpc/server";
import { products } from "@wix/stores";
import {
  GetProductBySlugSchema,
  GetRelatedProductsSchema,
  QueryProductsSchema,
  TCreateBackInStockNotificationReq,
  TGetProductBySlugSchema,
  TGetRelatedProductsSchema,
  TQueryProductsSchema,
} from "./products.service.types";
import { validateSchema } from "~/lib/zod";
import { wixBrowserClient } from "~/lib/wix-client.browser";
import { findVariant } from "~/lib/findVariant";
import { WIX_STORES_APP_ID, WIX_STORES_APP_ID_BACK_IN_STOCK_NOTIFICATIONS } from "~/lib/costants";
import { getWixServerClient } from "~/lib/wix-client.server";
import { WixClient } from "~/lib/wix-client.base";

class ProductsService {
  public async queryProducts(wixClient: WixClient, args: TQueryProductsSchema) {
    const { q, sort, priceMin, priceMax, collectionIds, skip, limit } =
      validateSchema(QueryProductsSchema, args);

    let query = wixClient.products.queryProducts();

    if (q) {
      query = query.startsWith("name", q);
    }

    if (collectionIds && collectionIds.length > 0) {
      query = query.hasSome("collectionIds", collectionIds);
    }

    switch (sort) {
      case "last_updated":
        query = query.descending("lastUpdated");
        break;

      case "price_asc":
        query = query.ascending("price");
        break;

      case "price_desc":
        query = query.descending("price");
        break;
    }

    if (priceMin) {
      query = query.ge("priceData.price", priceMin);
    }

    if (priceMax) {
      query = query.le("priceData.price", priceMax);
    }

    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);

    const products = await query.find();
    return products;
  }

  public async getFeaturedProducts(wixClient: WixClient) {
    const { collection } = await wixClient.collections.getCollectionBySlug(
      "featured-products"
    );
    if (!collection?._id) {
      return null;
    }

    const featuredProducts = await wixClient.products
      .queryProducts()
      .hasSome("collectionIds", [collection._id])
      .descending("lastUpdated")
      .find();

    return featuredProducts.items as products.Product[];
  }

  public async getRelatedProducts(wixClient: WixClient, args: TGetRelatedProductsSchema) {
    const { productId } = validateSchema(GetRelatedProductsSchema, args);

    const result = await wixClient.recommendations.getRecommendation(
      [
        {
          _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", // "From the same categories"
          appId: WIX_STORES_APP_ID,
        },
        {
          _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", // "Frequenly bought together"
          appId: WIX_STORES_APP_ID,
        },
      ],
      {
        items: [
          {
            appId: WIX_STORES_APP_ID,
            catalogItemId: productId,
          },
        ],
        minimumRecommendedItems: 3,
      }
    );

    const productIds = result.recommendation?.items
      .map((item) => item.catalogItemId)
      .filter((id) => id !== undefined);

    if (!productIds || !productIds.length) return [];

    const products = await wixClient.products
      .queryProducts()
      .in("_id", productIds)
      .limit(4)
      .find();

    return products.items as products.Product[];
  }

  public async getProductBySlug(wixClient: WixClient, args: TGetProductBySlugSchema) {
    const { slug } = validateSchema(GetProductBySlugSchema, args);

    try {
      const { items } = await wixClient.products
        .queryProducts()
        .eq("slug", slug)
        .limit(1)
        .find();

      const product = items[0] as products.Product;

      if (!product || !product.visible) return null;

      return product;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong!",
      });
    }
  }

  public async createBackInStockNotificationReq(
    args: TCreateBackInStockNotificationReq
  ) {
    const { product, itemUrl, selectedOptions, email } = args;

    const selectedVariant = findVariant(product, selectedOptions);

    try {
      wixBrowserClient.backInStockNotifications.createBackInStockNotificationRequest(
        {
          email,
          itemUrl,
          catalogReference: {
            appId: WIX_STORES_APP_ID_BACK_IN_STOCK_NOTIFICATIONS,
            catalogItemId: product._id,
            options: selectedVariant
              ? { variantId: selectedVariant._id }
              : { options: selectedOptions },
          },
        },
        {
          name: product.name || undefined,
          price: product.priceData?.discountedPrice?.toFixed(2),
          image: product.media?.mainMedia?.image?.url,
        }
      );
    } catch (err) {
      if (
        (err as any).details.applicationError.code ==
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already subscribed to this product.",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export const productsService = new ProductsService();
