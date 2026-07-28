"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wedding-favorites";

function readStoredIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function useStoredIdSet(key: string) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, only available after mount
    setIds(readStoredIds(key));
  }, [key]);

  const add = useCallback(
    (id: string) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, has, toggle, add };
}

export function useFavorites() {
  const { ids, has, toggle } = useStoredIdSet(STORAGE_KEY);
  return { favoriteIds: ids, isFavorite: has, toggleFavorite: toggle };
}
