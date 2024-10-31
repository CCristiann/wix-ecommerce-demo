import { z } from "zod";

export const CreateProductReviewSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
  rating: z.number({ message: "Rating is required" }),
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title must be at least 1 characters long" })
    .max(50, { message: "Title must be at most 50 characters long" }),
  body: z
    .string({ message: "Body is required" })
    .min(10, { message: "Comment must be at least 10 characters long" })
    .max(500, { message: "Comment must be at most 500 characters long" }),
  media: z
    .array(
      z.object({
        url: z
          .string({ message: "Media URL is required" })
          .url({ message: "Media URL is invalid" }),
        type: z.enum(["image", "video"]),
      })
    ).optional()
});
export type TCreateProductReviewSchema = z.infer<
  typeof CreateProductReviewSchema
>;

export const GetProductReviewsSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
  contactId: z.string().optional(),
  limit: z.number().optional(),
  cursor: z.string().nullish(),
});
export type TGetProductReviewsSchema = z.infer<typeof GetProductReviewsSchema>;

export const GetProductReviewsCountSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
});
export type TGetProductReviewsCountSchema = z.infer<
  typeof GetProductReviewsCountSchema
>;
