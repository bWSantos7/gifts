import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { giftSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const gifts = await prisma.gift.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });
  return NextResponse.json(gifts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = giftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const gift = await prisma.gift.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price ?? null,
      imageKey: parsed.data.imageKey || null,
      purchaseUrl: parsed.data.purchaseUrl,
      storeName: parsed.data.storeName || null,
      categoryId: parsed.data.categoryId,
      order: parsed.data.order ?? 0,
      isActive: parsed.data.isActive ?? true,
    },
  });

  return NextResponse.json(gift, { status: 201 });
}
