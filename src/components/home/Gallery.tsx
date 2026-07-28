import Image from "next/image";
import { imageUrl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import type { GalleryPhotoDTO } from "@/types";

export function Gallery({ photos }: { photos: GalleryPhotoDTO[] }) {
  if (photos.length === 0) return null;

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Momentos</span>
        <h2 className="mt-3 font-display text-3xl text-wine-700 sm:text-4xl">Nossa galeria</h2>
      </div>

      <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={imageUrl(photo.imageKey)}
              alt={photo.caption ?? "Foto do casal"}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
