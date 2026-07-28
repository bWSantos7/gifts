import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;

  return {
    id: "singleton",
    coupleName: "Noivos",
    welcomeMessage: "",
    footerMessage: "",
    weddingDate: new Date(),
    heroImageKey: null,
    updatedAt: new Date(),
  };
}
