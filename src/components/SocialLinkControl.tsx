import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type SocialIcon = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

type SocialLinkControlProps = {
  href: string;
  label: string;
  Icon: SocialIcon;
};

function formatDisplayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/i, "");
}

const SocialLinkControl = ({ href, label, Icon }: SocialLinkControlProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const displayUrl = formatDisplayUrl(href);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded((previous) => !previous);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        aria-label={isExpanded ? label : t("social.showLink")}
        aria-expanded={isExpanded}
      >
        <Icon className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground select-all whitespace-nowrap">
            {displayUrl}
          </span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label={t("social.openInNewTab")}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
};

export default SocialLinkControl;
