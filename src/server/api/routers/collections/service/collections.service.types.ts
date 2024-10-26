import { z } from "zod";

export const GetCollectionBySlugSchema = z.object({
    slug: z.string({ message: "Collection slug is missing"})
})
export type TGetCollectionBySlugSchema = z.infer<typeof GetCollectionBySlugSchema>