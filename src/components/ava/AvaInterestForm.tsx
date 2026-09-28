import { FormEvent, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INTEREST_ENDPOINT = "/api/ava-interest";
const FIELD_CHARACTER_LIMIT = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InterestFormStatus = "idle" | "submitting" | "success" | "error";

const AvaInterestForm = () => {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<InterestFormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const organization = String(formData.get("org") ?? "").trim();
    const honeypot = String(formData.get("company_website") ?? "");
    const fieldsFit =
      name.length > 0 &&
      name.length <= FIELD_CHARACTER_LIMIT &&
      email.length <= FIELD_CHARACTER_LIMIT &&
      organization.length <= FIELD_CHARACTER_LIMIT &&
      EMAIL_PATTERN.test(email);

    if (!fieldsFit) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(INTEREST_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          org: organization,
          lang: language,
          company_website: honeypot,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean };
      setStatus(response.ok && payload.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="ava-interest-status" role="status">
        {t("ava.interest.success")}
      </p>
    );
  }

  return (
    <form className="ava-interest" onSubmit={handleSubmit} noValidate>
      <div className="ava-honeypot" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label htmlFor="ava-interest-name">
        {t("ava.interest.name")}
        <input
          id="ava-interest-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={FIELD_CHARACTER_LIMIT}
          required
        />
      </label>
      <label htmlFor="ava-interest-email">
        {t("ava.interest.email")}
        <input
          id="ava-interest-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_CHARACTER_LIMIT}
          required
        />
      </label>
      <label htmlFor="ava-interest-org">
        {t("ava.interest.org")}
        <input
          id="ava-interest-org"
          name="org"
          type="text"
          autoComplete="organization"
          maxLength={FIELD_CHARACTER_LIMIT}
        />
      </label>
      {status === "error" ? (
        <p className="ava-interest-status is-error" role="alert">
          {t("ava.interest.error")}
        </p>
      ) : null}
      <button className="ava-cta" type="submit" disabled={status === "submitting"}>
        {t("ava.interest.submit")}
      </button>
    </form>
  );
};

export default AvaInterestForm;
