import { z } from "zod";

export const STORE_OPTIONS = ["Mercado Livre", "Amazon", "Shein", "Shopee", "Outros"] as const;

export const GIFT_AUDIENCES = ["GUESTS", "GODPARENTS", "BOTH"] as const;

export const reserveGiftSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo").max(80),
});

export const giftSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce.number().nonnegative().optional().nullable(),
  imageKey: z.string().trim().optional().or(z.literal("")),
  purchaseUrl: z.string().trim().url("Informe um link válido"),
  storeName: z.string().trim().max(60).optional().or(z.literal("")),
  categoryId: z.string().trim().min(1, "Selecione uma categoria"),
  audience: z.enum(GIFT_AUDIENCES).optional(),
  order: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(60),
  order: z.coerce.number().int().optional(),
});

export const gallerySchema = z.object({
  imageKey: z.string().trim().min(1),
  caption: z.string().trim().max(160).optional().or(z.literal("")),
  order: z.coerce.number().int().optional(),
});

export const settingsSchema = z.object({
  coupleName: z.string().trim().min(1).max(120),
  welcomeMessage: z.string().trim().max(1000).optional().or(z.literal("")),
  footerMessage: z.string().trim().max(500).optional().or(z.literal("")),
  weddingDate: z.coerce.date(),
  heroImageKey: z.string().trim().optional().or(z.literal("")),
});
