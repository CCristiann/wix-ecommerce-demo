import { products } from "@wix/stores";

export interface TGetCheckoutUrlFromProduct {
    product: products.Product
    quantity: number,
    selectedOptions: Record<string, string>
}