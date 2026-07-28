import * as cheerio from "cheerio";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
};

const STORE_BY_HOST: { match: string; label: string }[] = [
  { match: "mercadolivre", label: "Mercado Livre" },
  { match: "mercadolibre", label: "Mercado Livre" },
  { match: "amazon", label: "Amazon" },
  { match: "shein", label: "Shein" },
  { match: "shopee", label: "Shopee" },
  { match: "magazineluiza", label: "Magalu" },
  { match: "magalu", label: "Magalu" },
  { match: "casasbahia", label: "Casas Bahia" },
];

export function guessStoreName(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const match = STORE_BY_HOST.find((s) => host.includes(s.match));
    return match?.label ?? "Outros";
  } catch {
    return "Outros";
  }
}

function assertPublicHttpUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("URL inválida.");
  }
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\.|^169\.254\./.test(host)
  ) {
    throw new Error("URL não permitida.");
  }
  return url;
}

function extractJsonLdPrice($: cheerio.CheerioAPI): number | null {
  const scripts = $('script[type="application/ld+json"]').toArray();
  for (const script of scripts) {
    const raw = $(script).contents().text();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const candidates = item?.["@graph"] ? item["@graph"] : [item];
        for (const node of candidates) {
          const offers = node?.offers;
          const price = Array.isArray(offers) ? offers[0]?.price : offers?.price;
          if (price !== undefined) {
            const num = Number(String(price).replace(",", "."));
            if (!Number.isNaN(num) && num > 0) return num;
          }
        }
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }
  return null;
}

function extractMetaPrice($: cheerio.CheerioAPI): number | null {
  const selectors = [
    'meta[property="product:price:amount"]',
    'meta[property="og:price:amount"]',
    'meta[itemprop="price"]',
  ];
  for (const sel of selectors) {
    const val = $(sel).attr("content");
    if (val) {
      const num = Number(val.replace(/[^\d.,]/g, "").replace(",", "."));
      if (!Number.isNaN(num) && num > 0) return num;
    }
  }
  return null;
}

export type ScrapedProduct = {
  name: string | null;
  price: number | null;
  imageUrl: string | null;
  storeName: string;
};

const BLOCKED_PATH_HINTS = [
  "account-verification",
  "captcha",
  "validate",
  "/errors/",
  "sorry",
  "blocked",
  "access-denied",
];

export async function scrapeProductPage(rawUrl: string): Promise<ScrapedProduct> {
  const url = assertPublicHttpUrl(rawUrl);

  const res = await fetch(url.toString(), {
    headers: BROWSER_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Não foi possível acessar o link (status ${res.status}).`);
  }

  const finalUrlLower = res.url.toLowerCase();
  if (BLOCKED_PATH_HINTS.some((hint) => finalUrlLower.includes(hint))) {
    throw new Error(
      "Esta loja bloqueou a leitura automática deste link (proteção contra robôs). Preencha os dados manualmente."
    );
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const name =
    $('meta[property="og:title"]').attr("content")?.trim() ||
    $('meta[name="twitter:title"]').attr("content")?.trim() ||
    $("title").first().text().trim() ||
    null;

  let imageUrl =
    $('meta[property="og:image:secure_url"]').attr("content")?.trim() ||
    $('meta[property="og:image"]').attr("content")?.trim() ||
    $('meta[name="twitter:image"]').attr("content")?.trim() ||
    null;

  if (imageUrl) {
    try {
      imageUrl = new URL(imageUrl, url).toString();
    } catch {
      imageUrl = null;
    }
  }

  const price = extractJsonLdPrice($) ?? extractMetaPrice($);
  const storeName = guessStoreName(url.toString());

  if (!name && !imageUrl) {
    throw new Error(
      "Esta loja não permite a leitura automática deste link. Preencha nome, foto e valor manualmente."
    );
  }

  return { name, price, imageUrl, storeName };
}
