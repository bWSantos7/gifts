"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { STORE_OPTIONS } from "@/lib/validation";
import type { CategoryDTO, GiftAudience } from "@/types";

type GiftFormValues = {
  id?: string;
  name: string;
  description: string;
  price: string;
  imageKey: string | null;
  purchaseUrl: string;
  storeName: string;
  categoryId: string;
  audience: GiftAudience;
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
      audience: "GUESTS",
      isActive: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function handleFetchProduct() {
    if (!values.purchaseUrl) {
      setFetchError("Cole o link do produto primeiro.");
      return;
    }
    setFetching(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/admin/fetch-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: values.purchaseUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error ?? "Não foi possível ler os dados deste link.");
        return;
      }

      setValues((v) => ({
        ...v,
        name: data.name || v.name,
        price: data.price !== null && data.price !== undefined ? String(data.price) : v.price,
        storeName: STORE_OPTIONS.includes(data.storeName) ? data.storeName : v.storeName,
        imageKey: data.imageKey || v.imageKey,
      }));

      const missing: string[] = [];
      if (!data.name) missing.push("nome");
      if (!data.imageKey) missing.push("foto");
      if (!data.price) missing.push("valor");

      if (missing.length > 0) {
        setFetchError(
          `Não encontramos automaticamente: ${missing.join(", ")}. Preencha o que faltar manualmente.`
        );
      }
    } catch {
      setFetchError("Não foi possível ler os dados deste link.");
    } finally {
      setFetching(false);
    }
  }

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
      audience: values.audience,
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
      <div>
        <Label htmlFor="purchaseUrl">Link de compra</Label>
        <div className="flex gap-2">
          <Input
            id="purchaseUrl"
            type="url"
            required
            placeholder="Cole o link do produto (Mercado Livre, Amazon, Shopee…)"
            value={values.purchaseUrl}
            onChange={(e) => setValues((v) => ({ ...v, purchaseUrl: e.target.value }))}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleFetchProduct}
            disabled={fetching}
            className="shrink-0 whitespace-nowrap"
          >
            {fetching ? "Buscando…" : "Buscar dados"}
          </Button>
        </div>
        <p className="mt-1 text-xs text-ink/50">
          Buscamos foto, nome e valor automaticamente a partir do link. Confira sempre antes de salvar.
        </p>
        {fetchError && <p className="mt-1 text-sm text-wine-700">{fetchError}</p>}
      </div>

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
        <div>
          <Label htmlFor="audience">Lista</Label>
          <select
            id="audience"
            value={values.audience}
            onChange={(e) => setValues((v) => ({ ...v, audience: e.target.value as GiftAudience }))}
            className="w-full rounded-lg border border-wine-100 bg-white px-4 py-2.5 focus:border-wine-500 focus:outline-none focus:ring-2 focus:ring-wine-500/20"
          >
            <option value="GUESTS">Convidados</option>
            <option value="GODPARENTS">Padrinhos</option>
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
