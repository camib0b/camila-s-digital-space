import { Link } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import PatternedBackground from "@/components/PatternedBackground";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL } from "@/content/contact";
import type { TranslationKey } from "@/i18n/types";

const notFoundDestinations: ReadonlyArray<{ labelKey: TranslationKey; path: string }> = [
  { labelKey: "notFound.home", path: "/" },
  { labelKey: "notFound.projects", path: "/#personal-projects" },
  { labelKey: "notFound.ava", path: "/ava" },
  { labelKey: "notFound.cv", path: "/cv" },
];

/** Same text treatment as the site footer nav, with a 44px target and a focus ring. */
const notFoundNavigationLinkClassName = [
  "inline-flex min-h-11 min-w-11 max-w-full cursor-pointer items-center justify-center px-3",
  "text-sm text-foreground",
  "transition-colors duration-hover ease-hover",
  "hover:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

/** Pressed language text uses the background token on a foreground fill so the state clears 4.5:1. */
const notFoundHeaderControlClassName = [
  "flex items-center justify-end gap-2",
  "[&_button]:h-11 [&_button]:min-h-11 [&_button]:min-w-11",
  "[&_button]:cursor-pointer [&_button:disabled]:cursor-default",
  "[&_button]:text-foreground",
  "[&_button[aria-pressed='true']]:border-transparent",
  "[&_button[aria-pressed='true']]:bg-foreground",
  "[&_button[aria-pressed='true']]:text-background",
].join(" ");

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-svh flex-col bg-background text-foreground">
      <PatternedBackground />
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="px-6 pt-6 md:px-8">
          <div className={notFoundHeaderControlClassName}>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        <div className="container flex flex-1 flex-col justify-center px-6 py-6 md:px-8">
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground">
              {t("notFound.label")}
            </p>
            <h1 className="mt-3 max-w-xl">{t("notFound.message")}</h1>
            <nav className="mt-4" aria-label={t("notFound.nav")}>
              <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {notFoundDestinations.map((destination) => (
                  <li key={destination.path}>
                    <Link to={destination.path} className={notFoundNavigationLinkClassName}>
                      <span className="link-underline">{t(destination.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground">
              {t("notFound.report")}
              <a href={`mailto:${CONTACT_EMAIL}`} className={notFoundNavigationLinkClassName}>
                <span className="link-underline min-w-0 break-all">{CONTACT_EMAIL}</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
