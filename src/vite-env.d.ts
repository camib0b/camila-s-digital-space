/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTFOLIO_API_URL?: string;
  readonly VITE_AVA_CHECKOUT_URL?: string;
  readonly VITE_AVA_DMG_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
