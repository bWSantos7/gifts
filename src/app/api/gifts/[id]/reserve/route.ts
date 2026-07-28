import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/request-ip";
import { reserveGiftSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = reserveGiftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }

  const gift = await prisma.gift.findUnique({ where: { id } });
  if (!gift || !gift.isActive) {
    return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
  }

  const ip = getClientIp(request);
  const result = await prisma.gift.updateMany({
    where: { id, reservedByName: null },
    data: { reservedByName: parsed.data.name, reservedByIp: ip, reservedAt: new Date() },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Este presente já foi reservado." }, { status: 409 });
  }

  const updated = await prisma.gift.findUnique({ where: { id } });
  return NextResponse.json({
    reservedByName: updated?.reservedByName ?? null,
    reservedAt: updated?.reservedAt ?? null,
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = await prisma.gift.findUnique({ where: { id } });
  if (!gift || !gift.reservedByName) {
    return NextResponse.json({ error: "Este presente não está reservado." }, { status: 404 });
  }

  const ip = getClientIp(request);
  if (gift.reservedByIp !== ip) {
    return NextResponse.json(
      { error: "Só quem reservou, pela mesma rede/dispositivo, pode cancelar." },
      { status: 403 }
    );
  }

  await prisma.gift.update({
    where: { id },
    data: { reservedByName: null, reservedByIp: null, reservedAt: null },
  });

  return NextResponse.json({ ok: true });
}
