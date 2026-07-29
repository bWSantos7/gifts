import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { imageUrl } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Gallery } from "@/components/home/Gallery";
import { GiftList } from "@/components/gifts/GiftList";
import type { GiftDTO } from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.coupleName} | Lista de Presentes`;
  const description =
    settings.welcomeMessage || `Lista de presentes de casamento de ${settings.coupleName}.`;
  const ogImage = settings.heroImageKey ? imageUrl(settings.heroImageKey) : "/img/monogram-wine.jpg";

  return {
    title,
    description,
    openGraph: { title, description, images: [ogImage] },
  };
}

export default async function HomePage() {
  const [settings, categories, gifts, galleryPhotos] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.gift.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } }),
  ]);

  const giftDTOs: GiftDTO[] = gifts.map((gift) => ({
    id: gift.id,
    name: gift.name,
    description: gift.description,
    price: gift.price ? gift.price.toString() : null,
    imageKey: gift.imageKey,
    purchaseUrl: gift.purchaseUrl,
    storeName: gift.storeName,
    order: gift.order,
    isActive: gift.isActive,
    audience: gift.audience,
    categoryId: gift.categoryId,
    categoryName: gift.category.name,
    categorySlug: gift.category.slug,
    reservedByName: gift.reservedByName,
    reservedAt: gift.reservedAt ? gift.reservedAt.toISOString() : null,
  }));

  return (
    <>
      <Header coupleName={settings.coupleName} />
      <main className="flex-1">
        <Hero
          coupleName={settings.coupleName}
          welcomeMessage={settings.welcomeMessage}
          weddingDate={settings.weddingDate}
          heroImageKey={settings.heroImageKey}
        />
        <Suspense>
          <GiftList initialGifts={giftDTOs} categories={categories} />
        </Suspense>
        <Gallery photos={galleryPhotos} />
      </main>
      <Footer coupleName={settings.coupleName} footerMessage={settings.footerMessage} />
    </>
  );
}
