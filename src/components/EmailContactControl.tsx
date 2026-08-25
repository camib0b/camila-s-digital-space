import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/content/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { copyTextToClipboard } from "@/lib/utils";

const COPY_FEEDBACK_MS = 1500;

type EmailContactControlProps = {
  isExpanded: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const EmailContactControl = ({ isExpanded, onClose, onToggle }: EmailContactControlProps) => {
  const { t } = useLanguage();
  const [hasCopied, setHasCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

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
        onClick={onToggle}
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

      {hasCopied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-background px-4 py-2 text-xs text-foreground shadow-elev-2"
        >
          {t("contact.emailCopied")}
        </div>
      )}
    </div>
  );
};

export default EmailContactControl;
