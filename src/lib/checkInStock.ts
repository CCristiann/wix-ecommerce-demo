import { products } from "@wix/stores";
import { findVariant } from "./findVariant";

export function checkInStock(
  product: products.Product,
  selectedOptions: Record<string, string>
) {
  const variant = findVariant(product, selectedOptions);

  return variant
    ? variant.stock?.quantity !== 0 && variant.stock?.inStock
    : product.stock?.inventoryStatus === products.InventoryStatus.IN_STOCK ||
        product.stock?.inventoryStatus ===
          products.InventoryStatus.PARTIALLY_OUT_OF_STOCK;
}
