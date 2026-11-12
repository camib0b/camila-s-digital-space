import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type FocusEvent as ReactFocusEvent } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/components/experience-diagrams/experienceDiagramMotion";
import { keptDuration } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type EditorialStatModel = {
  key: string;
  label: string;
  value: string;
  tone: string;
  pending: boolean;
};

type EditorialMotion = "ready" | "play";

function motionSettled(element: HTMLElement): boolean {
  if (typeof element.getAnimations !== "function") {
    return true;
  }

  const animations = element.getAnimations({ subtree: true });
  if (animations.length === 0) {
    return true;
  }

  return animations.every((animation) => animation.playState === "finished");
}

function EditorialStat({ stat }: { stat: EditorialStatModel }) {
  const reducedMotion = usePrefersReducedMotion();
  const statRef = useRef<HTMLButtonElement>(null);
  const lastRestartAt = useRef(Number.NEGATIVE_INFINITY);
  const [motion, setMotion] = useState<EditorialMotion>("ready");
  const interactive = !stat.pending && !reducedMotion;

  useEffect(() => {
    if (!interactive) {
      return undefined;
    }

    const statElement = statRef.current;
    if (statElement === null || typeof IntersectionObserver === "undefined") {
      setMotion("play");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry?.isIntersecting) {
          return;
        }
        setMotion("play");
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(statElement);

    return () => {
      observer.disconnect();
    };
  }, [interactive]);

  const replay = () => {
    const statElement = statRef.current;
    if (statElement === null || prefersReducedMotion()) {
      return;
    }

    const now = performance.now();
    if (now - lastRestartAt.current < keptDuration.snap) {
      return;
    }
    if (!motionSettled(statElement)) {
      return;
    }

    lastRestartAt.current = now;
    flushSync(() => {
      setMotion("ready");
    });
    void statElement.getBoundingClientRect();
    flushSync(() => {
      setMotion("play");
    });
  };

  const onPointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    replay();
  };

  const onFocus = (event: ReactFocusEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.matches(":focus-visible")) {
      return;
    }
    replay();
  };

  const value = stat.pending ? (
    <span className="portfolio-skeleton-block inline-block h-[0.72em] w-[5.5ch] align-middle bg-foreground/10" aria-hidden="true" />
  ) : (
    stat.value
  );

  const body = (
    <>
      <span className={cn("editorial-stat-value font-mono font-light tabular-nums", stat.pending ? "text-foreground" : stat.tone)}>
        {value}
      </span>
      <span className="editorial-stat-rule" aria-hidden="true" />
      <span className="font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
        {stat.label}
      </span>
    </>
  );

  if (!interactive) {
    return (
      <div className="editorial-stat" aria-busy={stat.pending} data-pending={stat.pending ? "true" : undefined}>
        {body}
      </div>
    );
  }

  return (
    <button
      ref={statRef}
      type="button"
      className="editorial-stat"
      data-editorial-motion={motion}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      onClick={replay}
    >
      {body}
    </button>
  );
}

export function EditorialStatRow({ stats }: { stats: readonly EditorialStatModel[] }) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
      {stats.map((stat) => (
        <EditorialStat key={stat.key} stat={stat} />
      ))}
    </div>
  );
}
