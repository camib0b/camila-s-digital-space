import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /**
       * Typography: dark-first, Apple-clean
       * - Inter as default sans for UI consistency
       * - Playfair only when you explicitly opt-in via font-display
       */
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
        display: ["Playfair Display", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },

      /**
       * Letter spacing: slight Apple tightness
       * Use: tracking-tight for headings, tracking-normal for body, tracking-tightish for UI labels
       */
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
        tightish: "-0.015em",
      },

      /**
       * Type scale tuned for “product UI” (not editorial)
       * - Slightly smaller base sizes read sharper in dark mode
       * - Generous leading to prevent “dense soot” feeling
       */
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1rem" }],   // 12 / 17.6
        sm: ["0.875rem", { lineHeight: "1.35rem" }], // 14 / 21.6
        base: ["0.95rem", { lineHeight: "1.6rem" }], // ~15.2 / 25.6
        lg: ["1.05rem", { lineHeight: "1.75rem" }],  // ~16.8 / 28
        xl: ["1.25rem", { lineHeight: "1.9rem" }],   // 20 / 30.4
        "2xl": ["1.5rem", { lineHeight: "2.1rem" }], // 24 / 33.6
        "3xl": ["1.875rem", { lineHeight: "2.2rem" }], // 30 / 35.2
        "4xl": ["2.25rem", { lineHeight: "2.55rem" }], // 36 / 40.8
        "5xl": ["3rem", { lineHeight: "3.15rem" }],    // 48 / 50.4
        "6xl": ["3.75rem", { lineHeight: "3.85rem" }], // 60 / 61.6
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Your controlled “spirits” accents
        gold: "hsl(var(--gold))",
        glow: "hsl(var(--glow))",
        wine: "hsl(var(--wine))",
        olive: "hsl(var(--olive))",

        /**
         * Extra neutral helpers for dark-first polish
         * These are *safe* because they remain token-based and subtle.
         */
        hairline: "rgba(255,255,255,0.06)", // for borders on dark surfaces
        highlight: "rgba(255,255,255,0.08)", // for specular top highlights
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /**
       * Shadows are already variable-driven. Keep them.
       * The “Apple dark” look comes from combining:
       * - border-border/60 (or hairline)
       * - shadow-elev-1
       * - optional inset highlight (see backgroundImage below)
       */
      boxShadow: {
        "elev-1": "var(--shadow-elev-1)",
        "elev-2": "var(--shadow-elev-2)",
        "elev-3": "var(--shadow-elev-3)",
        ember: "var(--shadow-ember)",
      },

      /**
       * Background effects: subtle warm specular + premium separators
       * Use these as utilities on hero sections/cards:
       * - bg-surface-sheen (adds faint top highlight)
       * - bg-ember-wash (very subtle ember tint)
       */
      backgroundImage: {
        "surface-sheen":
          "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.00) 40%)",
        "ember-wash":
          "radial-gradient(80% 60% at 20% 10%, rgba(196,82,26,0.18), rgba(196,82,26,0.00) 55%)",
        "brass-kiss":
          "radial-gradient(60% 40% at 50% 0%, rgba(199,163,91,0.16), rgba(199,163,91,0.00) 60%)",
      },

      /**
       * Optional: nicer blur steps for frosted navbars / popovers
       */
      backdropBlur: {
        xs: "2px",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
