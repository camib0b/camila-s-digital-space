import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Negroni" : "Dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={[
        "h-8 px-3",
        "gap-2",
        "text-muted-foreground/90 hover:text-foreground",
        "hover:bg-accent/30",
      ].join(" ")}
      aria-label={`Switch to ${nextLabel} theme`}
    >
      <Palette className="w-4 h-4" />
      <span className="text-[11px] font-medium tracking-[0.18em] uppercase">
        {nextLabel}
      </span>
    </Button>
  );
};

export default ThemeToggle;
