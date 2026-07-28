import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/utils";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = ["Casa", "Cozinha", "Quarto", "Eletrodomésticos", "Decoração"];

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      coupleName: "K & B",
      welcomeMessage:
        "Com muito amor, convidamos você para celebrar conosco o início da nossa nova jornada juntos.",
      footerMessage: "Obrigado por fazer parte da nossa história. Com carinho, K & B.",
      weddingDate: new Date(new Date().getFullYear() + 1, 0, 1),
    },
  });

  for (const [index, name] of DEFAULT_CATEGORIES.entries()) {
    const slug = slugify(name);
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, order: index },
    });
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed.");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Administrador" },
  });

  console.log("Seed concluído.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
