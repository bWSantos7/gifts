import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeProductPage } from "@/lib/scrape-product";
import { uploadObject } from "@/lib/s3";
import { slugify } from "@/lib/utils";
import { fetchProductSchema } from "@/lib/validation";

export const runtime = "nodejs";

async function downloadAndStoreImage(imageUrl: string, hintName: string | null): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;

    const extension = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : "jpg";

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength === 0 || buffer.byteLength > 8 * 1024 * 1024) return null;

    const baseName = slugify(hintName ?? "produto") || "produto";
    const key = `gifts/${randomUUID()}-${baseName}.${extension}`;
    await uploadObject(key, buffer, contentType.split(";")[0]);
    return key;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = fetchProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Link inválido." }, { status: 400 });
  }

  try {
    const product = await scrapeProductPage(parsed.data.url);
    const imageKey = product.imageUrl
      ? await downloadAndStoreImage(product.imageUrl, product.name)
      : null;

    return NextResponse.json({
      name: product.name,
      price: product.price,
      storeName: product.storeName,
      imageKey,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não foi possível ler os dados deste link.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
