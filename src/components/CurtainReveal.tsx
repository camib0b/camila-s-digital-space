import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useCurtainReveal, type CurtainPhase } from "@/hooks/useCurtainReveal";
import { cn } from "@/lib/utils";

type CurtainElementName = "div" | "ul" | "ol";

interface CurtainRevealProps {
  as?: CurtainElementName;
  className?: string;
  children: ReactNode;
}

interface CurtainChildProps {
  className?: string;
  style?: CSSProperties;
  "data-curtain"?: Extract<CurtainPhase, "armed" | "playing">;
}

/**
 * Staggers direct children when the list enters the viewport.
 * Each child must be a host element (`div` or `li`) so the motion class
 * lands on the node that paints. No extra item wrappers, so layout stays put.
 */
const CurtainReveal = ({ as = "div", className, children }: CurtainRevealProps) => {
  const { containerRef, phase } = useCurtainReveal();
  const revealedChildren = Children.map(children, (child, index) => {
    if (phase === "static" || !isValidElement<CurtainChildProps>(child)) {
      return child;
    }

    const childElement = child as ReactElement<CurtainChildProps>;
    return cloneElement(childElement, {
      className: cn(childElement.props.className, "curtain-reveal-item"),
      style: {
        ...childElement.props.style,
        "--curtain-index": index,
      } as CSSProperties,
      "data-curtain": phase,
    });
  });

  if (as === "ul") {
    return (
      <ul ref={containerRef} className={className} data-curtain-reveal={phase}>
        {revealedChildren}
      </ul>
    );
  }

  if (as === "ol") {
    return (
      <ol ref={containerRef} className={className} data-curtain-reveal={phase}>
        {revealedChildren}
      </ol>
    );
  }

  return (
    <div ref={containerRef} className={className} data-curtain-reveal={phase}>
      {revealedChildren}
    </div>
  );
};

export default CurtainReveal;
