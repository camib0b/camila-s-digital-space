import { FormEvent, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import PatternedBackground from "@/components/PatternedBackground";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

const FEEDBACK_ENDPOINT = "/api/feedback-404";
const FEEDBACK_MESSAGE_LIMIT = 1000;
const FEEDBACK_CONTEXT_LIMIT = 500;

const notFoundDestinations: ReadonlyArray<{ labelKey: TranslationKey; path: string }> = [
  { labelKey: "notFound.home", path: "/" },
  { labelKey: "notFound.projects", path: "/#personal-projects" },
  { labelKey: "notFound.ava", path: "/ava" },
  { labelKey: "notFound.cv", path: "/cv/growth" },
];

/** Same text treatment as the site footer nav, with a 44px target and a focus ring. */
const notFoundNavigationLinkClassName = [
  "inline-flex min-h-11 min-w-11 max-w-full cursor-pointer items-center justify-center px-3",
  "text-sm text-foreground",
  "transition-colors duration-hover ease-hover",
  "hover:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

/** Pressed language text uses the background token on a foreground fill so the state clears 4.5:1. */
const notFoundHeaderControlClassName = [
  "flex items-center justify-end gap-2",
  "[&_button]:h-11 [&_button]:min-h-11 [&_button]:min-w-11",
  "[&_button]:cursor-pointer [&_button:disabled]:cursor-default",
  "[&_button]:text-foreground",
  "[&_button[aria-pressed='true']]:border-transparent",
  "[&_button[aria-pressed='true']]:bg-foreground",
  "[&_button[aria-pressed='true']]:text-background",
].join(" ");

/**
 * Enabled: primary fill and primary-foreground label (same pair as Button default).
 * Disabled: page foreground on the page background, with a foreground border,
 * so the label stays 4.5:1 and the control edge stays 3:1. The shared opacity
 * fade is turned off because it drops the label under 4.5:1.
 */
const notFoundSendButtonClassName = [
  "mt-3 h-11 min-h-11 cursor-pointer border border-primary px-4",
  "disabled:pointer-events-auto disabled:cursor-default disabled:opacity-100",
  "disabled:border-foreground disabled:bg-background disabled:text-foreground",
  "disabled:hover:border-foreground disabled:hover:bg-background disabled:hover:text-foreground",
].join(" ");

/** Foreground border and text on the page background. Placeholder uses muted-foreground, which clears 4.5:1 on that background in both themes. */
const notFoundFeedbackFieldClassName = [
  "mt-3 block w-full min-h-24 resize-y break-words rounded-md border border-foreground bg-background px-3 py-2",
  "text-sm leading-relaxed text-foreground placeholder:text-muted-foreground",
  "ring-offset-background",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

type FeedbackStatus = "idle" | "submitting" | "success" | "error";

const NotFound = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const isSendingRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendingRef.current) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") ?? "").trim();
    const honeypot = String(formData.get("company_website") ?? "");
    if (message.length === 0 || message.length > FEEDBACK_MESSAGE_LIMIT) {
      setStatus("error");
      return;
    }

    isSendingRef.current = true;
    setStatus("submitting");

    const missingPath = `${location.pathname}${location.search}`.slice(0, FEEDBACK_CONTEXT_LIMIT);
    const referrer = document.referrer.slice(0, FEEDBACK_CONTEXT_LIMIT);

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message,
          path: missingPath,
          referrer,
          company_website: honeypot,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      if (response.ok && payload.ok === true) {
        setStatus("success");
        return;
      }
      isSendingRef.current = false;
      setStatus("error");
    } catch {
      isSendingRef.current = false;
      setStatus("error");
    }
  };

  return (
    <main className="relative flex min-h-svh flex-col bg-background text-foreground">
      <PatternedBackground />
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="px-6 pt-6 md:px-8">
          <div className={notFoundHeaderControlClassName}>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        <div className="container flex flex-1 flex-col justify-center px-6 py-6 md:px-8">
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground">
              {t("notFound.label")}
            </p>
            <h1 className="mt-3 max-w-xl">{t("notFound.message")}</h1>
            <nav className="mt-4" aria-label={t("notFound.nav")}>
              <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {notFoundDestinations.map((destination) => (
                  <li key={destination.path}>
                    <Link to={destination.path} className={notFoundNavigationLinkClassName}>
                      <span className="link-underline">{t(destination.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-4 max-w-xl">
              {status === "success" ? (
                <p className="text-sm leading-relaxed text-foreground" role="status">
                  {t("notFound.feedbackThanks")}
                </p>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="not-found-company-website">
                      Company website
                      <input
                        id="not-found-company-website"
                        name="company_website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                  <label
                    htmlFor="not-found-feedback"
                    className="block cursor-pointer text-sm leading-relaxed text-foreground"
                  >
                    {t("notFound.report")}
                  </label>
                  <textarea
                    id="not-found-feedback"
                    name="message"
                    maxLength={FEEDBACK_MESSAGE_LIMIT}
                    required
                    rows={4}
                    className={notFoundFeedbackFieldClassName}
                    placeholder={t("notFound.feedbackPlaceholder")}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "not-found-feedback-error" : undefined}
                    onChange={() => {
                      if (status === "error") {
                        setStatus("idle");
                      }
                    }}
                  />
                  {status === "error" ? (
                    <p
                      id="not-found-feedback-error"
                      className="mt-3 text-sm leading-relaxed text-foreground"
                      role="alert"
                    >
                      {t("notFound.feedbackError")}
                    </p>
                  ) : null}
                  <Button
                    type="submit"
                    className={notFoundSendButtonClassName}
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                  >
                    {t("notFound.feedbackSend")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
