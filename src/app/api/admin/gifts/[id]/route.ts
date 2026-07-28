import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { giftSchema } from "@/lib/validation";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = giftSchema.partial().extend({
  releaseReservation: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const { releaseReservation, ...data } = parsed.data;

  const gift = await prisma.gift.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.imageKey !== undefined && { imageKey: data.imageKey || null }),
      ...(data.purchaseUrl !== undefined && { purchaseUrl: data.purchaseUrl }),
      ...(data.storeName !== undefined && { storeName: data.storeName || null }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.audience !== undefined && { audience: data.audience }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(releaseReservation && { reservedByName: null, reservedByIp: null, reservedAt: null }),
    },
  });

  return NextResponse.json(gift);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  await prisma.gift.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
