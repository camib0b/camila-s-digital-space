import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  reviewKey: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Republic",
    author: "Plato",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    reviewKey: "books.book1.review",
  },
  {
    id: 2,
    title: "El Mundo de Sofía",
    author: "Jostein Gaarder",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    reviewKey: "books.book2.review",
  },
  {
    id: 3,
    title: "Chuquicamata",
    author: "Pascale Bonnefoy",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    reviewKey: "books.book3.review",
  },
  {
    id: 4,
    title: "The Name of the Rose",
    author: "Umberto Eco",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
    reviewKey: "books.book4.review",
  },
];

const BookCard = ({ book, t }: { book: Book; t: (key: string) => string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => e.key === "Enter" && setIsFlipped(!isFlipped)}
      tabIndex={0}
      role="button"
      aria-label={`${book.title} by ${book.author}`}
    >
      <div
        className={`relative w-full aspect-[2/3] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-md overflow-hidden border border-border">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
            <p className="text-sm font-medium text-foreground leading-tight">{book.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-md overflow-hidden bg-card border border-border">
          <div className="h-full p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t("books.myTake")}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(book.reviewKey)}
              </p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm font-medium text-foreground">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Books = () => {
  const { t } = useLanguage();

  return (
    <section id="books" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-2">
            {t("books.label")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            {t("books.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {books.map((book) => (
            <BookCard key={book.id} book={book} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
