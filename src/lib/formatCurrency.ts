export function formatCurrency(
  price: number | string = 0,
  currency: string = "EUR"
) {
  return Intl.NumberFormat("en", { style: "currency", currency }).format(
    Number(price)
  );
}
