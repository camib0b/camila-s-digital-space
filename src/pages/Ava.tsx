import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { renderWithCarpetaLinks } from "@/components/ava/avaCarpetaLink";
import LanguageToggle from "@/components/LanguageToggle";
import AvaClipBar from "@/components/ava/AvaClipBar";
import AvaConcatGraphic from "@/components/ava/AvaConcat";
import AvaExportJobs from "@/components/ava/AvaExportJobs";
import AvaInterestForm from "@/components/ava/AvaInterestForm";
import AvaModes, { AvaModeShot } from "@/components/ava/AvaModes";
import AvaSession from "@/components/ava/AvaSession";
import AvaStage, { AvaTimeline } from "@/components/ava/AvaStage";
import "@/components/ava/ava.css";
import "@/components/ava/ava-motion.css";
import { AVA_EVENTS, AVA_FOLLOW_UPS, AVA_INTEREST_EMAIL } from "@/content/ava";
import { AVA_EXPORTED_CLIP, resolveAvaModeMedia } from "@/content/avaModes";
import { useLanguage } from "@/contexts/LanguageContext";

const CONCAT_STEPS = [
  { index: "01", titleKey: "ava.concat.step1.title", bodyKey: "ava.concat.step1.body" },
  { index: "02", titleKey: "ava.concat.step2.title", bodyKey: "ava.concat.step2.body" },
  { index: "03", titleKey: "ava.concat.step3.title", bodyKey: "ava.concat.step3.body" },
] as const;

const TAG_FLASH_DURATION_MS = 150;
const TAG_SECTION_ROOT_MARGIN = "-8% 0px -8% 0px";
const PHANTOM_PRESS_DOWN_MS = 120;
const PHANTOM_SECOND_KEY_DELAY_MS = 600;
const PHANTOM_VISIBILITY_THRESHOLD = 0.6;

type TagEventShortcut = (typeof AVA_EVENTS)[number]["shortcut"];

// PC Foul (S) and PS (B) stay in the desktop control map, but their tiles are
// not drawn. Empty slots keep the remaining keys on real QWERTY centers.
const TAG_KEYBOARD_OMITTED_SHORTCUTS = ["S", "B"] as const satisfies readonly TagEventShortcut[];

type OmittedTagShortcut = (typeof TAG_KEYBOARD_OMITTED_SHORTCUTS)[number];
type PlacedTagShortcut = Exclude<TagEventShortcut, OmittedTagShortcut>;

type TagKeyboardSlot =
  | { readonly kind: "key"; readonly shortcut: PlacedTagShortcut }
  | { readonly kind: "gap"; readonly id: string };

// ANSI letter rows: the home row sits 0.25 key right of Q, the bottom row 0.75.
const TAG_KEYBOARD_ROWS = [
  {
    id: "top",
    slots: [
      { kind: "key", shortcut: "Q" },
      { kind: "key", shortcut: "W" },
      { kind: "key", shortcut: "E" },
      { kind: "key", shortcut: "R" },
    ],
  },
  {
    id: "home",
    slots: [
      { kind: "key", shortcut: "A" },
      { kind: "gap", id: "s" },
      { kind: "key", shortcut: "D" },
      { kind: "key", shortcut: "F" },
    ],
  },
  {
    id: "bottom",
    slots: [
      { kind: "key", shortcut: "Z" },
      { kind: "key", shortcut: "X" },
      { kind: "key", shortcut: "C" },
      { kind: "key", shortcut: "V" },
      { kind: "gap", id: "b" },
      { kind: "key", shortcut: "N" },
    ],
  },
] as const satisfies readonly {
  id: "top" | "home" | "bottom";
  slots: readonly TagKeyboardSlot[];
}[];

// Goal is F in this layout. Shot (D) follows so the hint shows a second tile.
const PHANTOM_TAG_SHORTCUTS = ["F", "D"] as const satisfies readonly PlacedTagShortcut[];

const omittedTagShortcuts = new Set<string>(TAG_KEYBOARD_OMITTED_SHORTCUTS);
const placedTagShortcuts = new Set<string>(
  TAG_KEYBOARD_ROWS.flatMap((row) =>
    row.slots.flatMap((slot) => (slot.kind === "key" ? [slot.shortcut] : [])),
  ),
);

for (const event of AVA_EVENTS) {
  if (omittedTagShortcuts.has(event.shortcut)) {
    if (placedTagShortcuts.has(event.shortcut)) {
      throw new Error(`Remove ${event.token} (${event.shortcut}) from the tag keyboard.`);
    }
    continue;
  }

  if (!placedTagShortcuts.has(event.shortcut)) {
    throw new Error(`Place ${event.token} (${event.shortcut}) on the tag keyboard.`);
  }
}

function tagEventForShortcut(shortcut: (typeof AVA_EVENTS)[number]["shortcut"]) {
  const event = AVA_EVENTS.find((item) => item.shortcut === shortcut);
  if (!event) {
    throw new Error(`Missing AVA tag event for ${shortcut}.`);
  }

  return event;
}

type TagShortcutActivation = {
  press: () => void;
  release: () => void;
  cancel: () => void;
};

type KeyboardTagCellProps = {
  label: string;
  shortcut: string;
  variant?: "concept" | "control";
  registerTagActivation: (shortcut: string, activation: TagShortcutActivation | null) => void;
};

function isTagActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}

function shortcutLetter(event: KeyboardEvent): string | null {
  if (event.key.length !== 1 || !/^[a-z]$/i.test(event.key)) {
    return null;
  }

  return event.key.toUpperCase();
}

function tagShortcutFromEvent(event: KeyboardEvent): string | null {
  if (event.key === " " || event.code === "Space") {
    return "SPACE";
  }

  return shortcutLetter(event);
}

function isFocusedTagTile(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(".ava-event") !== null;
}

function ownsSpaceActivation(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  if (isFocusedTagTile(target)) {
    return true;
  }

  return (
    target.closest(
      "a, button, summary, [role='button'], [role='link'], [role='checkbox'], [role='switch'], [role='radio']",
    ) !== null
  );
}

function hasKeyboardModifier(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey || event.shiftKey;
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']") !== null;
}

function holdIdentity(event: KeyboardEvent): string {
  if (event.code.startsWith("Key")) {
    return event.code;
  }

  return event.key;
}

function useTagKeyboardShortcuts(
  sectionRef: RefObject<HTMLElement | null>,
  activationsRef: RefObject<Map<string, TagShortcutActivation>>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const activations = activationsRef.current;
    if (!section || !activations) {
      return undefined;
    }

    const heldShortcuts = new Map<string, string>();
    let isInView = false;
    let isFocused = section.contains(document.activeElement);
    let detachKeyboardListeners: (() => void) | null = null;

    const releaseHeldShortcuts = () => {
      for (const shortcut of heldShortcuts.values()) {
        activations.get(shortcut)?.release();
      }
      heldShortcuts.clear();
    };

    const detachKeyboard = () => {
      detachKeyboardListeners?.();
      detachKeyboardListeners = null;
    };

    const attachKeyboard = () => {
      if (detachKeyboardListeners) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.isComposing || isTextEntryTarget(event.target) || hasKeyboardModifier(event)) {
          return;
        }

        const shortcut = tagShortcutFromEvent(event);
        if (!shortcut || !activations.has(shortcut)) {
          return;
        }

        if (shortcut === "SPACE" && ownsSpaceActivation(event.target)) {
          return;
        }

        event.preventDefault();
        const identity = holdIdentity(event);
        if (event.repeat || heldShortcuts.has(identity)) {
          return;
        }

        heldShortcuts.set(identity, shortcut);
        activations.get(shortcut)?.press();
      };

      const releaseHold = (identity: string) => {
        const shortcut = heldShortcuts.get(identity);
        if (!shortcut) {
          return;
        }

        heldShortcuts.delete(identity);
        activations.get(shortcut)?.release();
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        releaseHold(holdIdentity(event));

        const letter = shortcutLetter(event);
        if (!letter) {
          return;
        }

        for (const [identity, shortcut] of heldShortcuts) {
          if (shortcut === letter) {
            releaseHold(identity);
          }
        }
      };

      const releaseOnFocusLoss = () => {
        releaseHeldShortcuts();
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("blur", releaseOnFocusLoss);
      detachKeyboardListeners = () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("blur", releaseOnFocusLoss);
      };
    };

    const syncListening = () => {
      if (isInView || isFocused) {
        attachKeyboard();
        return;
      }

      detachKeyboard();
      releaseHeldShortcuts();
    };

    const handleFocusIn = () => {
      isFocused = true;
      syncListening();
    };

    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && section.contains(nextTarget)) {
        return;
      }

      isFocused = false;
      syncListening();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        releaseHeldShortcuts();
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      isInView = true;
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          isInView = Boolean(entry?.isIntersecting);
          syncListening();
        },
        { root: null, rootMargin: TAG_SECTION_ROOT_MARGIN, threshold: 0 },
      );
      observer.observe(section);
    }

    section.addEventListener("focusin", handleFocusIn);
    section.addEventListener("focusout", handleFocusOut);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    syncListening();

    return () => {
      observer?.disconnect();
      section.removeEventListener("focusin", handleFocusIn);
      section.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      detachKeyboard();
      releaseHeldShortcuts();
    };
  }, [activationsRef, sectionRef]);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePhantomTagHint(
  keyboardRef: RefObject<HTMLElement | null>,
  activationsRef: RefObject<Map<string, TagShortcutActivation>>,
) {
  useEffect(() => {
    const keyboard = keyboardRef.current;
    if (!keyboard || typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      return undefined;
    }

    let played = false;
    let cancelled = false;
    const timeouts: number[] = [];
    let detachCancelListeners: (() => void) | null = null;

    const releasePhantomKeys = () => {
      const activations = activationsRef.current;
      if (!activations) {
        return;
      }

      for (const shortcut of PHANTOM_TAG_SHORTCUTS) {
        activations.get(shortcut)?.cancel();
      }
    };

    const detachInteractionListeners = () => {
      detachCancelListeners?.();
      detachCancelListeners = null;
    };

    const cancel = () => {
      if (cancelled) {
        return;
      }

      cancelled = true;
      for (const timeoutId of timeouts) {
        window.clearTimeout(timeoutId);
      }
      timeouts.length = 0;
      releasePhantomKeys();
      detachInteractionListeners();
    };

    const queuePress = (shortcut: (typeof PHANTOM_TAG_SHORTCUTS)[number], delayMs: number) => {
      const pressTimeout = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        activationsRef.current?.get(shortcut)?.press();
        const releaseTimeout = window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          activationsRef.current?.get(shortcut)?.release();
        }, PHANTOM_PRESS_DOWN_MS);
        timeouts.push(releaseTimeout);
      }, delayMs);
      timeouts.push(pressTimeout);
    };

    let observer: IntersectionObserver | null = null;

    const play = () => {
      if (played || cancelled || prefersReducedMotion()) {
        return;
      }

      played = true;
      observer?.disconnect();
      window.addEventListener("pointerdown", cancel, true);
      window.addEventListener("keydown", cancel, true);
      detachCancelListeners = () => {
        window.removeEventListener("pointerdown", cancel, true);
        window.removeEventListener("keydown", cancel, true);
      };

      PHANTOM_TAG_SHORTCUTS.forEach((shortcut, index) => {
        queuePress(shortcut, index * PHANTOM_SECOND_KEY_DELAY_MS);
      });

      const doneTimeout = window.setTimeout(() => {
        detachInteractionListeners();
      }, PHANTOM_SECOND_KEY_DELAY_MS + PHANTOM_PRESS_DOWN_MS);
      timeouts.push(doneTimeout);
    };

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry?.isIntersecting || entry.intersectionRatio < PHANTOM_VISIBILITY_THRESHOLD) {
          return;
        }

        play();
      },
      { threshold: PHANTOM_VISIBILITY_THRESHOLD },
    );
    observer.observe(keyboard);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cancelWhenReduced = () => {
      if (reducedMotion.matches) {
        cancel();
        observer.disconnect();
      }
    };
    reducedMotion.addEventListener("change", cancelWhenReduced);

    const suppressIfUsed = () => {
      if (played) {
        return;
      }

      cancelled = true;
      observer?.disconnect();
    };
    keyboard.addEventListener("pointerdown", suppressIfUsed);
    keyboard.addEventListener("keydown", suppressIfUsed);

    return () => {
      cancel();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", cancelWhenReduced);
      keyboard.removeEventListener("pointerdown", suppressIfUsed);
      keyboard.removeEventListener("keydown", suppressIfUsed);
    };
  }, [activationsRef, keyboardRef]);
}

function KeyboardTagCell({
  label,
  shortcut,
  variant = "concept",
  registerTagActivation,
}: KeyboardTagCellProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTagRef = useRef<() => void>(() => {});
  const releaseTagRef = useRef<() => void>(() => {});
  const cancelTagRef = useRef<() => void>(() => {});

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current !== null) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const flashTag = () => {
    if (flashTimeoutRef.current !== null) {
      clearTimeout(flashTimeoutRef.current);
    }

    setIsFlashing(true);
    flashTimeoutRef.current = setTimeout(() => {
      flashTimeoutRef.current = null;
      setIsFlashing(false);
    }, TAG_FLASH_DURATION_MS);
  };

  const pressTag = () => {
    setIsPressed(true);
    flashTag();
  };

  const releaseTag = () => {
    setIsPressed(false);
  };

  const cancelTag = () => {
    if (flashTimeoutRef.current !== null) {
      clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }

    setIsFlashing(false);
    setIsPressed(false);
  };

  pressTagRef.current = pressTag;
  releaseTagRef.current = releaseTag;
  cancelTagRef.current = cancelTag;

  useEffect(() => {
    registerTagActivation(shortcut, {
      press: () => {
        pressTagRef.current();
      },
      release: () => {
        releaseTagRef.current();
      },
      cancel: () => {
        cancelTagRef.current();
      },
    });

    return () => {
      registerTagActivation(shortcut, null);
    };
  }, [registerTagActivation, shortcut]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isTagActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    pressTag();
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isTagActivationKey(event.key)) {
      return;
    }

    releaseTag();
  };

  const handleBlur = () => {
    setIsPressed(false);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some pointers cannot be captured. The pressed state still applies.
      }
    }

    setIsPressed(true);
  };

  const releasePointerPress = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsPressed(false);
  };

  const className = variant === "control" ? "ava-event ava-event--control" : "ava-event";

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-keyshortcuts={shortcut}
      data-flash={isFlashing ? "" : undefined}
      data-pressed={isPressed ? "" : undefined}
      onClick={flashTag}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePointerPress}
      onPointerCancel={releasePointerPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      <span className="ava-event-label">{label}</span>
      {variant === "control" ? (
        <kbd className="ava-event-key ava-event-key--space" aria-hidden="true" />
      ) : (
        <kbd className="ava-event-key" aria-hidden="true">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

function renderLinkedPhrase(text: string, label: string, href: string, openInNewTab = false): ReactNode {
  const labelIndex = text.indexOf(label);
  if (labelIndex < 0) {
    return text;
  }

  return (
    <>
      {text.slice(0, labelIndex)}
      <a
        className="ava-inline-link"
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
      {text.slice(labelIndex + label.length)}
    </>
  );
}

const Ava = () => {
  const { language, t } = useLanguage();
  const tagSectionRef = useRef<HTMLElement>(null);
  const tagKeyboardRef = useRef<HTMLDivElement>(null);
  const tagActivationsRef = useRef<Map<string, TagShortcutActivation>>(new Map());
  const registerTagActivation = useCallback((shortcut: string, activation: TagShortcutActivation | null) => {
    const normalizedShortcut = shortcut.toUpperCase();
    if (activation) {
      tagActivationsRef.current.set(normalizedShortcut, activation);
      return;
    }

    tagActivationsRef.current.delete(normalizedShortcut);
  }, []);

  useTagKeyboardShortcuts(tagSectionRef, tagActivationsRef);
  usePhantomTagHint(tagKeyboardRef, tagActivationsRef);

  useEffect(() => {
    const previousTitle = document.title;
    const previousBackground = document.body.style.backgroundColor;
    document.title = t("ava.document.title");
    document.body.style.backgroundColor = "#070708";

    return () => {
      document.title = previousTitle;
      document.body.style.backgroundColor = previousBackground;
    };
  }, [t]);

  return (
    <div className="ava-root">
      <header className="ava-chrome">
        <nav className="ava-chrome-crumb" aria-label={t("ava.document.title")}>
          <Link to="/" className="ava-site-link">
            {t("ava.nav.home")}
          </Link>
          <span className="ava-chrome-sep" aria-hidden="true">/</span>
          <span className="ava-wordmark">AVA</span>
        </nav>
        <div className="ava-chrome-end">
          <LanguageToggle />
        </div>
      </header>

      <main>
        <section className="ava-hero">
          <div className="ava-hero-copy">
            <p className="ava-kicker">{t("ava.hero.kicker")}</p>
            <h1>{t("ava.headline")}</h1>
            <p className="ava-lede">{t("ava.lede")}</p>
            <p className="ava-hero-body">{t("ava.hero.body")}</p>
            <div className="ava-actions">
              <a className="ava-text-link" href="#como-funciona">
                {t("ava.cta.how")}
              </a>
              <a className="ava-cta" href="#ava-interest">
                {t("ava.cta.access")}
              </a>
            </div>
            <p className="ava-meta">{t("ava.hero.meta")}</p>
          </div>
          <AvaStage caption={t("ava.stage.caption")} />
        </section>

        <AvaTimeline language={language} />

        <AvaSession />

        <section className="ava-section" id="un-partido">
          <div className="ava-shell">
            <div className="ava-section-head ava-concat-head">
              <p className="ava-kicker">{t("ava.concat.kicker")}</p>
              <h2>{t("ava.concat.headline")}</h2>
              <p className="ava-section-body">{t("ava.concat.lede")}</p>
            </div>
            <div className="ava-concat">
              <div className="ava-concat-copy">
                <p className="ava-section-body">{t("ava.concat.body")}</p>
                <p className="ava-concat-diff">{t("ava.concat.differentiator")}</p>
              </div>
              <AvaConcatGraphic />
            </div>
            <div className="ava-concat-steps">
              {CONCAT_STEPS.map((step) => (
                <article className="ava-concat-step" key={step.index}>
                  <p className="ava-kicker">{step.index}</p>
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.bodyKey)}</p>
                </article>
              ))}
            </div>
            <p className="ava-concat-honesty">{t("ava.concat.honesty")}</p>
          </div>
        </section>

        <section className="ava-section">
          <div className="ava-shell">
            <div className="ava-section-head">
              <p className="ava-kicker">{t("ava.modes.kicker")}</p>
              <h2>{t("ava.modes.headline")}</h2>
            </div>
            <AvaModes />
          </div>
        </section>

        <section className="ava-section" id="como-funciona">
          <div className="ava-shell">
            <div className="ava-section-head ava-clip-head">
              <p className="ava-kicker">{t("ava.clip.kicker")}</p>
              <h2>{t("ava.clip.title")}</h2>
              <p className="ava-section-body">{t("ava.clip.body")}</p>
              <p className="ava-section-body">{renderWithCarpetaLinks(t("ava.clip.example"))}</p>
            </div>
            <AvaClipBar />
            <div className="ava-export-block">
              <p className="ava-kicker">{t("ava.how.kicker")}</p>
              <h3>{t("ava.how.title")}</h3>
              <p className="ava-section-body">{t("ava.how.body")}</p>
              <p className="ava-section-body">{t("ava.how.formats")}</p>
              <AvaExportJobs />
            </div>
            <div className="ava-export-result">
              <p className="ava-kicker">{t("ava.export.result.kicker")}</p>
              <h3>{t("ava.export.result.title")}</h3>
              <p className="ava-section-body">{t("ava.export.result.body")}</p>
              <AvaModeShot media={resolveAvaModeMedia(AVA_EXPORTED_CLIP)} role="full" />
            </div>
          </div>
        </section>

        <section className="ava-section" ref={tagSectionRef}>
          <div className="ava-shell">
            <div className="ava-section-head">
              <p className="ava-kicker">{t("ava.events.kicker")}</p>
              <h2>{t("ava.events.headline")}</h2>
              <p className="ava-section-body">{t("ava.events.body")}</p>
            </div>
            <div className="ava-tag-keyboard" ref={tagKeyboardRef}>
              <div className="ava-events">
                {TAG_KEYBOARD_ROWS.map((row) => (
                  <div className="ava-event-row" data-row={row.id} key={row.id}>
                    {row.slots.map((slot) => {
                      if (slot.kind === "gap") {
                        return <div className="ava-event-spacer" aria-hidden="true" key={slot.id} />;
                      }

                      const event = tagEventForShortcut(slot.shortcut);
                      return (
                        <KeyboardTagCell
                          key={event.token}
                          label={language === "es" ? event.es : event.en}
                          shortcut={event.shortcut}
                          registerTagActivation={registerTagActivation}
                        />
                      );
                    })}
                  </div>
                ))}
                <div className="ava-event-row" data-row="space">
                  <KeyboardTagCell
                    variant="control"
                    label={t("ava.events.playPause")}
                    shortcut="Space"
                    registerTagActivation={registerTagActivation}
                  />
                </div>
              </div>
            </div>
          </div>
          <ul className="ava-follow">
            {AVA_FOLLOW_UPS.map((item) => (
              <li key={item.id}>
                <b>{language === "es" ? item.es : item.en}</b>
                {t(item.bodyKey)}
              </li>
            ))}
          </ul>
        </section>

        <section className="ava-section">
          <div className="ava-shell ava-origin">
            <p className="ava-kicker">{t("ava.origin.kicker")}</p>
            <div>
              <h2>{t("ava.origin.headline")}</h2>
              <p className="ava-section-body">{renderWithCarpetaLinks(t("ava.origin.body"))}</p>
            </div>
          </div>
        </section>

        <section className="ava-section" id="ava-interest">
          <div className="ava-shell ava-access">
            <p className="ava-kicker">{t("ava.access.kicker")}</p>
            <div>
              <p className="ava-section-body">
                {renderLinkedPhrase(t("ava.access.body"), AVA_INTEREST_EMAIL, `mailto:${AVA_INTEREST_EMAIL}`)}
              </p>
              <AvaInterestForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="ava-footer">
        <span>{t("ava.footer.line")}</span>
        <Link to="/">{t("ava.nav.home")}</Link>
      </footer>
    </div>
  );
};

export default Ava;
