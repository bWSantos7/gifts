"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/utils";

export function ImageUploader({
  folder,
  value,
  onChange,
  label,
}: {
  folder: "gifts" | "hero" | "gallery";
  value: string | null;
  onChange: (key: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Falha ao enviar imagem.");
        return;
      }
      onChange(data.key);
    } catch {
      setError("Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-ink/80">{label}</p>}
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-wine-100 bg-wine-50">
          {value && <Image src={imageUrl(value)} alt="" fill className="object-cover" />}
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-wine-500 px-4 py-1.5 text-sm font-medium text-wine-500 transition-colors hover:bg-wine-50 disabled:opacity-50"
          >
            {uploading ? "Enviando…" : value ? "Trocar imagem" : "Enviar imagem"}
          </button>
          {error && <p className="mt-1 text-xs text-wine-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
