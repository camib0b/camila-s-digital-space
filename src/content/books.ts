import type { TranslationKey } from "@/i18n/types";

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  reviewKey: TranslationKey;
}

export const books: Book[] = [
  {
    id: "republic",
    title: "The Republic",
    author: "Plato",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    reviewKey: "books.republic.review",
  },
  {
    id: "sophies-world",
    title: "El Mundo de Sofía",
    author: "Jostein Gaarder",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    reviewKey: "books.sophiesWorld.review",
  },
  {
    id: "chuquicamata",
    title: "Chuquicamata",
    author: "Pascale Bonnefoy",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    reviewKey: "books.chuquicamata.review",
  },
  {
    id: "name-of-the-rose",
    title: "The Name of the Rose",
    author: "Umberto Eco",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
    reviewKey: "books.nameOfTheRose.review",
  },
];
