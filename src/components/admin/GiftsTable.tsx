"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { imageUrl, formatPrice, cn } from "@/lib/utils";
import type { GiftAudience } from "@/types";

type GiftRow = {
  id: string;
  name: string;
  imageKey: string | null;
  price: string | number | null;
  isActive: boolean;
  audience: GiftAudience;
  category: { name: string };
  reservedByName: string | null;
};

const AUDIENCE_LABEL: Record<GiftAudience, string> = {
  GUESTS: "Convidados",
  GODPARENTS: "Padrinhos",
  BOTH: "Ambos",
};

export function GiftsTable({ gifts }: { gifts: GiftRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "GUESTS" | "GODPARENTS">("ALL");

  const filtered = useMemo(
    () =>
      filter === "ALL" ? gifts : gifts.filter((g) => g.audience === filter || g.audience === "BOTH"),
    [gifts, filter]
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover "${name}" da lista?`)) return;
    setPendingId(id);
    await fetch(`/api/admin/gifts/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
  }

  async function handleRelease(id: string) {
    setPendingId(id);
    await fetch(`/api/admin/gifts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ releaseReservation: true }),
    });
    setPendingId(null);
    router.refresh();
  }

  const tabs: { key: "ALL" | "GUESTS" | "GODPARENTS"; label: string }[] = [
    { key: "ALL", label: "Todos" },
    { key: "GUESTS", label: "Convidados" },
    { key: "GODPARENTS", label: "Padrinhos" },
  ];

  return (
    <div>
      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === tab.key
                ? "border-wine-500 bg-wine-500 text-white"
                : "border-wine-100 text-ink/70 hover:border-wine-500 hover:text-wine-500"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink/50">Nenhum presente cadastrado ainda.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-wine-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-wine-100 bg-wine-50/60 text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Presente</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Lista</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((gift) => (
                <tr key={gift.id} className="border-b border-wine-50 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-wine-50">
                      <Image src={imageUrl(gift.imageKey)} alt="" fill className="object-cover" />
                    </div>
                    <span className="font-medium text-ink">{gift.name}</span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{gift.category.name}</td>
                  <td className="px-4 py-3 text-ink/70">{AUDIENCE_LABEL[gift.audience]}</td>
                  <td className="px-4 py-3 text-ink/70">{formatPrice(gift.price)}</td>
                  <td className="px-4 py-3">
                    {gift.reservedByName ? (
                      <span className="rounded-full bg-gold-light/50 px-2.5 py-1 text-xs font-medium text-wine-700">
                        Reservado por {gift.reservedByName}
                      </span>
                    ) : gift.isActive ? (
                      <span className="rounded-full bg-wine-50 px-2.5 py-1 text-xs font-medium text-wine-700">
                        Disponível
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/50">
                        Oculto
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {gift.reservedByName && (
                        <button
                          onClick={() => handleRelease(gift.id)}
                          disabled={pendingId === gift.id}
                          className="text-xs font-medium text-wine-500 hover:underline"
                        >
                          Liberar
                        </button>
                      )}
                      <Link
                        href={`/admin/presentes/${gift.id}`}
                        className="text-xs font-medium text-wine-500 hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(gift.id, gift.name)}
                        disabled={pendingId === gift.id}
                        className="text-xs font-medium text-ink/50 hover:text-wine-700 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
