import { s3, getObjectCommand } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  try {
    const obj = await s3.send(getObjectCommand(key));
    if (!obj.Body) return new Response(null, { status: 404 });

    return new Response(obj.Body.transformToWebStream(), {
      headers: {
        "Content-Type": obj.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
