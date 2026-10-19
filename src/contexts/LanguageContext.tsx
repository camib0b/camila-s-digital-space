import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import en from "@/i18n/en";
import es from "@/i18n/es";
import type { Language, TranslationKey } from "@/i18n/types";

const LANGUAGE_STORAGE_KEY = "language";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  es,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "es";
}

function readSavedLanguage(): Language | null {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(saved) ? saved : null;
}

function defaultLanguageForPath(pathname: string): Language {
  return pathname.startsWith("/ava") ? "es" : "en";
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [language, setLanguageState] = useState<Language>(
    () => readSavedLanguage() ?? defaultLanguageForPath(window.location.pathname)
  );

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    if (readSavedLanguage()) {
      return;
    }
    setLanguageState(defaultLanguageForPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
