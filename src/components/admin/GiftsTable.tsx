"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { imageUrl, formatPrice } from "@/lib/utils";

type GiftRow = {
  id: string;
  name: string;
  imageKey: string | null;
  price: string | number | null;
  isActive: boolean;
  category: { name: string };
  reservedByName: string | null;
};

export function GiftsTable({ gifts }: { gifts: GiftRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

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

  if (gifts.length === 0) {
    return <p className="mt-8 text-ink/50">Nenhum presente cadastrado ainda.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-wine-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-wine-100 bg-wine-50/60 text-xs uppercase tracking-wide text-ink/60">
          <tr>
            <th className="px-4 py-3">Presente</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift.id} className="border-b border-wine-50 last:border-0">
              <td className="flex items-center gap-3 px-4 py-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-wine-50">
                  <Image src={imageUrl(gift.imageKey)} alt="" fill className="object-cover" />
                </div>
                <span className="font-medium text-ink">{gift.name}</span>
              </td>
              <td className="px-4 py-3 text-ink/70">{gift.category.name}</td>
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
  );
}
