"use client";

import Image from "next/image";
import { useState } from "react";
import { imageUrl, formatPrice } from "@/lib/utils";
import { useMyReservations } from "@/lib/my-reservations";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/gifts/FavoriteButton";
import { ShareButton } from "@/components/gifts/ShareButton";
import { ReserveModal } from "@/components/gifts/ReserveModal";
import { ShippingAddressModal } from "@/components/gifts/ShippingAddressModal";
import type { GiftDTO } from "@/types";

export function GiftCard({
  gift,
  highlighted,
  onReserved,
  onCancelled,
}: {
  gift: GiftDTO;
  highlighted?: boolean;
  onReserved: (giftId: string) => void;
  onCancelled: (giftId: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { isMine, markReserved, markCancelled } = useMyReservations();

  const isReserved = gift.isReserved;
  const canCancel = isReserved && isMine(gift.id);

  async function handleConfirmReserve(name: string): Promise<string | null> {
    const res = await fetch(`/api/gifts/${gift.id}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Não foi possível reservar este presente.";

    onReserved(gift.id);
    markReserved(gift.id);
    setShowModal(false);
    return null;
  }

  async function handleCancel() {
    setCancelling(true);
    const res = await fetch(`/api/gifts/${gift.id}/reserve`, { method: "DELETE" });
    setCancelling(false);
    if (res.ok) {
      onCancelled(gift.id);
      markCancelled(gift.id);
    }
  }

  return (
    <div
      id={`presente-${gift.id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-lg ${
        highlighted ? "border-gold ring-2 ring-gold/40" : "border-wine-100"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-wine-50">
        <Image
          src={imageUrl(gift.imageKey)}
          alt={gift.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            isReserved ? "grayscale opacity-70" : ""
          }`}
        />
        {isReserved && (
          <div className="absolute inset-x-0 top-0 bg-wine-900/85 px-3 py-1.5 text-center text-xs font-medium text-gold">
            Reservado
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-wine-700">
          {gift.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg text-wine-700">{gift.name}</h3>
        {gift.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{gift.description}</p>
        )}
        {gift.price && (
          <p className="mt-2 font-medium text-ink">{formatPrice(gift.price)}</p>
        )}

        <div className="mt-4 flex items-center gap-2">
          {isReserved ? (
            canCancel ? (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-full border border-wine-100 px-4 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-wine-50"
              >
                {cancelling ? "Cancelando…" : "Cancelar minha reserva"}
              </button>
            ) : (
              <span className="flex-1 rounded-full bg-wine-50 px-4 py-2.5 text-center text-sm font-medium text-wine-700">
                Indisponível
              </span>
            )
          ) : (
            <Button
              type="button"
              className="flex-1 justify-center"
              onClick={() => setShowShippingModal(true)}
            >
              Comprar{gift.storeName && gift.storeName !== "Outros" ? ` na ${gift.storeName}` : ""}
            </Button>
          )}
          <FavoriteButton giftId={gift.id} />
          <ShareButton giftId={gift.id} giftName={gift.name} />
        </div>

        {!isReserved && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-xs font-medium text-wine-500 underline-offset-2 hover:underline"
          >
            Já vou dar este presente
          </button>
        )}
      </div>

      {showModal && (
        <ReserveModal
          giftName={gift.name}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmReserve}
        />
      )}

      {showShippingModal && (
        <ShippingAddressModal
          onClose={() => setShowShippingModal(false)}
          onContinue={() => {
            setShowShippingModal(false);
            window.open(gift.purchaseUrl, "_blank", "noopener,noreferrer");
          }}
        />
      )}
    </div>
  );
}
