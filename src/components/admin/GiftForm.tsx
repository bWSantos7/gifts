"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { STORE_OPTIONS } from "@/lib/validation";
import type { CategoryDTO } from "@/types";

type GiftFormValues = {
  id?: string;
  name: string;
  description: string;
  price: string;
  imageKey: string | null;
  purchaseUrl: string;
  storeName: string;
  categoryId: string;
  isActive: boolean;
};

export function GiftForm({
  categories,
  initialValues,
}: {
  categories: CategoryDTO[];
  initialValues?: GiftFormValues;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);

  const [values, setValues] = useState<GiftFormValues>(
    initialValues ?? {
      name: "",
      description: "",
      price: "",
      imageKey: null,
      purchaseUrl: "",
      storeName: "",
      categoryId: categories[0]?.id ?? "",
      isActive: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      description: values.description,
      price: values.price === "" ? null : Number(values.price),
      imageKey: values.imageKey ?? "",
      purchaseUrl: values.purchaseUrl,
      storeName: values.storeName,
      categoryId: values.categoryId,
      isActive: values.isActive,
    };

    const url = isEditing ? `/api/admin/gifts/${initialValues!.id}` : "/api/admin/gifts";
    const res = await fetch(url, {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível salvar o presente.");
      return;
    }

    router.push("/admin/presentes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <ImageUploader
        folder="gifts"
        label="Foto do presente"
        value={values.imageKey}
        onChange={(key) => setValues((v) => ({ ...v, imageKey: key }))}
      />

      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Valor aproximado (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <select
            id="categoryId"
            required
            value={values.categoryId}
            onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
            className="w-full rounded-lg border border-wine-100 bg-white px-4 py-2.5 focus:border-wine-500 focus:outline-none focus:ring-2 focus:ring-wine-500/20"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchaseUrl">Link de compra</Label>
          <Input
            id="purchaseUrl"
            type="url"
            required
            placeholder="https://…"
            value={values.purchaseUrl}
            onChange={(e) => setValues((v) => ({ ...v, purchaseUrl: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="storeName">Loja</Label>
          <select
            id="storeName"
            value={values.storeName}
            onChange={(e) => setValues((v) => ({ ...v, storeName: e.target.value }))}
            className="w-full rounded-lg border border-wine-100 bg-white px-4 py-2.5 focus:border-wine-500 focus:outline-none focus:ring-2 focus:ring-wine-500/20"
          >
            <option value="">Selecione…</option>
            {STORE_OPTIONS.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
          className="h-4 w-4 rounded border-wine-100 text-wine-500 focus:ring-wine-500/20"
        />
        Visível na lista pública
      </label>

      {error && <p className="text-sm text-wine-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Salvar presente"}
        </Button>
      </div>
    </form>
  );
}
