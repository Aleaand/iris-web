export function formatPrice(price: number | string): string {
  const num = Number(price);
  if (isNaN(num)) return String(price);

  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}
