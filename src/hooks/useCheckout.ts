import { useMutation } from "@tanstack/react-query";
import { PAYMENT_CURRENCY } from "../../shared/payments";

export interface CheckoutParams {
  amount: number;
  currency: typeof PAYMENT_CURRENCY;
  customerEmail: string;
}

export interface CheckoutSessionResponse {
  id: string;
  redirect_url: string;
  error?: string;
}

export function useCheckout() {
  return useMutation({
    mutationFn: async (params: CheckoutParams) => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      let payload: CheckoutSessionResponse;
      try {
        payload = (await response.json()) as CheckoutSessionResponse;
      } catch {
        throw new Error("Checkout failed");
      }

      if (!response.ok) {
        throw new Error(payload.error || "Checkout failed");
      }

      if (!payload.redirect_url) {
        throw new Error("Checkout failed");
      }

      return payload;
    },
    onSuccess: (data) => {
      window.location.href = data.redirect_url;
    },
  });
}
