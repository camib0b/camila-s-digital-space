import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];

  // <Globe className="w-4 h-4 text-muted-foreground mr-1" />
  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-2">
     
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code as "en" | "es" | "fr")}
          className={`min-w-[2.5rem] h-7 text-xs font-medium uppercase tracking-wide transition-all duration-300 ${
            language === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          aria-label={`Switch to ${lang.code === "en" ? "English" : lang.code === "es" ? "Spanish" : "French"}`}
          aria-pressed={language === lang.code}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageToggle;
