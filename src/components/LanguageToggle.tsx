import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
  ] as const;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
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
              "text-[11px] font-medium tracking-[0.18em] uppercase",
              isActive
                ? "bg-secondary/70 text-foreground border border-border/60 shadow-none"
                : "text-muted-foreground/90 hover:text-foreground hover:bg-accent/30",
            ].join(" ")}
            aria-pressed={isActive}
            aria-label={`Switch to ${lang.code === "en" ? "English" : "Spanish"}`}
          >
            {lang.label}
          </Button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
