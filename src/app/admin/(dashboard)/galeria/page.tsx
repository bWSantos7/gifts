import { prisma } from "@/lib/prisma";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Galeria</h1>
      <p className="mt-1 text-ink/60">Fotos do casal exibidas na página inicial.</p>

      <div className="mt-6">
        <GalleryManager photos={photos} />
      </div>
    </div>
  );
}
