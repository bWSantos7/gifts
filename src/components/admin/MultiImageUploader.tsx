"use client";

import { useRef, useState } from "react";

export function MultiImageUploader({
  folder,
  onUploaded,
  label,
}: {
  folder: "gifts" | "hero" | "gallery";
  onUploaded: (keys: string[]) => void | Promise<void>;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    const keys: string[] = [];
    const failures: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          failures.push(file.name);
        } else {
          keys.push(data.key);
        }
      } catch {
        failures.push(file.name);
      }
      setProgress((p) => (p ? { done: p.done + 1, total: p.total } : p));
    }

    if (keys.length > 0) await onUploaded(keys);
    setError(failures.length > 0 ? `Não foi possível enviar: ${failures.join(", ")}` : null);
    setUploading(false);
    setProgress(null);
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-ink/80">{label}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) handleFiles(files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-full border border-wine-500 px-4 py-1.5 text-sm font-medium text-wine-500 transition-colors hover:bg-wine-50 disabled:opacity-50"
      >
        {uploading && progress ? `Enviando ${progress.done}/${progress.total}…` : "Adicionar fotos"}
      </button>
      {error && <p className="mt-1 text-xs text-wine-700">{error}</p>}
    </div>
  );
}
