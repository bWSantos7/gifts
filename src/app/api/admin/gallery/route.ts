import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const maxOrder = await prisma.galleryPhoto.aggregate({ _max: { order: true } });
  const photo = await prisma.galleryPhoto.create({
    data: {
      imageKey: parsed.data.imageKey,
      caption: parsed.data.caption || null,
      order: parsed.data.order ?? (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
