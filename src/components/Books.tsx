import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  books,
  BOOK_CATEGORY_LABEL_KEYS,
  GOODREADS_PROFILE_URL,
} from "@/content/books";

const MOBILE_COLLAPSED_BOOK_COUNT = 5;
const DESKTOP_COLLAPSED_BOOK_COUNT = 6;
const BOOK_INDEX_ID = "reading-list-index";

const Books = () => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

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

          <div
            id={BOOK_INDEX_ID}
            className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8"
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className={[
                  "border-b border-border/60 py-4",
                  !isExpanded && index === MOBILE_COLLAPSED_BOOK_COUNT
                    ? "hidden md:block"
                    : "",
                  !isExpanded && index >= DESKTOP_COLLAPSED_BOOK_COUNT
                    ? "hidden"
                    : "",
                ].join(" ")}
              >
                <p className="font-medium text-foreground leading-snug">{book.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {book.author}
                  <span aria-hidden="true"> · </span>
                  {t(BOOK_CATEGORY_LABEL_KEYS[book.category])}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            aria-expanded={isExpanded}
            aria-controls={BOOK_INDEX_ID}
            className="mt-6 inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted/60 transition-colors duration-200"
          >
            {t(isExpanded ? "books.showFewer" : "books.showAll")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Books;
