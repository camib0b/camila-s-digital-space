import { useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  review: string;
  rotation: number;
  yOffset: number;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Republic",
    author: "Plato",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    review: "A foundational text that shaped my understanding of justice and the ideal society. Plato's dialogues challenge you to question everything — governance, truth, and the nature of reality itself.",
    rotation: -2,
    yOffset: 0,
  },
  {
    id: 2,
    title: "El Mundo de Sofía",
    author: "Jostein Gaarder",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    review: "Philosophy made accessible through storytelling. This book ignited my curiosity about the big questions when I was younger. A perfect gateway into Western philosophical thought.",
    rotation: 1.5,
    yOffset: 12,
  },
  {
    id: 3,
    title: "Chuquicamata",
    author: "Pascale Bonnefoy",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    review: "Essential reading for understanding Chile's industrial history. Bonnefoy captures the human stories behind the world's largest open-pit copper mine — a lens into labor, community, and progress.",
    rotation: -1,
    yOffset: 4,
  },
  {
    id: 4,
    title: "The Name of the Rose",
    author: "Umberto Eco",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
    review: "A masterpiece of historical fiction wrapped in mystery. Eco weaves semiotics, medieval history, and detective narrative into something utterly captivating. Dense but rewarding.",
    rotation: 2,
    yOffset: 8,
  },
];

const BookCard = ({ book, index }: { book: Book; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 cursor-pointer"
      style={{
        transform: `translateY(${book.yOffset}px) rotate(${book.rotation}deg)`,
        animationDelay: `${index * 0.15}s`,
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => e.key === "Enter" && setIsFlipped(!isFlipped)}
      tabIndex={0}
      role="button"
      aria-label={`${book.title} by ${book.author}. Click to ${isFlipped ? "see cover" : "read review"}`}
    >
      <div
        className={`relative w-full aspect-[2/3] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front - Book Cover */}
        <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-card to-card/80" />
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-lg text-foreground font-medium leading-tight">
              {book.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">{book.author}</p>
          </div>
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>

        {/* Back - Review */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden bg-card border border-border/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  My Take
                </span>
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed">
                {book.review}
              </p>
            </div>
            <div className="pt-4 border-t border-border/30">
              <p className="text-primary font-display text-sm">{book.title}</p>
              <p className="text-muted-foreground text-xs">{book.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG wave pattern inspired by sound waves / mathematical representation
const WavePattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
  >
    {[...Array(8)].map((_, i) => (
      <path
        key={i}
        d={`M0,${300 + i * 15} Q300,${250 + Math.sin(i) * 50} 600,${300 + i * 15} T1200,${300 + i * 15}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-primary"
        style={{
          animation: `wave ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </svg>
);

const Books = () => {
  return (
    <section id="books" className="py-24 md:py-32 relative overflow-hidden">
      <WavePattern />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl mb-16 animate-fade-in">
          <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
            Reading List
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Books That Shaped My Thinking
          </h2>
          <p className="text-muted-foreground">
            Click any book to read my review. These texts have influenced how I approach 
            problems, understand systems, and see the world.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {books.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
