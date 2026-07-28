"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wedding-my-reservations";

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useMyReservations() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, only available after mount
    setIds(read());
  }, []);

  const markReserved = useCallback((giftId: string) => {
    setIds((prev) => {
      if (prev.includes(giftId)) return prev;
      const next = [...prev, giftId];
      write(next);
      return next;
    });
  }, []);

  const markCancelled = useCallback((giftId: string) => {
    setIds((prev) => {
      const next = prev.filter((id) => id !== giftId);
      write(next);
      return next;
    });
  }, []);

  const isMine = useCallback((giftId: string) => ids.includes(giftId), [ids]);

  return { isMine, markReserved, markCancelled };
}
