import { useEffect, useLayoutEffect, useState, type FocusEvent, type PointerEvent, type RefObject } from "react";
import { keptDuration } from "@/lib/motion";

const visibleHeightMinimum = 64;
const tapSlopPixels = 10;

const lastRestartAt = new WeakMap<HTMLElement, number>();
const pointerOrigin = new WeakMap<HTMLElement, { x: number; y: number }>();
const ignoreMouseUntil = new WeakMap<HTMLElement, number>();

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      setReducedMotion(reducedMotionQuery.matches);
    };

    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    return () => reducedMotionQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  return reducedMotion;
}

/** Drop back to the start frame without playing. Used when a row leaves the viewport. */
export function armExperienceMotion(roleRow: HTMLElement): void {
  if (prefersReducedMotion()) {
    delete roleRow.dataset.experienceMotion;
    return;
  }

  roleRow.dataset.experienceMotion = "ready";
}

/**
 * Replay from the start frame.
 * Setting `play` again does nothing while that attribute is already set, so the
 * start frame has to be committed (and measured) before `play` is restored.
 */
export function restartExperienceMotion(roleRow: HTMLElement): void {
  if (prefersReducedMotion()) {
    delete roleRow.dataset.experienceMotion;
    return;
  }

  const now = performance.now();
  const previousRestartAt = lastRestartAt.get(roleRow) ?? Number.NEGATIVE_INFINITY;
  if (now - previousRestartAt < keptDuration.snap) {
    return;
  }

  lastRestartAt.set(roleRow, now);
  roleRow.dataset.experienceMotion = "ready";
  void roleRow.getBoundingClientRect();
  roleRow.dataset.experienceMotion = "play";
}

function visibleEnough(entry: IntersectionObserverEntry): boolean {
  return entry.isIntersecting && (entry.intersectionRatio >= 0.2 || entry.intersectionRect.height >= visibleHeightMinimum);
}

export function useExperienceDiagramMotion(roleRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const roleRow = roleRef.current;
    if (roleRow === null || prefersReducedMotion()) {
      return;
    }

    if (roleRow.dataset.experienceMotion !== "play") {
      roleRow.dataset.experienceMotion = "ready";
    }
  }, [roleRef]);

  useEffect(() => {
    const roleRow = roleRef.current;
    if (roleRow === null || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const stopObserving = () => {
      observer?.disconnect();
      observer = null;
    };

    const syncMotion = () => {
      stopObserving();
      if (reducedMotionQuery.matches) {
        delete roleRow.dataset.experienceMotion;
        return;
      }

      if (roleRow.dataset.experienceMotion !== "play") {
        roleRow.dataset.experienceMotion = "ready";
      }

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (!entry.isIntersecting) {
            armExperienceMotion(roleRow);
            return;
          }

          if (visibleEnough(entry) && roleRow.dataset.experienceMotion !== "play") {
            restartExperienceMotion(roleRow);
          }
        },
        { threshold: [0, 0.05, 0.2, 0.5] },
      );
      observer.observe(roleRow);
    };

    syncMotion();
    reducedMotionQuery.addEventListener("change", syncMotion);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncMotion);
      stopObserving();
    };
  }, [roleRef]);
}

function roleRowFromEvent(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const roleRow = target.closest("[data-experience-role]");
  return roleRow instanceof HTMLElement ? roleRow : null;
}

export function replayExperienceOnPointerEnter(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "mouse") {
    return;
  }

  const suppressedUntil = ignoreMouseUntil.get(event.currentTarget) ?? 0;
  if (performance.now() < suppressedUntil) {
    return;
  }

  restartExperienceMotion(event.currentTarget);
}

export function rememberExperiencePointerOrigin(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }

  pointerOrigin.set(event.currentTarget, { x: event.clientX, y: event.clientY });
}

export function replayExperienceOnPointerUp(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }

  const origin = pointerOrigin.get(event.currentTarget);
  pointerOrigin.delete(event.currentTarget);
  if (origin === undefined) {
    return;
  }

  const distance = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
  if (distance > tapSlopPixels) {
    return;
  }

  ignoreMouseUntil.set(event.currentTarget, performance.now() + keptDuration.residue);
  restartExperienceMotion(event.currentTarget);
}

function experienceMotionSettled(roleRow: HTMLElement): boolean {
  if (typeof roleRow.getAnimations !== "function") {
    return true;
  }

  const animations = roleRow.getAnimations({ subtree: true });
  if (animations.length === 0) {
    return true;
  }

  return animations.every((animation) => animation.playState === "finished");
}

export function replayExperienceOnActivate(event: { detail: number; currentTarget: EventTarget | null }): void {
  const roleRow = roleRowFromEvent(event.currentTarget);
  if (roleRow === null) {
    return;
  }

  const suppressedUntil = ignoreMouseUntil.get(roleRow) ?? 0;
  if (performance.now() < suppressedUntil) {
    return;
  }

  const keyboardActivation = event.detail === 0;
  if (!keyboardActivation && !experienceMotionSettled(roleRow)) {
    return;
  }

  restartExperienceMotion(roleRow);
}

export function clearExperiencePointerOrigin(event: PointerEvent<HTMLElement>): void {
  pointerOrigin.delete(event.currentTarget);
}

export function replayExperienceOnFocus(event: FocusEvent<HTMLElement>): void {
  if (!event.currentTarget.matches(":focus-visible")) {
    return;
  }

  const roleRow = roleRowFromEvent(event.currentTarget);
  if (roleRow !== null) {
    restartExperienceMotion(roleRow);
  }
}
