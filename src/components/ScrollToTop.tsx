import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const SCROLL_POSITION_STORAGE_KEY = "camilaescudero:scroll-positions";
const MAX_SCROLL_RESTORE_ATTEMPTS = 12;
const SCROLL_SETTLE_TIMEOUT_MS = 800;

type ScrollPositionByHistoryKey = Record<string, number>;

function readStoredScrollPositions(): ScrollPositionByHistoryKey {
  try {
    const serializedPositions = sessionStorage.getItem(SCROLL_POSITION_STORAGE_KEY);
    if (!serializedPositions) {
      return {};
    }

    const parsedPositions: unknown = JSON.parse(serializedPositions);
    if (!parsedPositions || typeof parsedPositions !== "object") {
      return {};
    }

    const scrollPositionByHistoryKey: ScrollPositionByHistoryKey = {};
    for (const [historyKey, scrollY] of Object.entries(parsedPositions)) {
      if (typeof scrollY === "number" && Number.isFinite(scrollY) && scrollY >= 0) {
        scrollPositionByHistoryKey[historyKey] = scrollY;
      }
    }
    return scrollPositionByHistoryKey;
  } catch {
    return {};
  }
}

function writeStoredScrollPositions(scrollPositionByHistoryKey: ScrollPositionByHistoryKey): void {
  try {
    sessionStorage.setItem(SCROLL_POSITION_STORAGE_KEY, JSON.stringify(scrollPositionByHistoryKey));
  } catch {
    // Private mode and quota failures leave the in-memory map working for in-app navigations.
  }
}

const scrollPositionByHistoryKey: ScrollPositionByHistoryKey =
  typeof window === "undefined" ? {} : readStoredScrollPositions();

function rememberScrollPosition(historyKey: string, scrollY: number): void {
  if (scrollPositionByHistoryKey[historyKey] === scrollY) {
    return;
  }
  scrollPositionByHistoryKey[historyKey] = scrollY;
  writeStoredScrollPositions(scrollPositionByHistoryKey);
}

function persistScrollPositionNow(historyKey: string, scrollY: number): void {
  scrollPositionByHistoryKey[historyKey] = scrollY;
  writeStoredScrollPositions(scrollPositionByHistoryKey);
}

/**
 * The browser's auto mode applies the history offset before the next screen
 * has its height, which clamps it to 0, and can apply that value again after
 * we restore. Manual mode does not clear the scroll offset frozen in bfcache.
 * Some browsers reset the mode to auto when a page is restored from bfcache.
 */
function enableManualScrollRestoration(): void {
  if (!("scrollRestoration" in window.history)) {
    return;
  }
  if (window.history.scrollRestoration === "manual") {
    return;
  }
  window.history.scrollRestoration = "manual";
}

/**
 * The first history entry has no `history.state.key`, so React Router reports
 * it as "default". A later full page load in the same tab does too, and the
 * two entries would share one stored offset. Stamp a key once, before the
 * router reads it, and leave entries that already have one alone.
 */
function ensureHistoryEntryKey(): void {
  try {
    const currentState: unknown = window.history.state;
    if (
      currentState &&
      typeof currentState === "object" &&
      "key" in currentState &&
      typeof currentState.key === "string" &&
      currentState.key.length > 0
    ) {
      return;
    }

    const historyKey = Math.random().toString(36).slice(2, 10);
    const nextState =
      currentState && typeof currentState === "object"
        ? { ...currentState, key: historyKey }
        : { key: historyKey };
    window.history.replaceState(nextState, "");
  } catch {
    // replaceState can throw if the state cannot be cloned. Router keys still work in-app.
  }
}

if (typeof window !== "undefined") {
  enableManualScrollRestoration();
  ensureHistoryEntryKey();
}

function scrollToHashElement(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) {
    return false;
  }

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
    return true;
  }

  return false;
}

function maximumWindowScrollY(): number {
  const scrollingElement = document.scrollingElement;
  const scrollHeight = Math.max(
    scrollingElement?.scrollHeight ?? 0,
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
  );
  return Math.max(0, scrollHeight - window.innerHeight);
}

function scrollWindowToInstant(scrollY: number): void {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  try {
    window.scrollTo(0, scrollY);
  } finally {
    root.style.scrollBehavior = previousScrollBehavior;
  }
}

function scheduleScrollRestore(targetScrollY: number, onRestored: (appliedScrollY: number) => void): () => void {
  let cancelled = false;
  let animationFrame = 0;
  let attempts = 0;

  const attemptRestore = () => {
    if (cancelled) {
      return;
    }

    const canReachTarget = targetScrollY <= maximumWindowScrollY() + 1;
    if (!canReachTarget && attempts < MAX_SCROLL_RESTORE_ATTEMPTS) {
      attempts += 1;
      animationFrame = window.requestAnimationFrame(attemptRestore);
      return;
    }

    animationFrame = 0;
    scrollWindowToInstant(targetScrollY);
    if (!cancelled) {
      onRestored(window.scrollY);
    }
  };

  animationFrame = window.requestAnimationFrame(attemptRestore);

  return () => {
    cancelled = true;
    if (animationFrame !== 0) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  };
}

function isBackForwardDocumentLoad(): boolean {
  const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return navigationEntry?.type === "back_forward";
}

/**
 * Scrolls to the top on push/replace, and restores the history entry's scroll
 * offset on back/forward. Positions are kept per `location.key` so a full page
 * load such as /xml/ can return to the same spot.
 */
const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const initialHistoryKeyRef = useRef(location.key);
  const hasLeftInitialHistoryEntryRef = useRef(false);
  const activeHistoryKeyRef = useRef(location.key);
  const latestScrollYRef = useRef(window.scrollY);
  const savedScrollYOnArrivalRef = useRef<number | undefined>(scrollPositionByHistoryKey[location.key]);
  const suppressScrollPersistenceRef = useRef(true);
  const pendingPreviousScrollSaveRef = useRef<{ historyKey: string; scrollY: number } | null>(null);
  const cancelScheduledScrollRef = useRef<(() => void) | null>(null);

  if (location.key !== initialHistoryKeyRef.current) {
    hasLeftInitialHistoryEntryRef.current = true;
  }

  if (activeHistoryKeyRef.current !== location.key) {
    pendingPreviousScrollSaveRef.current = {
      historyKey: activeHistoryKeyRef.current,
      scrollY: latestScrollYRef.current,
    };
    activeHistoryKeyRef.current = location.key;
    savedScrollYOnArrivalRef.current = scrollPositionByHistoryKey[location.key];
    latestScrollYRef.current = scrollPositionByHistoryKey[location.key] ?? 0;
    suppressScrollPersistenceRef.current = true;
  }

  useLayoutEffect(() => {
    let scrollPersistenceFrame = 0;

    const persistActiveScrollPosition = () => {
      if (suppressScrollPersistenceRef.current) {
        return;
      }
      rememberScrollPosition(activeHistoryKeyRef.current, latestScrollYRef.current);
    };

    const handleScroll = () => {
      if (suppressScrollPersistenceRef.current) {
        return;
      }
      latestScrollYRef.current = window.scrollY;
      if (scrollPersistenceFrame !== 0) {
        return;
      }
      scrollPersistenceFrame = window.requestAnimationFrame(() => {
        scrollPersistenceFrame = 0;
        persistActiveScrollPosition();
      });
    };

    const handlePageHide = () => {
      cancelScheduledScrollRef.current?.();
      if (scrollPersistenceFrame !== 0) {
        window.cancelAnimationFrame(scrollPersistenceFrame);
        scrollPersistenceFrame = 0;
      }
      const scrollY = suppressScrollPersistenceRef.current ? latestScrollYRef.current : window.scrollY;
      latestScrollYRef.current = scrollY;
      persistScrollPositionNow(activeHistoryKeyRef.current, scrollY);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      enableManualScrollRestoration();
      if (!event.persisted) {
        return;
      }

      // bfcache already restored the frozen scroll offset. Only step in when
      // the browser dropped it (manual mode leaves a correct snapshot alone).
      const savedScrollY = scrollPositionByHistoryKey[activeHistoryKeyRef.current];
      if (savedScrollY === undefined || Math.abs(window.scrollY - savedScrollY) <= 1) {
        latestScrollYRef.current = window.scrollY;
        suppressScrollPersistenceRef.current = false;
        return;
      }

      suppressScrollPersistenceRef.current = true;
      latestScrollYRef.current = savedScrollY;
      cancelScheduledScrollRef.current?.();
      cancelScheduledScrollRef.current = scheduleScrollRestore(savedScrollY, (appliedScrollY) => {
        latestScrollYRef.current = appliedScrollY;
        rememberScrollPosition(activeHistoryKeyRef.current, appliedScrollY);
        suppressScrollPersistenceRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      if (scrollPersistenceFrame !== 0) {
        window.cancelAnimationFrame(scrollPersistenceFrame);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const pendingPreviousScrollSave = pendingPreviousScrollSaveRef.current;
    if (pendingPreviousScrollSave) {
      pendingPreviousScrollSaveRef.current = null;
      rememberScrollPosition(pendingPreviousScrollSave.historyKey, pendingPreviousScrollSave.scrollY);
    }

    let cancelled = false;
    let animationFrame = 0;
    let scrollSettleTimeout = 0;
    let cancelScrollRestore: (() => void) | null = null;

    const handleScrollEnd = () => {
      settleProgrammaticScroll();
    };

    function settleProgrammaticScroll() {
      if (cancelled) {
        return;
      }
      window.removeEventListener("scrollend", handleScrollEnd);
      if (scrollSettleTimeout !== 0) {
        window.clearTimeout(scrollSettleTimeout);
        scrollSettleTimeout = 0;
      }
      latestScrollYRef.current = window.scrollY;
      rememberScrollPosition(location.key, window.scrollY);
      suppressScrollPersistenceRef.current = false;
    }

    function holdUntilScrollSettles() {
      window.addEventListener("scrollend", handleScrollEnd);
      scrollSettleTimeout = window.setTimeout(handleScrollEnd, SCROLL_SETTLE_TIMEOUT_MS);
    }

    const cancelScheduledScroll = () => {
      cancelled = true;
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      cancelScrollRestore?.();
      cancelScrollRestore = null;
      if (scrollSettleTimeout !== 0) {
        window.clearTimeout(scrollSettleTimeout);
        scrollSettleTimeout = 0;
      }
      window.removeEventListener("scrollend", handleScrollEnd);
    };

    cancelScheduledScrollRef.current = cancelScheduledScroll;

    const isStillOnInitialDocumentEntry =
      !hasLeftInitialHistoryEntryRef.current && location.key === initialHistoryKeyRef.current;
    const savedScrollY = savedScrollYOnArrivalRef.current;
    const shouldRestoreScroll =
      navigationType === "POP" &&
      savedScrollY !== undefined &&
      (!isStillOnInitialDocumentEntry || isBackForwardDocumentLoad());

    if (shouldRestoreScroll) {
      latestScrollYRef.current = savedScrollY;
      rememberScrollPosition(location.key, savedScrollY);
      cancelScrollRestore = scheduleScrollRestore(savedScrollY, (appliedScrollY) => {
        if (cancelled) {
          return;
        }
        latestScrollYRef.current = appliedScrollY;
        rememberScrollPosition(location.key, appliedScrollY);
        suppressScrollPersistenceRef.current = false;
      });
    } else if (location.hash) {
      if (!scrollToHashElement(location.hash)) {
        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = 0;
          if (cancelled) {
            return;
          }
          scrollToHashElement(location.hash);
          holdUntilScrollSettles();
        });
      } else {
        holdUntilScrollSettles();
      }
    } else {
      latestScrollYRef.current = 0;
      rememberScrollPosition(location.key, 0);
      window.scrollTo(0, 0);
      if (window.scrollY !== 0) {
        holdUntilScrollSettles();
      } else {
        suppressScrollPersistenceRef.current = false;
      }
    }

    return () => {
      const scheduledScroll = cancelScheduledScrollRef.current;
      cancelScheduledScroll();
      if (scheduledScroll && scheduledScroll !== cancelScheduledScroll) {
        scheduledScroll();
      }
      cancelScheduledScrollRef.current = null;
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollToTop;
