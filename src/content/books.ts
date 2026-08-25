import type { TranslationKey } from "@/i18n/types";

export const BOOK_CATEGORIES = [
  "philosophy",
  "history",
  "literature",
  "law",
  "management",
  "psychology",
  "biography",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
}

export const GOODREADS_PROFILE_URL =
  "https://www.goodreads.com/user/show/54238676-camila-escudero";

export const BOOK_CATEGORY_LABEL_KEYS: Record<BookCategory, TranslationKey> = {
  philosophy: "books.category.philosophy",
  history: "books.category.history",
  literature: "books.category.literature",
  law: "books.category.law",
  management: "books.category.management",
  psychology: "books.category.psychology",
  biography: "books.category.biography",
};

const CATEGORY_SORT_ORDER: Record<BookCategory, number> = {
  philosophy: 0,
  history: 1,
  literature: 2,
  law: 3,
  management: 4,
  psychology: 5,
  biography: 6,
};

const catalog: Book[] = [
  {
    id: "republic",
    title: "The Republic",
    author: "Plato",
    category: "philosophy",
  },
  {
    id: "sophies-world",
    title: "El Mundo de Sofía",
    author: "Jostein Gaarder",
    category: "philosophy",
  },
  {
    id: "essay-concerning-human-understanding",
    title: "Ensayo sobre el entendimiento humano",
    author: "John Locke",
    category: "philosophy",
  },
  {
    id: "filosofia-en-11-frases",
    title: "Filosofía en 11 frases",
    author: "Darío Sztajnszrajber",
    category: "philosophy",
  },
  {
    id: "expulsion-of-the-triumphant-beast",
    title: "Expulsión de la bestia triunfante / Los heroicos furores",
    author: "Giordano Bruno",
    category: "philosophy",
  },
  {
    id: "nicomachean-ethics",
    title: "Ética a Nicómaco",
    author: "Aristotle",
    category: "philosophy",
  },
  {
    id: "chuquicamata",
    title: "Chuquicamata",
    author: "Pascale Bonnefoy",
    category: "history",
  },
  {
    id: "lessons-of-history",
    title: "The Lessons of History",
    author: "Will Durant",
    category: "history",
  },
  {
    id: "name-of-the-rose",
    title: "The Name of the Rose",
    author: "Umberto Eco",
    category: "literature",
  },
  {
    id: "el-coronel-no-tiene-quien-le-escriba",
    title: "El coronel no tiene quien le escriba",
    author: "Gabriel García Márquez",
    category: "literature",
  },
  {
    id: "casa-de-campo",
    title: "Casa de campo",
    author: "José Donoso",
    category: "literature",
  },
  {
    id: "fundamentos-del-derecho-laboral",
    title: "Fundamentos del Derecho laboral",
    author: "Sergio Gamonal",
    category: "law",
  },
  {
    id: "history-of-management-thought",
    title: "The History of Management Thought",
    author: "Daniel Wren",
    category: "management",
  },
  {
    id: "stay-sane-in-an-insane-world",
    title: "Stay Sane in an Insane World: How to Control the Controllables and Thrive",
    author: "Greg Harden",
    category: "psychology",
  },
  {
    id: "prophet-of-innovation",
    title: "Prophet of Innovation: Joseph Schumpeter and Creative Destruction",
    author: "Thomas McCraw",
    category: "biography",
  },
];

export const books: Book[] = [...catalog].sort((left, right) => {
  const categoryDelta = CATEGORY_SORT_ORDER[left.category] - CATEGORY_SORT_ORDER[right.category];
  if (categoryDelta !== 0) {
    return categoryDelta;
  }

  return left.title.localeCompare(right.title, "en", { sensitivity: "base" });
});
