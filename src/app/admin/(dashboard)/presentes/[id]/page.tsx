import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GiftForm } from "@/components/admin/GiftForm";

export default async function EditGiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [gift, categories] = await Promise.all([
    prisma.gift.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!gift) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Editar presente</h1>
      <div className="mt-6">
        <GiftForm
          categories={categories}
          initialValues={{
            id: gift.id,
            name: gift.name,
            description: gift.description ?? "",
            price: gift.price ? gift.price.toString() : "",
            imageKey: gift.imageKey,
            purchaseUrl: gift.purchaseUrl,
            storeName: gift.storeName ?? "",
            categoryId: gift.categoryId,
            audience: gift.audience,
            isActive: gift.isActive,
          }}
        />
      </div>
    </div>
  );
}
