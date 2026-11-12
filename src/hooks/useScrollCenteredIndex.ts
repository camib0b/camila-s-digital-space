import { useEffect, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/components/experience-diagrams/experienceDiagramMotion";

/** Index of the item whose center is nearest the viewport midline. */
export function closestIndexToViewportCenter(centers: readonly number[], viewportCenter: number): number {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  centers.forEach((center, index) => {
    const distance = Math.abs(center - viewportCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

/**
 * Marks the list item closest to the viewport center.
 * Returns null when motion is reduced so every item stays fully shown.
 */
export function useScrollCenteredIndex(listRef: RefObject<HTMLElement | null>, itemCount: number): number | null {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const list = listRef.current;
    if (list === null) {
      return undefined;
    }

    let frame = 0;

    const updateActiveIndex = () => {
      frame = 0;
      const items = list.querySelectorAll<HTMLElement>("[data-scroll-center-item]");
      if (items.length === 0) {
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const centers = Array.from(items, (item) => {
        const bounds = item.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      });
      const nextIndex = closestIndexToViewportCenter(centers, viewportCenter);
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(updateActiveIndex);
    };

    updateActiveIndex();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [listRef, itemCount, reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return activeIndex;
}
