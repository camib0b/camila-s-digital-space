import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentCancel = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <XCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-medium">{t("payment.cancel.title")}</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {t("payment.cancel.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">{t("payment.cancel.note")}</p>
        </CardContent>
        <CardFooter className="justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/">{t("payment.success.home")}</Link>
          </Button>
          <Button asChild>
            <Link to="/pay">{t("payment.cancel.retry")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCancel;
