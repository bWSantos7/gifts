"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";

function toDateInputValue(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

export function SettingsForm({
  initialValues,
}: {
  initialValues: {
    coupleName: string;
    welcomeMessage: string;
    footerMessage: string;
    weddingDate: Date;
    heroImageKey: string | null;
  };
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    coupleName: initialValues.coupleName,
    welcomeMessage: initialValues.welcomeMessage,
    footerMessage: initialValues.footerMessage,
    weddingDate: toDateInputValue(initialValues.weddingDate),
    heroImageKey: initialValues.heroImageKey,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        heroImageKey: values.heroImageKey ?? "",
        weddingDate: new Date(values.weddingDate).toISOString(),
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível salvar.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <ImageUploader
        folder="hero"
        label="Foto de capa (banner principal)"
        value={values.heroImageKey}
        onChange={(key) => setValues((v) => ({ ...v, heroImageKey: key }))}
      />

      <div>
        <Label htmlFor="coupleName">Nome do casal</Label>
        <Input
          id="coupleName"
          required
          value={values.coupleName}
          onChange={(e) => setValues((v) => ({ ...v, coupleName: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="weddingDate">Data do casamento</Label>
        <Input
          id="weddingDate"
          type="date"
          required
          value={values.weddingDate}
          onChange={(e) => setValues((v) => ({ ...v, weddingDate: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="welcomeMessage">Mensagem de boas-vindas</Label>
        <Textarea
          id="welcomeMessage"
          rows={4}
          value={values.welcomeMessage}
          onChange={(e) => setValues((v) => ({ ...v, welcomeMessage: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="footerMessage">Mensagem de agradecimento (rodapé)</Label>
        <Textarea
          id="footerMessage"
          rows={3}
          value={values.footerMessage}
          onChange={(e) => setValues((v) => ({ ...v, footerMessage: e.target.value }))}
        />
      </div>

      {error && <p className="text-sm text-wine-700">{error}</p>}
      {saved && <p className="text-sm text-wine-500">Alterações salvas.</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  );
}
