"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const ADDRESS = "Rua Arthur Gaspar Viana, N° 90 - Bairro Jardim Santa Maria";

export function ShippingAddressModal({
  onClose,
  onContinue,
}: {
  onClose: () => void;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível; o endereço já está visível para cópia manual.
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl text-wine-700">Antes de continuar</h3>
        <p className="mt-2 text-sm text-ink/60">
          Se preferir, você pode enviar o presente diretamente para o nosso endereço:
        </p>

        <div className="mt-4 rounded-lg border border-wine-100 bg-wine-50/60 px-4 py-3">
          <p className="text-sm font-medium text-ink">{ADDRESS}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-2 text-xs font-medium text-wine-500 underline-offset-2 hover:underline"
        >
          {copied ? "Endereço copiado!" : "Copiar endereço"}
        </button>

        <p className="mt-4 text-xs text-ink/50">
          Isso é só uma opção, não é obrigatório — você também pode levar o presente pessoalmente.
        </p>

        <div className="flex gap-3 pt-5">
          <Button type="button" variant="outline" className="flex-1 justify-center" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" className="flex-1 justify-center" onClick={onContinue}>
            Continuar para a loja
          </Button>
        </div>
      </div>
    </div>
  );
}
