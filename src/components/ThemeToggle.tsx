import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0 text-muted-foreground/90 hover:text-foreground hover:bg-accent/30"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
};

export default ThemeToggle;
