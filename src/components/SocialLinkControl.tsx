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

const iconControlClassName =
  "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-hover ease-hover hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

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
        className={iconControlClassName}
        aria-label={isExpanded ? label : t("social.showLink")}
        aria-expanded={isExpanded}
      >
        <Icon className="h-4 w-4" />
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
            className="text-press inline-flex min-h-11 min-w-11 cursor-pointer items-center text-xs text-muted-foreground transition-colors duration-hover ease-hover hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring select-all whitespace-nowrap"
            tabIndex={isExpanded ? undefined : -1}
          >
            {displayUrl}
          </a>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={iconControlClassName}
            aria-label={t("social.openInNewTab")}
            tabIndex={isExpanded ? undefined : -1}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default SocialLinkControl;
