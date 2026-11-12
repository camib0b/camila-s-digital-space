import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sectionEyebrowClassName =
  "font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-muted-foreground";

type SectionEyebrowElement = "p" | "h2" | "h3";

type SectionEyebrowProps = {
  as?: SectionEyebrowElement;
  className?: string;
  children: ReactNode;
  id?: string;
  /** Scroll-tied fade for headings that sit below the first viewport. */
  enterOnView?: boolean;
};

const SectionEyebrow = ({
  as: Element = "p",
  className,
  children,
  id,
  enterOnView = false,
}: SectionEyebrowProps) => {
  return (
    <Element
      id={id}
      className={cn(sectionEyebrowClassName, enterOnView && "scroll-fade-up", className)}
    >
      {children}
    </Element>
  );
};

export default SectionEyebrow;
