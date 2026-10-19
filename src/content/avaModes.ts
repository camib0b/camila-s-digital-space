import type { TranslationKey } from "@/i18n/types";

/**
 * Modes rows on /ava. Each mode's `media` list is the screenshots for that row.
 *
 * To add a screenshot, add one line to that mode's `media` array:
 *   { src: "tagging", altKey: "ava.modes.tagging.alt" }
 * `src` is the basename of files in src/assets/ava/: `tagging-640.avif`,
 * `tagging-640.webp`, and the same pair at 1280, 1920, and 2560.
 * `captionKey` is optional and prints under that image.
 * `width` and `height` are optional and default to the macOS window crop, 2972×1878.
 * A mode with no media shows the sample stat panel.
 */
export interface AvaModeMediaItem {
  src: string;
  altKey: TranslationKey;
  captionKey?: TranslationKey;
  width?: number;
  height?: number;
}

export interface AvaMode {
  id: string;
  index: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  media: readonly AvaModeMediaItem[];
}

/** macOS window crop, including the #070708 gutter. */
const DEFAULT_SHOT_WIDTH = 2972;
const DEFAULT_SHOT_HEIGHT = 1878;

/** Exported-clip crop. Wider than the desktop window. */
const EXPORTED_CLIP_WIDTH = 3164;
const EXPORTED_CLIP_HEIGHT = 1878;

const SHOT_WIDTHS = [640, 1280, 1920, 2560] as const;
type ShotWidth = (typeof SHOT_WIDTHS)[number];

export interface AvaModeShotSources {
  640: string;
  1280: string;
  1920: string;
  2560: string;
}

export interface ResolvedAvaModeMedia {
  src: string;
  altKey: TranslationKey;
  captionKey?: TranslationKey;
  width: number;
  height: number;
  avif: AvaModeShotSources;
  webp: AvaModeShotSources;
}

const avaShotUrls = import.meta.glob("../assets/ava/*.{avif,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function shotFileUrl(basename: string, width: ShotWidth, extension: "avif" | "webp"): string {
  const fileName = `${basename}-${width}.${extension}`;
  const match = Object.entries(avaShotUrls).find(([path]) => path.endsWith(`/${fileName}`));
  if (!match) {
    throw new Error(`AVA mode screenshot "${basename}" is missing src/assets/ava/${fileName}.`);
  }
  return match[1];
}

function sourcesFor(basename: string, extension: "avif" | "webp"): AvaModeShotSources {
  return {
    640: shotFileUrl(basename, 640, extension),
    1280: shotFileUrl(basename, 1280, extension),
    1920: shotFileUrl(basename, 1920, extension),
    2560: shotFileUrl(basename, 2560, extension),
  };
}

export function resolveAvaModeMedia(item: AvaModeMediaItem): ResolvedAvaModeMedia {
  return {
    src: item.src,
    altKey: item.altKey,
    captionKey: item.captionKey,
    width: item.width ?? DEFAULT_SHOT_WIDTH,
    height: item.height ?? DEFAULT_SHOT_HEIGHT,
    avif: sourcesFor(item.src, "avif"),
    webp: sourcesFor(item.src, "webp"),
  };
}

export const AVA_MODES: readonly AvaMode[] = [
  {
    id: "tagging",
    index: "01",
    titleKey: "ava.modes.tagging.title",
    bodyKey: "ava.modes.tagging.body",
    media: [{ src: "tagging", altKey: "ava.modes.tagging.alt" }],
  },
  {
    id: "analyzing",
    index: "02",
    titleKey: "ava.modes.analyzing.title",
    bodyKey: "ava.modes.analyzing.body",
    media: [],
  },
  {
    id: "presentation",
    index: "03",
    titleKey: "ava.modes.presentation.title",
    bodyKey: "ava.modes.presentation.body",
    media: [
      { src: "presentation", altKey: "ava.modes.presentation.alt" },
      {
        src: "export",
        altKey: "ava.modes.presentation.exportAlt",
        width: EXPORTED_CLIP_WIDTH,
        height: EXPORTED_CLIP_HEIGHT,
      },
    ],
  },
];

for (const mode of AVA_MODES) {
  for (const item of mode.media) {
    resolveAvaModeMedia(item);
  }
}
