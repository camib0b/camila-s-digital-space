import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

interface PageHeaderProps {
  backLabel: string;
  actions?: ReactNode;
  stickyClassName?: string;
  containerClassName?: string;
}

const PageHeader = ({
  backLabel,
  actions,
  stickyClassName = "sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border",
  containerClassName = "container px-6 md:px-8 max-w-3xl mx-auto flex items-center justify-between h-12",
}: PageHeaderProps) => {
  return (
    <header className={stickyClassName}>
      <div className={containerClassName}>
        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3 h-3" />
          {backLabel}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          {actions}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
