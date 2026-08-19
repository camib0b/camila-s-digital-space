import { FormEvent, useState } from "react";
import { PayButton } from "@/components/PayButton";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCheckout } from "@/hooks/useCheckout";
import {
  isValidCustomerEmail,
  parseCheckoutAmount,
  PAYMENT_AMOUNT_PRESETS_CLP,
  PAYMENT_CURRENCY,
} from "../../shared/payments";

const Pay = () => {
  const { t } = useLanguage();
  const checkout = useCheckout();
  const [customerEmail, setCustomerEmail] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = customerEmail.trim();
    if (!isValidCustomerEmail(trimmedEmail)) {
      setValidationError(t("pay.email.invalid"));
      return;
    }

    const parsedAmount = Number.parseInt(amountInput, 10);
    const amount = parseCheckoutAmount(parsedAmount);
    if (amount === null) {
      setValidationError(t("pay.amount.invalid"));
      return;
    }

    setValidationError(null);
    checkout.mutate({
      amount,
      currency: PAYMENT_CURRENCY,
      customerEmail: trimmedEmail,
    });
  };

  const errorMessage = validationError ?? checkout.error?.message ?? null;

  return (
    <main className="min-h-screen bg-background">
      <PageHeader backLabel={t("pay.back")} />

      <div className="container px-6 py-12 max-w-lg mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
          {t("pay.label")}
        </p>
        <h1 className="text-2xl font-medium text-foreground mb-3">{t("pay.title")}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {t("pay.description")}
        </p>

        <Card>
          <CardHeader>
            <CardTitle>{t("pay.form.title")}</CardTitle>
            <CardDescription>{t("pay.form.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm text-foreground">{t("pay.email")}</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder={t("pay.email.placeholder")}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-foreground">{t("pay.amount")}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={100}
                  step={1}
                  required
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  placeholder="5000"
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <div className="space-y-2">
                <p className="text-sm text-foreground">{t("pay.presets.label")}</p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_AMOUNT_PRESETS_CLP.map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmountInput(String(presetAmount))}
                    >
                      ${presetAmount.toLocaleString("es-CL")}
                    </Button>
                  ))}
                </div>
              </div>

              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}

              <PayButton
                isPending={checkout.isPending}
                label={t("pay.submit")}
                pendingLabel={t("pay.submitting")}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Pay;
