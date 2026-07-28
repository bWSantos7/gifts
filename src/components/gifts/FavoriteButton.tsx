"use client";

import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";

export function FavoriteButton({ giftId }: { giftId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(giftId);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(giftId);
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Favoritar presente"}
      title={active ? "Remover dos favoritos" : "Favoritar"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        active
          ? "border-wine-500 bg-wine-500 text-white"
          : "border-wine-100 text-wine-500 hover:bg-wine-50"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          d="M12 20.5s-7.5-4.6-10-9.2C.6 8.1 2 4.5 5.6 4.5c2 0 3.5 1.1 4.4 2.6.9-1.5 2.4-2.6 4.4-2.6 3.6 0 5 3.6 3.6 6.8-2.5 4.6-10 9.2-10 9.2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
