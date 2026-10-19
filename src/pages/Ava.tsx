import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
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
import AvaProductShots from "@/components/ava/AvaProductShots";
import AvaStage, { AvaTimeline } from "@/components/ava/AvaStage";
import "@/components/ava/ava.css";
import "@/components/ava/ava-motion.css";
import { AVA_EVENTS, AVA_FOLLOW_UPS, AVA_INTEREST_EMAIL } from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";

const WORKFLOW_MODES = [
  { kicker: "01", titleKey: "ava.modes.tagging.title", bodyKey: "ava.modes.tagging.body" },
  { kicker: "02", titleKey: "ava.modes.analyzing.title", bodyKey: "ava.modes.analyzing.body" },
  { kicker: "03", titleKey: "ava.modes.presentation.title", bodyKey: "ava.modes.presentation.body" },
] as const;

const CONCAT_STEPS = [
  { index: "01", titleKey: "ava.concat.step1.title", bodyKey: "ava.concat.step1.body" },
  { index: "02", titleKey: "ava.concat.step2.title", bodyKey: "ava.concat.step2.body" },
  { index: "03", titleKey: "ava.concat.step3.title", bodyKey: "ava.concat.step3.body" },
] as const;

const TAG_FLASH_DURATION_MS = 150;
const TAG_SECTION_ROOT_MARGIN = "-8% 0px -8% 0px";

// ANSI letter rows: the home row sits 0.25 key right of Q, the bottom row 0.75.
const TAG_KEYBOARD_ROWS = [
  { id: "top", shortcuts: ["Q", "W", "E", "R"] },
  { id: "home", shortcuts: ["A", "S", "D", "F"] },
  { id: "bottom", shortcuts: ["Z", "X", "C", "V", "B", "N"] },
] as const satisfies readonly {
  id: "top" | "home" | "bottom";
  shortcuts: readonly (typeof AVA_EVENTS)[number]["shortcut"][];
}[];

const placedTagShortcuts = new Set<string>(TAG_KEYBOARD_ROWS.flatMap((row) => [...row.shortcuts]));

for (const event of AVA_EVENTS) {
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
};

type KeyboardTagCellProps = {
  label: string;
  shortcut: string;
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

        const shortcut = shortcutLetter(event);
        if (!shortcut || !activations.has(shortcut)) {
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

function KeyboardTagCell({ label, shortcut, registerTagActivation }: KeyboardTagCellProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTagRef = useRef<() => void>(() => {});
  const releaseTagRef = useRef<() => void>(() => {});

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

  pressTagRef.current = pressTag;
  releaseTagRef.current = releaseTag;

  useEffect(() => {
    registerTagActivation(shortcut, {
      press: () => {
        pressTagRef.current();
      },
      release: () => {
        releaseTagRef.current();
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

  return (
    <div
      className="ava-event"
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-keyshortcuts={shortcut}
      data-flash={isFlashing ? "" : undefined}
      data-pressed={isPressed ? "" : undefined}
      onClick={flashTag}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      <span className="ava-event-label">{label}</span>
      <kbd className="ava-event-key" aria-hidden="true">
        {shortcut}
      </kbd>
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
        <span className="ava-wordmark">AVA</span>
        <div className="ava-chrome-end">
          <LanguageToggle />
          <Link to="/" className="ava-site-link">
            {t("ava.nav.home")}
          </Link>
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
            <div className="ava-modes">
              {WORKFLOW_MODES.map((mode) => (
                <article className="ava-mode" key={mode.titleKey}>
                  <p className="ava-kicker">{mode.kicker}</p>
                  <h3>{t(mode.titleKey)}</h3>
                  <p>{t(mode.bodyKey)}</p>
                </article>
              ))}
            </div>
            <AvaProductShots />
          </div>
        </section>

        <section className="ava-section" id="como-funciona">
          <div className="ava-shell">
            <div className="ava-section-head">
              <p className="ava-kicker">{t("ava.how.kicker")}</p>
              <h2>{t("ava.how.title")}</h2>
              <p className="ava-section-body">{t("ava.how.body")}</p>
            </div>
            <AvaExportJobs />
            <div className="ava-clip">
              <p className="ava-kicker">{t("ava.clip.kicker")}</p>
              <p className="ava-section-body">{t("ava.clip.body")}</p>
              <p className="ava-section-body">{renderWithCarpetaLinks(t("ava.clip.example"))}</p>
              <AvaClipBar />
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
            <div className="ava-tag-keyboard">
              <div className="ava-events">
                {TAG_KEYBOARD_ROWS.map((row) => (
                  <div className="ava-event-row" data-row={row.id} key={row.id}>
                    {row.shortcuts.map((shortcut) => {
                      const event = tagEventForShortcut(shortcut);
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
