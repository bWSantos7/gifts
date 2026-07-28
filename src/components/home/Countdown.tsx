"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ weddingDate }: { weddingDate: string }) {
  const target = new Date(weddingDate).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock, must run after mount to avoid SSR mismatch
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const units: { label: string; value: number | null }[] = [
    { label: "Dias", value: timeLeft?.days ?? null },
    { label: "Horas", value: timeLeft?.hours ?? null },
    { label: "Minutos", value: timeLeft?.minutes ?? null },
    { label: "Segundos", value: timeLeft?.seconds ?? null },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-6">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-16 flex-col items-center rounded-xl border border-gold/40 bg-white/10 py-3 backdrop-blur-sm sm:w-24 sm:py-4"
        >
          <span className="font-display text-2xl text-gold sm:text-4xl">
            {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-white/80 sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
