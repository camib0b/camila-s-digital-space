import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrefersReducedMotion } from "@/components/experience-diagrams/experienceDiagramMotion";
import { AVA_EXPORTED_CLIP, resolveAvaModeMedia, type ResolvedAvaModeMedia } from "@/content/avaModes";
import type { TranslationKey } from "@/i18n/types";

const journeyNarrowQuery = "(max-width: 767px)";

const journeySteps = [
  {
    id: "tag",
    index: "01",
    titleKey: "ava.modes.tagging.title",
    bodyKey: "ava.modes.tagging.body",
    media: { src: "tagging", altKey: "ava.modes.tagging.alt" },
  },
  {
    id: "present",
    index: "02",
    titleKey: "ava.modes.presentation.title",
    bodyKey: "ava.modes.presentation.body",
    media: { src: "presentation", altKey: "ava.modes.presentation.alt" },
  },
  {
    id: "export",
    index: "03",
    titleKey: "ava.session.flow.export",
    bodyKey: "ava.how.body",
    media: AVA_EXPORTED_CLIP,
  },
] as const satisfies readonly {
  id: string;
  index: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  media: { src: string; altKey: TranslationKey };
}[];

function JourneyFrame({ media }: { media: ResolvedAvaModeMedia }) {
  const { t } = useLanguage();

  return (
    <div className="ava-journey-frame">
      <img
        src={media.webp[1280]}
        srcSet={`${media.webp[640]} 640w, ${media.webp[1280]} 1280w`}
        sizes="(min-width: 768px) 34rem, calc(100vw - 2.5rem)"
        width={media.width}
        height={media.height}
        alt={t(media.altKey)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function nextTabIndex(key: string, currentIndex: number, count: number): number | null {
  if (key === "ArrowDown" || key === "ArrowRight") {
    return Math.min(count - 1, currentIndex + 1);
  }
  if (key === "ArrowUp" || key === "ArrowLeft") {
    return Math.max(0, currentIndex - 1);
  }
  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return count - 1;
  }
  return null;
}

const AvaJourney = () => {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [narrowViewport, setNarrowViewport] = useState(
    () => typeof window !== "undefined" && window.matchMedia(journeyNarrowQuery).matches,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const unwrapped = reducedMotion || narrowViewport;

  useEffect(() => {
    const query = window.matchMedia(journeyNarrowQuery);
    const syncViewport = () => {
      setNarrowViewport(query.matches);
    };

    syncViewport();
    query.addEventListener("change", syncViewport);
    return () => query.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (unwrapped) {
      return undefined;
    }

    const section = sectionRef.current;
    if (section === null) {
      return undefined;
    }

    let frame = 0;
    const syncToScroll = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -bounds.top / scrollable));
      const nextIndex = Math.min(journeySteps.length - 1, Math.floor(progress * journeySteps.length));
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(syncToScroll);
    };

    syncToScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [unwrapped]);

  const selectStep = (index: number) => {
    setActiveIndex(index);
    const section = sectionRef.current;
    if (unwrapped || section === null) {
      return;
    }

    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      return;
    }

    const progress = (index + 0.5) / journeySteps.length;
    const top = section.getBoundingClientRect().top + window.scrollY + progress * scrollable;
    window.scrollTo({ top, behavior: "auto" });
  };

  const onTabListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const nextIndex = nextTabIndex(event.key, activeIndex, journeySteps.length);
    if (nextIndex === null || nextIndex === activeIndex) {
      return;
    }

    event.preventDefault();
    selectStep(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  if (unwrapped) {
    return (
      <section className="ava-section ava-journey" data-unwrapped="true" id="ava-journey">
        <div className="ava-shell">
          <h2 className="ava-kicker">{t("ava.session.kicker")}</h2>
          <ol className="ava-journey-stack">
            {journeySteps.map((step) => (
              <li key={step.id}>
                <p className="ava-kicker">{step.index}</p>
                <h3>{t(step.titleKey)}</h3>
                <p>{t(step.bodyKey)}</p>
                <JourneyFrame media={resolveAvaModeMedia(step.media)} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="ava-section ava-journey"
      data-unwrapped="false"
      id="ava-journey"
    >
      <div className="ava-journey-sticky">
        <div className="ava-journey-copy">
          <h2 className="ava-kicker" id="ava-journey-label">
            {t("ava.session.kicker")}
          </h2>
          <div
            role="tablist"
            aria-labelledby="ava-journey-label"
            aria-orientation="vertical"
            onKeyDown={onTabListKeyDown}
          >
            {journeySteps.map((step, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={step.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`ava-journey-tab-${step.id}`}
                  className="ava-journey-tab"
                  aria-selected={selected}
                  aria-controls={`ava-journey-panel-${step.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectStep(index)}
                >
                  <span className="ava-kicker">{step.index}</span>
                  <span className="ava-journey-tab-title">{t(step.titleKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="ava-journey-stage">
          {journeySteps.map((step, index) => (
            <div
              key={step.id}
              role="tabpanel"
              id={`ava-journey-panel-${step.id}`}
              aria-labelledby={`ava-journey-tab-${step.id}`}
              hidden={index !== activeIndex}
              className="ava-journey-panel"
            >
              <p>{t(step.bodyKey)}</p>
              <JourneyFrame media={resolveAvaModeMedia(step.media)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvaJourney;
