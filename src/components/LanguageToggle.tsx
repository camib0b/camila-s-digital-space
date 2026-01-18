import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      aria-label={`Switch to ${language === "en" ? "Spanish" : "English"}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium text-xs uppercase tracking-wide">
        {language === "en" ? "ES" : "EN"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
