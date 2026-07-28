import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { GiftsTable } from "@/components/admin/GiftsTable";

export default async function AdminGiftsPage() {
  const gifts = await prisma.gift.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-wine-700">Presentes</h1>
          <p className="mt-1 text-ink/60">{gifts.length} presente(s) cadastrado(s).</p>
        </div>
        <Link href="/admin/presentes/novo">
          <Button>Novo presente</Button>
        </Link>
      </div>

      <GiftsTable
        gifts={gifts.map((g) => ({
          id: g.id,
          name: g.name,
          imageKey: g.imageKey,
          price: g.price ? g.price.toString() : null,
          isActive: g.isActive,
          audience: g.audience,
          category: { name: g.category.name },
          reservedByName: g.reservedByName,
        }))}
      />
    </div>
  );
}
