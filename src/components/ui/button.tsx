import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Design intent (dark-first, Apple-like):
 * - Depth comes from border + soft shadow, not glow.
 * - Hover is a tiny lift + slightly stronger shadow.
 * - Primary uses Ember; secondary/outline stay neutral.
 * - Focus uses brass ring (already handled by ring tokens).
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "ring-offset-background transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-elev-1",
          "hover:shadow-elev-2 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-elev-1",
        ].join(" "),

        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-elev-1",
          "hover:shadow-elev-2 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-elev-1",
        ].join(" "),

        outline: [
          "border border-border/60 bg-transparent text-foreground",
          "shadow-none",
          "hover:bg-accent/40 hover:border-border/80",
          "hover:shadow-elev-1 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-none",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "border border-border/60",
          "shadow-none",
          "hover:bg-secondary/80 hover:shadow-elev-1 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-none",
        ].join(" "),

        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-accent/40",
          "active:bg-accent/50",
        ].join(" "),

        link: "text-primary underline-offset-4 hover:underline",

        /**
         * Hero: primary button, but “premium” not “glowy”.
         * - Same Ember base
         * - Slightly stronger shadow + micro-lift
         * - Optional brass hairline for extra polish
         */
        hero: [
          "bg-primary text-primary-foreground",
          "shadow-elev-2",
          "hover:shadow-elev-3 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-elev-2",
          "border border-gold/20", // subtle premium edge; remove if you want even cleaner
        ].join(" "),

        /**
         * HeroOutline: neutral outline; do NOT tie to orange.
         * - Neutral border
         * - Slight lift/shadow on hover
         * - Accent fill is very subtle
         */
        heroOutline: [
          "bg-transparent text-foreground",
          "border border-border/60",
          "shadow-none",
          "hover:bg-accent/30 hover:border-border/80",
          "hover:shadow-elev-1 hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-none",
        ].join(" "),
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
