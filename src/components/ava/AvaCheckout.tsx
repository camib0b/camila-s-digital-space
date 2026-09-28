import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";
import {
  AVA_TRIAL_DMG_URL,
  fetchAvaCheckoutConfig,
  startAvaCheckout,
} from "@/lib/avaCheckoutApi";

function interpolate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

function formatPriceClp(amount: number, language: string): string {
  return new Intl.NumberFormat(language === "es" ? "es-CL" : "en-US", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const AvaCheckout = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const paidState = searchParams.get("paid");
  const paidEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(paidEmail);
  const [priceClp, setPriceClp] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | "">("");

  useEffect(() => {
    let cancelled = false;
    fetchAvaCheckoutConfig()
      .then((config) => {
        if (!cancelled) {
          setPriceClp(config.priceClp);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPriceClp(0);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paidState) {
      document.getElementById("acceso")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [paidState]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorKey("ava.checkout.error.email");
      return;
    }
    setIsSubmitting(true);
    try {
      const initPoint = await startAvaCheckout({ email: trimmedEmail, language });
      window.location.assign(initPoint);
    } catch (error) {
      const message = error instanceof Error ? error.message : "ava.checkout.error.generic";
      setErrorKey(message === "ava.checkout.error.email" ? "ava.checkout.error.email" : "ava.checkout.error.generic");
      setIsSubmitting(false);
    }
  };

  let bannerText = "";
  if (paidState === "1") {
    bannerText = interpolate(t("ava.checkout.paid"), {
      email: paidEmail || t("ava.checkout.emailFallback"),
    });
  } else if (paidState === "0") {
    bannerText = t("ava.checkout.failed");
  } else if (paidState === "pending") {
    bannerText = t("ava.checkout.pending");
  }

  const formattedPrice = priceClp > 0 ? formatPriceClp(priceClp, language) : "";

  return (
    <section className="ava-section" id="acceso">
      <div className="ava-shell ava-access">
        <p className="ava-kicker">{t("ava.access.kicker")}</p>
        <div>
          {bannerText ? (
            <div
              className="ava-checkout-banner"
              role="status"
              data-paid={paidState || undefined}
            >
              <p>{bannerText}</p>
            </div>
          ) : null}
          <h2>{t("ava.access.headline")}</h2>
          <p className="ava-section-body">{t("ava.access.body")}</p>
          {formattedPrice ? (
            <p className="ava-checkout-price">
              {interpolate(t("ava.checkout.price"), { amount: formattedPrice })}
            </p>
          ) : (
            <p className="ava-checkout-price">{t("ava.checkout.priceFallback")}</p>
          )}
          <form className="ava-checkout-form" onSubmit={onSubmit}>
            <label className="ava-checkout-label" htmlFor="ava-checkout-email">
              {t("ava.checkout.emailLabel")}
              <input
                id="ava-checkout-email"
                className="ava-checkout-input"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                placeholder={t("ava.checkout.emailPlaceholder")}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {errorKey ? (
              <p className="ava-checkout-error" role="alert">
                {t(errorKey)}
              </p>
            ) : null}
            <div className="ava-checkout-actions">
              <button className="ava-cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("ava.checkout.paying") : t("ava.checkout.pay")}
              </button>
              {AVA_TRIAL_DMG_URL ? (
                <a className="ava-text-link" href={AVA_TRIAL_DMG_URL}>
                  {t("ava.checkout.download")}
                </a>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AvaCheckout;
