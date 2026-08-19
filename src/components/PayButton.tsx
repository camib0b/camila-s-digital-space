import { Button } from "@/components/ui/button";

interface PayButtonProps {
  label: string;
  pendingLabel: string;
  isPending: boolean;
  disabled?: boolean;
}

export function PayButton({
  label,
  pendingLabel,
  isPending,
  disabled = false,
}: PayButtonProps) {
  return (
    <Button type="submit" disabled={disabled || isPending} className="w-full">
      {isPending ? pendingLabel : label}
    </Button>
  );
}
