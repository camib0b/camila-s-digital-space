import { useEffect, type ComponentType, type SVGProps } from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRevealPresence } from "@/hooks/useRevealPresence";

type SocialIcon = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

type SocialLinkControlProps = {
  href: string;
  label: string;
  Icon: SocialIcon;
  isExpanded: boolean;
  onClose: () => void;
  onToggle: () => void;
};

function formatDisplayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/i, "");
}

const SocialLinkControl = ({
  href,
  label,
  Icon,
  isExpanded,
  onClose,
  onToggle,
}: SocialLinkControlProps) => {
  const { t } = useLanguage();
  const displayUrl = formatDisplayUrl(href);
  const { isRevealMounted } = useRevealPresence(isExpanded);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, onClose]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground transition-colors duration-hover ease-hover"
        aria-label={isExpanded ? label : t("social.showLink")}
        aria-expanded={isExpanded}
      >
        <Icon className="w-4 h-4" />
      </button>

      {isRevealMounted ? (
        <div
          className="contact-reveal flex items-center gap-1.5"
          data-state={isExpanded ? "open" : "closed"}
          aria-hidden={isExpanded ? undefined : true}
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-press text-xs text-muted-foreground hover:text-accent-teal transition-colors duration-hover ease-hover select-all whitespace-nowrap"
            tabIndex={isExpanded ? undefined : -1}
          >
            {displayUrl}
          </a>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent-teal transition-colors duration-hover ease-hover"
            aria-label={t("social.openInNewTab")}
            tabIndex={isExpanded ? undefined : -1}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default SocialLinkControl;
