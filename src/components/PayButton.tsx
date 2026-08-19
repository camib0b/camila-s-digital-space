import { Button } from "@/components/ui/button";
import { FINTOC_PAYMENT_LINK_URL } from "@/lib/fintoc";

interface PayButtonProps {
  label: string;
  className?: string;
}

export function PayButton({ label, className }: PayButtonProps) {
  return (
    <Button asChild className={className}>
      <a href={FINTOC_PAYMENT_LINK_URL} rel="noopener noreferrer">
        {label}
      </a>
    </Button>
  );
}
