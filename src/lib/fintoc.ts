/**
 * Public Fintoc frontend config.
 * The public key (pk_*) is safe to expose in the browser.
 * The secret key (sk_*) must stay on the Worker only.
 */

export const FINTOC_PAYMENT_LINK_URL =
  import.meta.env.VITE_FINTOC_PAYMENT_LINK_URL ??
  "https://pay.fintoc.com/plink_kMV9D8xTvqJDb1L7";

export const FINTOC_PUBLIC_KEY =
  import.meta.env.VITE_FINTOC_PUBLIC_KEY ??
  "pk_test_j4X9CgHczxWn4VetEXB_d43TBKUjmNBnMZM3s-mGiJx";
