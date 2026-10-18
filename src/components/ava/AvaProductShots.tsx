import tagging640Avif from "@/assets/ava/tagging-640.avif";
import tagging1280Avif from "@/assets/ava/tagging-1280.avif";
import tagging1920Avif from "@/assets/ava/tagging-1920.avif";
import tagging2560Avif from "@/assets/ava/tagging-2560.avif";
import tagging640Webp from "@/assets/ava/tagging-640.webp";
import tagging1280Webp from "@/assets/ava/tagging-1280.webp";
import tagging1920Webp from "@/assets/ava/tagging-1920.webp";
import tagging2560Webp from "@/assets/ava/tagging-2560.webp";
import presentation640Avif from "@/assets/ava/presentation-640.avif";
import presentation1280Avif from "@/assets/ava/presentation-1280.avif";
import presentation1920Avif from "@/assets/ava/presentation-1920.avif";
import presentation2560Avif from "@/assets/ava/presentation-2560.avif";
import presentation640Webp from "@/assets/ava/presentation-640.webp";
import presentation1280Webp from "@/assets/ava/presentation-1280.webp";
import presentation1920Webp from "@/assets/ava/presentation-1920.webp";
import presentation2560Webp from "@/assets/ava/presentation-2560.webp";
import export640Avif from "@/assets/ava/export-640.avif";
import export1280Avif from "@/assets/ava/export-1280.avif";
import export1920Avif from "@/assets/ava/export-1920.avif";
import export2560Avif from "@/assets/ava/export-2560.avif";
import export640Webp from "@/assets/ava/export-640.webp";
import export1280Webp from "@/assets/ava/export-1280.webp";
import export1920Webp from "@/assets/ava/export-1920.webp";
import export2560Webp from "@/assets/ava/export-2560.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

/** macOS window crop, including the #070708 gutter. Keep in sync with `.ava-shot-image`. */
const DESKTOP_SHOT_WIDTH = 2972;
const DESKTOP_SHOT_HEIGHT = 1878;

/** Exported-clip crop. Wider than the desktop window. Keep in sync with `.ava-shot[data-shot="export"] .ava-shot-image`. */
const EXPORTED_CLIP_WIDTH = 3164;
const EXPORTED_CLIP_HEIGHT = 1878;

const SHOT_SIZES = "(min-width: 1216px) 1112px, (min-width: 500px) 92vw, calc(100vw - 2.5rem)";

interface ShotSources {
  640: string;
  1280: string;
  1920: string;
  2560: string;
}

interface ProductShot {
  id: "tagging" | "presentation" | "export";
  width: number;
  height: number;
  kickerKey: TranslationKey;
  captionKey: TranslationKey;
  altKey: TranslationKey;
  avif: ShotSources;
  webp: ShotSources;
}

const PRODUCT_SHOTS: ProductShot[] = [
  {
    id: "tagging",
    width: DESKTOP_SHOT_WIDTH,
    height: DESKTOP_SHOT_HEIGHT,
    kickerKey: "ava.shots.tagging.kicker",
    captionKey: "ava.shots.tagging.caption",
    altKey: "ava.shots.tagging.alt",
    avif: {
      640: tagging640Avif,
      1280: tagging1280Avif,
      1920: tagging1920Avif,
      2560: tagging2560Avif,
    },
    webp: {
      640: tagging640Webp,
      1280: tagging1280Webp,
      1920: tagging1920Webp,
      2560: tagging2560Webp,
    },
  },
  {
    id: "presentation",
    width: DESKTOP_SHOT_WIDTH,
    height: DESKTOP_SHOT_HEIGHT,
    kickerKey: "ava.shots.presentation.kicker",
    captionKey: "ava.shots.presentation.caption",
    altKey: "ava.shots.presentation.alt",
    avif: {
      640: presentation640Avif,
      1280: presentation1280Avif,
      1920: presentation1920Avif,
      2560: presentation2560Avif,
    },
    webp: {
      640: presentation640Webp,
      1280: presentation1280Webp,
      1920: presentation1920Webp,
      2560: presentation2560Webp,
    },
  },
  {
    id: "export",
    width: EXPORTED_CLIP_WIDTH,
    height: EXPORTED_CLIP_HEIGHT,
    kickerKey: "ava.shots.export.kicker",
    captionKey: "ava.shots.export.caption",
    altKey: "ava.shots.export.alt",
    avif: {
      640: export640Avif,
      1280: export1280Avif,
      1920: export1920Avif,
      2560: export2560Avif,
    },
    webp: {
      640: export640Webp,
      1280: export1280Webp,
      1920: export1920Webp,
      2560: export2560Webp,
    },
  },
];

function sourceSet(sources: ShotSources): string {
  return `${sources[640]} 640w, ${sources[1280]} 1280w, ${sources[1920]} 1920w, ${sources[2560]} 2560w`;
}

const AvaProductShots = () => {
  const { t } = useLanguage();

  return (
    <div className="ava-shots">
      {PRODUCT_SHOTS.map((shot) => (
        <figure className="ava-shot" data-shot={shot.id} key={shot.id}>
          <div className="ava-shot-frame">
            <picture>
              <source type="image/avif" srcSet={sourceSet(shot.avif)} sizes={SHOT_SIZES} />
              <source type="image/webp" srcSet={sourceSet(shot.webp)} sizes={SHOT_SIZES} />
              <img
                className="ava-shot-image"
                src={shot.webp[1280]}
                srcSet={sourceSet(shot.webp)}
                sizes={SHOT_SIZES}
                width={shot.width}
                height={shot.height}
                alt={t(shot.altKey)}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <figcaption className="ava-shot-caption">
            <p className="ava-kicker">{t(shot.kickerKey)}</p>
            <p className="ava-shot-caption-text">{t(shot.captionKey)}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default AvaProductShots;
