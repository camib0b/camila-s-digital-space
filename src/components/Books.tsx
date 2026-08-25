import { useLanguage } from "@/contexts/LanguageContext";
import {
  books,
  BOOK_CATEGORY_LABEL_KEYS,
  GOODREADS_PROFILE_URL,
} from "@/content/books";

const Books = () => {
  const { t } = useLanguage();

  return (
    <section id="books" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-2">
            {t("books.label")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            {t("books.description")}
          </p>
          <a
            href={GOODREADS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline inline-block mb-10"
          >
            {t("books.goodreads")}
          </a>

          <div className="space-y-6">
            {books.map((book, index) => (
              <div key={book.id}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <p className="font-medium text-foreground">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {t(BOOK_CATEGORY_LABEL_KEYS[book.category])}
                  </p>
                </div>
                {index < books.length - 1 && (
                  <div className="border-b border-border/60 mt-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Books;
