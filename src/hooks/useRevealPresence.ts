import { useEffect, useState } from "react";
import { duration } from "@/lib/motion";

/** Close duration of `.contact-reveal`. Both read `duration.fast`. */
export const REVEAL_CLOSE_DURATION_MS = duration.fast;

/**
 * Keeps a collapsed panel mounted until its close transition finishes.
 * Enter motion comes from `@starting-style` on `.contact-reveal`.
 */
export function useRevealPresence(isExpanded: boolean): {
  isRevealMounted: boolean;
} {
  const [isRevealMounted, setIsRevealMounted] = useState(isExpanded);

  if (isExpanded && !isRevealMounted) {
    setIsRevealMounted(true);
  }

  useEffect(() => {
    if (isExpanded || !isRevealMounted) {
      return;
    }

    const closeTimeoutId = window.setTimeout(() => {
      setIsRevealMounted(false);
    }, REVEAL_CLOSE_DURATION_MS);

    return () => {
      window.clearTimeout(closeTimeoutId);
    };
  }, [isExpanded, isRevealMounted]);

  return { isRevealMounted };
}
