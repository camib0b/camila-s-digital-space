export const PAYMENT_CURRENCY = "CLP" as const;

export const MINIMUM_PAYMENT_AMOUNT_CLP = 100;
export const MAXIMUM_PAYMENT_AMOUNT_CLP = 10_000_000;

export const PAYMENT_AMOUNT_PRESETS_CLP = [5_000, 10_000, 25_000] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidCustomerEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function parseCheckoutAmount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  if (value < MINIMUM_PAYMENT_AMOUNT_CLP || value > MAXIMUM_PAYMENT_AMOUNT_CLP) {
    return null;
  }

  return value;
}
