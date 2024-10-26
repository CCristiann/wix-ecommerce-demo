import { products } from "@wix/stores";

export function findVariant(
  product: products.Product,
  selectedOptions: Record<string, string>
) {
    if(!product.manageVariants) return null

    return (product.variants?.find((variant) => {
        return Object.entries(selectedOptions).every(
            ([key, value]) => variant.choices?.[key] === value
        )
    }) || null
)
}
