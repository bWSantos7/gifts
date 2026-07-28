"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { imageUrl } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";

type PhotoRow = { id: string; imageKey: string; caption: string | null };

export function GalleryManager({ photos }: { photos: PhotoRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleUpload(key: string) {
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageKey: key, order: photos.length }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setPendingId(null);
    router.refresh();
  }

  return (
    <div>
      <ImageUploader folder="gallery" value={null} onChange={handleUpload} label="Adicionar foto" />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-wine-50">
            <Image src={imageUrl(photo.imageKey)} alt={photo.caption ?? ""} fill className="object-cover" />
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={pendingId === photo.id}
              className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-wine-700 opacity-0 transition-opacity group-hover:opacity-100"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && <p className="mt-6 text-ink/50">Nenhuma foto na galeria ainda.</p>}
    </div>
  );
}
