export const HASH_SCROLL_GIVE_UP_MS = 4000;

export interface HashScrollScheduler {
  getElementById: (id: string) => HTMLElement | null;
  observe: (onChange: () => void) => () => void;
  requestFrame: (callback: () => void) => number;
  cancelFrame: (handle: number) => void;
  setTimeout: (callback: () => void, delayMs: number) => number;
  clearTimeout: (handle: number) => void;
  scrollTo: (element: HTMLElement) => void;
}

/** Fragment id for `/ava#ava-interest` and the trailing-slash form `/ava/#ava-interest`. */
export function elementIdFromHash(hash: string): string {
  if (!hash.startsWith("#") || hash.length < 2) {
    return "";
  }
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

/**
 * Scrolls to the fragment after the target has been painted.
 * A lazy route and the `/ava` → `/ava/` redirect both insert `#ava-interest`
 * after the first layout pass, so one animation frame is not enough.
 * The returned function cancels a pending scroll and does not settle.
 */
export function scheduleScrollToHash(
  hash: string,
  scheduler: HashScrollScheduler,
  onSettled?: () => void,
): () => void {
  const id = elementIdFromHash(hash);
  let stopped = false;
  let waitingForPaint = false;
  let frame = 0;
  let timer = 0;
  let disconnect = () => {};

  const settle = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    disconnect();
    if (frame !== 0) {
      scheduler.cancelFrame(frame);
      frame = 0;
    }
    if (timer !== 0) {
      scheduler.clearTimeout(timer);
      timer = 0;
    }
    onSettled?.();
  };

  if (!id) {
    onSettled?.();
    return () => {};
  }

  const paintThenScroll = (element: HTMLElement) => {
    if (stopped || waitingForPaint) {
      return;
    }
    waitingForPaint = true;
    disconnect();
    frame = scheduler.requestFrame(() => {
      frame = 0;
      if (stopped) {
        return;
      }
      scheduler.scrollTo(element);
      settle();
    });
  };

  const look = () => {
    if (stopped || waitingForPaint) {
      return;
    }
    const element = scheduler.getElementById(id);
    if (element) {
      paintThenScroll(element);
    }
  };

  disconnect = scheduler.observe(look);
  timer = scheduler.setTimeout(() => {
    timer = 0;
    settle();
  }, HASH_SCROLL_GIVE_UP_MS);
  look();

  return () => {
    if (stopped) {
      return;
    }
    stopped = true;
    disconnect();
    if (frame !== 0) {
      scheduler.cancelFrame(frame);
    }
    if (timer !== 0) {
      scheduler.clearTimeout(timer);
    }
  };
}

export function browserHashScrollScheduler(): HashScrollScheduler {
  return {
    getElementById: (id) => document.getElementById(id),
    observe: (onChange) => {
      if (!document.body) {
        return () => {};
      }
      const observer = new MutationObserver(onChange);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    },
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    cancelFrame: (handle) => window.cancelAnimationFrame(handle),
    setTimeout: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimeout: (handle) => window.clearTimeout(handle),
    scrollTo: (element) => {
      element.scrollIntoView({ block: "start" });
    },
  };
}
