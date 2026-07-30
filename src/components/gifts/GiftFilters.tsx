"use client";

import { cn } from "@/lib/utils";
import { PRICE_RANGES } from "@/lib/price-ranges";
import type { CategoryDTO } from "@/types";

export function GiftFilters({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  query,
  onQueryChange,
  onlyFavorites,
  onToggleFavorites,
}: {
  categories: CategoryDTO[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  priceRange: string;
  onPriceRangeChange: (key: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          aria-label="Buscar presentes"
          placeholder="Buscar presente…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-full border border-wine-100 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-wine-500 focus:outline-none focus:ring-2 focus:ring-wine-500/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          aria-pressed={activeCategory === null}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === null
              ? "border-wine-500 bg-wine-500 text-white"
              : "border-wine-100 text-ink/70 hover:border-wine-500 hover:text-wine-500"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            aria-pressed={activeCategory === cat.slug}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.slug
                ? "border-wine-500 bg-wine-500 text-white"
                : "border-wine-100 text-ink/70 hover:border-wine-500 hover:text-wine-500"
            )}
          >
            {cat.name}
          </button>
        ))}

        <button
          onClick={onToggleFavorites}
          aria-pressed={onlyFavorites}
          className={cn(
            "ml-auto rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            onlyFavorites
              ? "border-gold bg-gold text-wine-900"
              : "border-wine-100 text-ink/70 hover:border-gold hover:text-wine-700"
          )}
        >
          ♥ Favoritos
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink/40">Valor</span>
        {PRICE_RANGES.map((range) => (
          <button
            key={range.key}
            onClick={() => onPriceRangeChange(range.key)}
            aria-pressed={priceRange === range.key}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              priceRange === range.key
                ? "border-wine-500 bg-wine-500 text-white"
                : "border-wine-100 text-ink/70 hover:border-wine-500 hover:text-wine-500"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
