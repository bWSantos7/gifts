"use client";

import { cn } from "@/lib/utils";
import type { GiftAudience } from "@/types";

const OPTIONS: { key: GiftAudience; label: string }[] = [
  { key: "GUESTS", label: "Convidados" },
  { key: "GODPARENTS", label: "Padrinhos" },
];

export function AudienceToggle({
  value,
  onChange,
}: {
  value: GiftAudience;
  onChange: (audience: GiftAudience) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-gold/50 bg-white p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          aria-pressed={value === opt.key}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            value === opt.key ? "bg-wine-500 text-white" : "text-wine-700 hover:bg-wine-50"
          )}
        >
          Lista dos {opt.label}
        </button>
      ))}
    </div>
  );
}
