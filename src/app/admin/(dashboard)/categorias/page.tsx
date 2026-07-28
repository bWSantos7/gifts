import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { gifts: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Categorias</h1>
      <p className="mt-1 text-ink/60">Organize as categorias usadas para filtrar os presentes.</p>

      <div className="mt-6">
        <CategoriesManager
          categories={categories.map((c) => ({ id: c.id, name: c.name, giftCount: c._count.gifts }))}
        />
      </div>
    </div>
  );
}
