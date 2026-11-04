import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/content/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRevealPresence } from "@/hooks/useRevealPresence";
import { copyTextToClipboard } from "@/lib/utils";

const COPY_FEEDBACK_MS = 1500;

const iconControlClassName =
  "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-hover ease-hover hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

type EmailContactControlProps = {
  isExpanded: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const EmailContactControl = ({ isExpanded, onClose, onToggle }: EmailContactControlProps) => {
  const { t } = useLanguage();
  const [hasCopied, setHasCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        className={iconControlClassName}
        aria-label={isExpanded ? t("contact.email") : t("contact.showEmail")}
        aria-expanded={isExpanded}
      >
        <Mail className="h-4 w-4" />
      </button>

      {isRevealMounted ? (
        <div
          className="contact-reveal flex items-center gap-1.5"
          data-state={isExpanded ? "open" : "closed"}
          aria-hidden={isExpanded ? undefined : true}
        >
          <span className="inline-flex min-h-11 items-center text-xs text-muted-foreground select-all whitespace-nowrap">
            {CONTACT_EMAIL}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={iconControlClassName}
            aria-label={hasCopied ? t("contact.copied") : t("contact.copyEmail")}
            tabIndex={isExpanded ? undefined : -1}
          >
            <span className="copy-swap-icon-stack">
              <Copy
                className="copy-swap-icon h-3.5 w-3.5"
                data-visible={hasCopied ? "false" : "true"}
                aria-hidden="true"
              />
              <Check
                className="copy-swap-icon h-3.5 w-3.5"
                data-visible={hasCopied ? "true" : "false"}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      ) : null}

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
