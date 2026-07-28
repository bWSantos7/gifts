"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function ReserveModal({
  giftName,
  onClose,
  onConfirm,
}: {
  giftName: string;
  onClose: () => void;
  onConfirm: (name: string) => Promise<string | null>;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const errorMessage = await onConfirm(name);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
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
        <h3 className="font-display text-xl text-wine-700">Vou dar este presente</h3>
        <p className="mt-1 text-sm text-ink/60">
          &ldquo;{giftName}&rdquo; ficará marcado como indisponível para os outros convidados.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label htmlFor="reserve-name">Seu nome</Label>
            <Input
              id="reserve-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="Como você quer aparecer na lista"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-wine-700">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 justify-center" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 justify-center" disabled={submitting}>
              {submitting ? "Confirmando…" : "Confirmar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
