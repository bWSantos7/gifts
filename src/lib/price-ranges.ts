export type PriceRange = {
  key: string;
  label: string;
  min?: number;
  max?: number;
};

export const PRICE_RANGES: PriceRange[] = [
  { key: "all", label: "Todos os valores" },
  { key: "0-150", label: "Até R$150", min: 0, max: 150 },
  { key: "150-300", label: "R$150 – R$300", min: 150, max: 300 },
  { key: "300-600", label: "R$300 – R$600", min: 300, max: 600 },
  { key: "600+", label: "Acima de R$600", min: 600 },
];

export function priceMatchesRange(price: string | null, rangeKey: string): boolean {
  if (rangeKey === "all") return true;
  const range = PRICE_RANGES.find((r) => r.key === rangeKey);
  if (!range) return true;
  if (price === null) return false;

  const value = Number(price);
  if (Number.isNaN(value)) return false;

  if (range.min !== undefined && value < range.min) return false;
  if (range.max !== undefined && value >= range.max) return false;
  return true;
}
