import { products } from "@wix/stores";
import { z } from "zod";

export const QueryProductsSchema = z.object({
  q: z.string().optional(),
  sort: z.enum(["last_updated", "price_asc", "price_desc"]).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  collectionIds: z.array(z.string()).optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
});
export type TQueryProductsSchema = z.infer<typeof QueryProductsSchema>;

export const GetProductBySlugSchema = z.object({
  slug: z.string(),
});

export type TGetProductBySlugSchema = z.infer<typeof GetProductBySlugSchema>;

export interface TCreateBackInStockNotificationReq {
  product: products.Product;
  email: string;
  itemUrl: string;
  selectedOptions: Record<string, string>;
}

export const GetRelatedProductsSchema = z.object({
  productId: z.string({ message: "Product ID is missing" }),
});
export type TGetRelatedProductsSchema = z.infer<
  typeof GetRelatedProductsSchema
>;
