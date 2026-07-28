"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type CategoryRow = { id: string; name: string; giftCount: number };

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível criar a categoria.");
      return;
    }
    setNewName("");
    router.refresh();
  }

  async function handleRename(id: string) {
    if (!editingName.trim()) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, giftCount: number) {
    if (giftCount > 0) {
      alert("Mova ou remova os presentes desta categoria antes de excluí-la.");
      return;
    }
    if (!confirm("Remover esta categoria?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleCreate} className="flex gap-3">
        <Input
          placeholder="Nova categoria"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <Button type="submit" disabled={saving}>
          Adicionar
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-wine-700">{error}</p>}

      <ul className="mt-6 divide-y divide-wine-50 rounded-xl border border-wine-100 bg-white">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between gap-3 px-4 py-3">
            {editingId === cat.id ? (
              <Input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRename(cat.id)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(cat.id)}
              />
            ) : (
              <span className="text-ink">{cat.name}</span>
            )}
            <div className="flex shrink-0 items-center gap-4 text-xs">
              <span className="text-ink/40">{cat.giftCount} presente(s)</span>
              <button
                onClick={() => {
                  setEditingId(cat.id);
                  setEditingName(cat.name);
                }}
                className="font-medium text-wine-500 hover:underline"
              >
                Renomear
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.giftCount)}
                className="font-medium text-ink/50 hover:text-wine-700 hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
