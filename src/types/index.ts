export type GiftAudience = "GUESTS" | "GODPARENTS";

export type GiftDTO = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  imageKey: string | null;
  purchaseUrl: string;
  storeName: string | null;
  order: number;
  isActive: boolean;
  audience: GiftAudience;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  reservedByName: string | null;
  reservedAt: string | null;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type GalleryPhotoDTO = {
  id: string;
  imageKey: string;
  caption: string | null;
  order: number;
};
