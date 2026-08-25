import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/content/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { copyTextToClipboard } from "@/lib/utils";

const COPY_FEEDBACK_MS = 1500;

const EmailContactControl = () => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    setIsExpanded((previous) => !previous);
  };

  const handleCopy = async () => {
    const didCopy = await copyTextToClipboard(CONTACT_EMAIL);
    if (!didCopy) {
      return;
    }

    setHasCopied(true);
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = setTimeout(() => {
      setHasCopied(false);
    }, COPY_FEEDBACK_MS);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        aria-label={isExpanded ? t("contact.email") : t("contact.showEmail")}
        aria-expanded={isExpanded}
      >
        <Mail className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground select-all whitespace-nowrap">
            {CONTACT_EMAIL}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label={hasCopied ? t("contact.copied") : t("contact.copyEmail")}
          >
            {hasCopied ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailContactControl;
