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
      className="theme-toggle h-8 w-8 p-0 text-muted-foreground/90 hover:text-foreground hover:bg-accent/30"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className="theme-toggle-icon-stack">
        <Sun
          className="theme-toggle-icon h-4 w-4"
          data-visible={isDark ? "true" : "false"}
        />
        <Moon
          className="theme-toggle-icon h-4 w-4"
          data-visible={isDark ? "false" : "true"}
        />
      </span>
    </Button>
  );
};

export default ThemeToggle;
