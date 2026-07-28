import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...(parsed.data.coupleName !== undefined && { coupleName: parsed.data.coupleName }),
      ...(parsed.data.welcomeMessage !== undefined && { welcomeMessage: parsed.data.welcomeMessage || "" }),
      ...(parsed.data.footerMessage !== undefined && { footerMessage: parsed.data.footerMessage || "" }),
      ...(parsed.data.weddingDate !== undefined && { weddingDate: parsed.data.weddingDate }),
      ...(parsed.data.heroImageKey !== undefined && { heroImageKey: parsed.data.heroImageKey || null }),
    },
    create: {
      id: "singleton",
      coupleName: parsed.data.coupleName ?? "Noivos",
      welcomeMessage: parsed.data.welcomeMessage || "",
      footerMessage: parsed.data.footerMessage || "",
      weddingDate: parsed.data.weddingDate ?? new Date(),
      heroImageKey: parsed.data.heroImageKey || null,
    },
  });

  return NextResponse.json(settings);
}
