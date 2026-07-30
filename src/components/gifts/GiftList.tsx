"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFavorites } from "@/lib/favorites";
import { GiftFilters } from "@/components/gifts/GiftFilters";
import { GiftCard } from "@/components/gifts/GiftCard";
import { priceMatchesRange } from "@/lib/price-ranges";
import type { CategoryDTO, GiftDTO } from "@/types";

export function GiftList({
  initialGifts,
  categories,
}: {
  initialGifts: GiftDTO[];
  categories: CategoryDTO[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isFavorite } = useFavorites();

  const [gifts, setGifts] = useState(initialGifts);
  const [category, setCategory] = useState<string | null>(searchParams.get("categoria"));
  const [priceRange, setPriceRange] = useState(searchParams.get("faixa") ?? "all");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const highlightedId = searchParams.get("presente");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("categoria", category);
    if (priceRange !== "all") params.set("faixa", priceRange);
    if (query) params.set("q", query);
    const search = params.toString();
    router.replace(search ? `/?${search}#presentes` : "/#presentes", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, priceRange, query]);

  useEffect(() => {
    if (!highlightedId) return;
    const el = document.getElementById(`presente-${highlightedId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gifts.filter((gift) => {
      if (category && gift.categorySlug !== category) return false;
      if (!priceMatchesRange(gift.price, priceRange)) return false;
      if (onlyFavorites && !isFavorite(gift.id)) return false;
      if (q && !gift.name.toLowerCase().includes(q) && !gift.description?.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [gifts, category, priceRange, query, onlyFavorites, isFavorite]);

  function handleReserved(giftId: string, name: string) {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId ? { ...g, reservedByName: name, reservedAt: new Date().toISOString() } : g
      )
    );
  }

  function handleCancelled(giftId: string) {
    setGifts((prev) =>
      prev.map((g) => (g.id === giftId ? { ...g, reservedByName: null, reservedAt: null } : g))
    );
  }

  return (
    <section id="presentes" className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Com carinho</span>
        <h2 className="mt-3 font-display text-3xl text-wine-700 sm:text-4xl">Lista de presentes</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Escolha um presente e clique em &ldquo;Comprar&rdquo; para ser levado até a loja. Se preferir,
          avise que vai dar aquele presente para que os demais convidados saibam.
        </p>
      </div>

      <div className="mt-8">
        <GiftFilters
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          query={query}
          onQueryChange={setQuery}
          onlyFavorites={onlyFavorites}
          onToggleFavorites={() => setOnlyFavorites((v) => !v)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-ink/50">Nenhum presente encontrado.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              highlighted={gift.id === highlightedId}
              onReserved={handleReserved}
              onCancelled={handleCancelled}
            />
          ))}
        </div>
      )}
    </section>
  );
}
