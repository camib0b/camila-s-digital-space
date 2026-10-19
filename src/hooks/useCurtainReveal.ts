import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type CurtainPhase = "static" | "armed" | "playing";

/**
 * Section lists stay fully visible unless this hook opts into motion.
 * Reduced motion, a missing IntersectionObserver, or no JavaScript leave
 * the phase at "static", which renders the list with no hidden styles.
 * Lists already inside the viewport on load still play once.
 */
export function useCurtainReveal(): {
  containerRef: (node: HTMLElement | null) => void;
  phase: CurtainPhase;
} {
  const containerElementRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<CurtainPhase>("static");

  const containerRef = useCallback((node: HTMLElement | null) => {
    containerElementRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const containerElement = containerElementRef.current;
    if (!containerElement || shouldSkipCurtainMotion()) {
      return;
    }

    if (isContainerInView(containerElement)) {
      setPhase("playing");
      return;
    }

    setPhase("armed");

    const listObserver = new IntersectionObserver(
      (entries) => {
        const hasEntered = entries.some((entry) => entry.isIntersecting);
        if (!hasEntered) {
          return;
        }
        setPhase("playing");
        listObserver.disconnect();
      },
      { threshold: 0 },
    );
    listObserver.observe(containerElement);

    return () => {
      listObserver.disconnect();
    };
  }, []);

  return { containerRef, phase };
}

function shouldSkipCurtainMotion(): boolean {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isContainerInView(containerElement: HTMLElement): boolean {
  const bounds = containerElement.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}
