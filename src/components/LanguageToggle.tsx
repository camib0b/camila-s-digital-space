import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    if (language === "en") {
      setLanguage("es");
    } else if (language === "es") {
      setLanguage("fr");
    } else {
      setLanguage("en");
    }
  };

  const getNextLanguage = () => {
    if (language === "en") return "Espagnol";
    if (language === "es") return "Français";
    return "Anglais";
  };

  const getLanguageCode = () => {
    if (language === "en") return "ES";
    if (language === "es") return "FR";
    return "EN";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      aria-label={`Switch to ${getNextLanguage()}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium text-xs uppercase tracking-wide">
        {getLanguageCode()}
      </span>
    </Button>
  );
};

export default LanguageToggle;
