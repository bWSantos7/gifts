import { prisma } from "@/lib/prisma";
import { GiftForm } from "@/components/admin/GiftForm";

export default async function NewGiftPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Novo presente</h1>
      <div className="mt-6">
        <GiftForm categories={categories} />
      </div>
    </div>
  );
}
