import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      aria-label={`Switch theme from ${theme}`}
    >
      <Palette className="w-4 h-4" />
      <span className="font-medium text-xs uppercase tracking-wide">
        {theme === "dark" ? "Blue" : theme === "blue" ? "Negroni" : "Dark"}
      </span>
    </Button>
  );
};

export default ThemeToggle;
