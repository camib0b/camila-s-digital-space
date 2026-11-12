import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import type { TranslationKey } from "@/i18n/types";

const languages = [
  { code: "en", label: "EN", nameKey: "language.english" },
  { code: "es", label: "ES", nameKey: "language.spanish" },
] as const satisfies ReadonlyArray<{ code: "en" | "es"; label: string; nameKey: TranslationKey }>;

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("language.group")}>
      {languages.map((lang) => {
        const isActive = language === lang.code;

        return (
          <Button
            key={lang.code}
            type="button"
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            className={[
              "h-8 px-3 min-w-[2.5rem]",
              "text-[11px] font-medium tracking-[0.18em]",
              isActive
                ? "bg-secondary/70 text-foreground border border-border/60 shadow-none"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {lang.label}
            <span className="sr-only">, {t(lang.nameKey)}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
