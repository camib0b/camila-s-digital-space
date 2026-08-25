import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MapPin } from "lucide-react";
import { CONTACT_EMAIL } from "@/content/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { copyTextToClipboard } from "@/lib/utils";

const COPY_FEEDBACK_MS = 1500;

const Contact = () => {
  const { t } = useLanguage();
  const [hasCopied, setHasCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
            {t("contact.label")}
          </h2>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              Santiago, Chile
            </p>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="select-all">{CONTACT_EMAIL}</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
