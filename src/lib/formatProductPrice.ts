import { products } from "@wix/stores";
import { formatCurrency } from "./formatCurrency";

export function formatProductPrice(product: products.Product) {
  const minPrice = product.priceRange?.minValue
  const maxPrice = product.priceRange?.maxValue
  const currency = product.priceData?.currency

  if(minPrice && maxPrice && minPrice !== maxPrice) {
    return `from ${formatCurrency(minPrice, currency)}`
  }

  return product.priceData?.formatted?.discountedPrice?.replace(" ", "") || product.priceData?.formatted?.price?.replace(" ", "") || "N/A"
}