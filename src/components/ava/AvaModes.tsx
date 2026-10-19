import { useEffect, useRef, useState } from "react";
import {
  AVA_MODES,
  resolveAvaModeMedia,
  type AvaMode,
  type ResolvedAvaModeMedia,
} from "@/content/avaModes";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

const PRIMARY_SHOT_SIZES = "(min-width: 860px) 40rem, calc(100vw - 2.5rem)";
const SECONDARY_SHOT_SIZES = "(min-width: 860px) 22rem, 46vw";

/** Teams in the Tagging and Presentation screenshots. Names stay untranslated. */
const SAMPLE_TEAM_NAMES = ["Cogs", "Old Girls"] as const;

/** Illustrative split. The two shares must sum to 100. */
const SAMPLE_POSSESSION_PERCENT = 58;

const ANALYZING_SAMPLE_ROWS: ReadonlyArray<{
  id: "possession" | "circle-entries" | "shots" | "penalty-corners" | "turnovers";
  labelKey: TranslationKey;
  firstTeamCount: string;
  secondTeamCount: string;
}> = [
  {
    id: "possession",
    labelKey: "ava.modes.analyzing.possession",
    firstTeamCount: `${SAMPLE_POSSESSION_PERCENT}%`,
    secondTeamCount: `${100 - SAMPLE_POSSESSION_PERCENT}%`,
  },
  {
    id: "circle-entries",
    labelKey: "ava.modes.analyzing.entries",
    firstTeamCount: "21",
    secondTeamCount: "12",
  },
  {
    id: "shots",
    labelKey: "ava.modes.analyzing.shots",
    firstTeamCount: "14",
    secondTeamCount: "8",
  },
  {
    id: "penalty-corners",
    labelKey: "ava.modes.analyzing.pcs",
    firstTeamCount: "5",
    secondTeamCount: "2",
  },
  {
    id: "turnovers",
    labelKey: "ava.modes.analyzing.turnovers",
    firstTeamCount: "16",
    secondTeamCount: "19",
  },
];

interface AvaModeShotSources {
  640: string;
  1280: string;
  1920: string;
  2560: string;
}

function sourceSet(sources: AvaModeShotSources): string {
  return `${sources[640]} 640w, ${sources[1280]} 1280w, ${sources[1920]} 1920w, ${sources[2560]} 2560w`;
}

function AvaModeShot({
  media,
  role,
}: {
  media: ResolvedAvaModeMedia;
  role: "primary" | "secondary";
}) {
  const { t } = useLanguage();
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasDecodedImage, setHasDecodedImage] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sizes = role === "primary" ? PRIMARY_SHOT_SIZES : SECONDARY_SHOT_SIZES;

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const image = imageRef.current;
    if (!image) {
      return;
    }

    // A fully clipped lazy image has no visible intersection, so the browser
    // never fetches it and the reveal cannot start. The frame is in view;
    // load the bitmap now.
    if (image.loading !== "eager") {
      image.loading = "eager";
    }

    if (image.complete && image.naturalWidth > 0) {
      setHasDecodedImage(true);
    }
  }, [isInView]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }
        setIsInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const isRevealed = hasDecodedImage && isInView;

  return (
    <figure className="ava-shot" data-shot={media.src}>
      <div className="ava-shot-frame" ref={frameRef} data-visible={isRevealed ? "true" : "false"}>
        <picture>
          <source type="image/avif" srcSet={sourceSet(media.avif)} sizes={sizes} />
          <source type="image/webp" srcSet={sourceSet(media.webp)} sizes={sizes} />
          <img
            ref={imageRef}
            className="ava-shot-image"
            src={media.webp[1280]}
            srcSet={sourceSet(media.webp)}
            sizes={sizes}
            width={media.width}
            height={media.height}
            style={{ aspectRatio: `${media.width} / ${media.height}` }}
            alt={t(media.altKey)}
            loading="lazy"
            decoding="async"
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth > 0) {
                setHasDecodedImage(true);
              }
            }}
            onError={() => {
              setHasDecodedImage(true);
            }}
          />
        </picture>
      </div>
      {media.captionKey ? <figcaption className="ava-shot-caption">{t(media.captionKey)}</figcaption> : null}
    </figure>
  );
}

function AnalyzingSamplePanel({ noteId }: { noteId: string }) {
  const { t } = useLanguage();

  return (
    <figure className="ava-analyze">
      <div className="ava-analyze-head">
        <p className="ava-kicker">{t("ava.modes.analyzing.sample")}</p>
      </div>
      <div className="ava-analyze-stats" role="table" aria-labelledby={noteId}>
        <div className="ava-analyze-row is-head" role="row">
          <span role="columnheader">
            <span className="sr-only">{t("ava.modes.analyzing.statistic")}</span>
          </span>
          <span role="columnheader">{SAMPLE_TEAM_NAMES[0]}</span>
          <span role="columnheader">{SAMPLE_TEAM_NAMES[1]}</span>
        </div>
        {ANALYZING_SAMPLE_ROWS.map((row) => (
          <div
            key={row.id}
            className={row.id === "possession" ? "ava-analyze-row is-possession" : "ava-analyze-row"}
            role="row"
          >
            <span role="rowheader">{t(row.labelKey)}</span>
            <span role="cell">{row.firstTeamCount}</span>
            <span role="cell">{row.secondTeamCount}</span>
            {row.id === "possession" ? (
              <div className="ava-analyze-bar" aria-hidden="true">
                <span style={{ width: `${SAMPLE_POSSESSION_PERCENT}%` }} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="ava-analyze-note" id={noteId}>
        {t("ava.modes.analyzing.sampleNote")}
      </p>
    </figure>
  );
}

function ModeMedia({ mode }: { mode: AvaMode }) {
  if (mode.media.length === 0) {
    return (
      <div className="ava-mode-media">
        <AnalyzingSamplePanel noteId={`ava-analyze-note-${mode.id}`} />
      </div>
    );
  }

  const [primaryMedia, ...secondaryMedia] = mode.media;
  const primaryShot = resolveAvaModeMedia(primaryMedia);

  return (
    <div className={secondaryMedia.length > 0 ? "ava-mode-media ava-mode-gallery" : "ava-mode-media"}>
      <AvaModeShot media={primaryShot} role="primary" />
      {secondaryMedia.length > 0 ? (
        <div className="ava-mode-gallery-items" data-count={secondaryMedia.length}>
          {secondaryMedia.map((item) => (
            <AvaModeShot
              key={`${item.src}-${item.altKey}`}
              media={resolveAvaModeMedia(item)}
              role="secondary"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const AvaModes = () => {
  const { t } = useLanguage();

  return (
    <div className="ava-modes" id="ava-modes">
      {AVA_MODES.map((mode, index) => (
        <article className="ava-mode" key={mode.id} data-media={index % 2 === 0 ? "start" : "end"}>
          <div className="ava-mode-copy">
            <p className="ava-kicker">{mode.index}</p>
            <h3>{t(mode.titleKey)}</h3>
            <p className="ava-mode-body">{t(mode.bodyKey)}</p>
          </div>
          <ModeMedia mode={mode} />
        </article>
      ))}
    </div>
  );
};

export default AvaModes;
