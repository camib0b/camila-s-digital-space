import type { Language } from "@/i18n/types";

function isConcatPath(pathname: string): boolean {
  return pathname === "/concat" || pathname.startsWith("/concat/");
}

/**
 * A cold visit to /ava stays Spanish. A visitor who is already reading the site
 * keeps that language, including the English home page, which does not write
 * a saved choice until the toggle is used.
 */
export function languageAfterNavigation(
  saved: Language | null,
  current: Language,
  pathname: string,
  deviceLanguage: Language,
): Language {
  if (saved) {
    return saved;
  }
  if (pathname.startsWith("/ava")) {
    return current;
  }
  if (isConcatPath(pathname)) {
    return deviceLanguage;
  }
  return "en";
}
