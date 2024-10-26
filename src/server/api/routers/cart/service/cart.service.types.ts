import { products } from "@wix/stores";
import { z } from "zod";

export interface AddToCartProps {
    product: products.Product
    selectedOptions: Record<string, string>
    quantity: number
}

export const UpdateCartItemQuantitySchema = z.object({
    productId: z.string({ message: "Product ID is missing"}),
    newQuantity: z.number({ message: "New quantity is missing"})
})
export type TUpdateCartItemQuantity = z.infer<typeof UpdateCartItemQuantitySchema>

export const RemoveCartItemSchema = z.object({
    productId: z.string({ message: "Product ID is missing"})
})
export type TRemoveCartItem = z.infer<typeof RemoveCartItemSchema>