import { PayButton } from "@/components/PayButton";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Pay = () => {
  const { t } = useLanguage();

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
            <PayButton label={t("pay.submit")} className="w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Pay;
