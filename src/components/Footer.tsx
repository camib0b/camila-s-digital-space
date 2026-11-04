import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { FileText, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIAL_LINKS } from "@/content/social";
import andesFooterAvif from "@/assets/footer/andes-footer.avif";
import andesFooterJpg from "@/assets/footer/andes-footer.jpg";
import andesFooterWebp from "@/assets/footer/andes-footer.webp";
import EmailContactControl from "./EmailContactControl";
import SocialLinkControl from "./SocialLinkControl";
import "./Footer.css";

const CURTAIN_PROGRESS_VARIABLE = "--footer-curtain-progress";

function supportsFooterViewTimeline(): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  return (
    CSS.supports("animation-timeline: view()") &&
    CSS.supports("view-timeline-name: --site-footer-reveal")
  );
}

function useFooterCurtainFallback(
  stageRef: RefObject<HTMLDivElement>,
  curtainRef: RefObject<HTMLDivElement>,
) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const curtain = curtainRef.current;
    if (stage === null || curtain === null) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let isNearStage = true;
    let observer: IntersectionObserver | null = null;

    const writeProgress = () => {
      animationFrame = 0;
      const stageBounds = stage.getBoundingClientRect();
      const frame = stage.querySelector<HTMLElement>(".site-footer-frame");
      const frameHeight = frame === null ? window.innerHeight : frame.getBoundingClientRect().height;
      const scrollSpan = stageBounds.height - frameHeight;
      const progress = scrollSpan <= 0 ? 1 : Math.min(1, Math.max(0, -stageBounds.top / scrollSpan));
      curtain.style.setProperty(CURTAIN_PROGRESS_VARIABLE, progress.toFixed(4));
    };

    const requestProgress = () => {
      if (!isNearStage || animationFrame !== 0) {
        return;
      }
      animationFrame = window.requestAnimationFrame(writeProgress);
    };

    const stopScriptedMotion = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", requestProgress);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      curtain.style.removeProperty(CURTAIN_PROGRESS_VARIABLE);
      if (stage.dataset.curtainDriver === "script") {
        delete stage.dataset.curtainDriver;
      }
    };

    const syncDriver = () => {
      stopScriptedMotion();
      if (reducedMotionQuery.matches || supportsFooterViewTimeline()) {
        return;
      }

      stage.dataset.curtainDriver = "script";
      isNearStage = true;
      observer = new IntersectionObserver(
        (entries) => {
          isNearStage = entries.some((entry) => entry.isIntersecting);
          if (isNearStage) {
            requestProgress();
          }
        },
        { rootMargin: "25% 0px" },
      );
      observer.observe(stage);
      window.addEventListener("scroll", requestProgress, { passive: true });
      window.addEventListener("resize", requestProgress);
      writeProgress();
    };

    syncDriver();
    reducedMotionQuery.addEventListener("change", syncDriver);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncDriver);
      stopScriptedMotion();
    };
  }, [curtainRef, stageRef]);
}

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activeContactItem, setActiveContactItem] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useFooterCurtainFallback(stageRef, curtainRef);

  const toggleContactItem = (itemId: string) => {
    setActiveContactItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  return (
    <footer className="site-footer relative z-10 bg-background text-foreground">
      <div className="border-t border-border">
        <div className="container px-6 py-10 md:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
            <div className="min-w-0">
              <p id="site-footer-name" className="text-sm font-medium text-foreground">
                Camila Escudero
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("footer.builtWith")}</p>
            </div>

            <nav aria-labelledby="site-footer-name" className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    to="/cv"
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-foreground link-underline transition-colors duration-hover ease-hover hover:text-muted-foreground"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("footer.cv")}
                  </Link>
                </li>
              </ul>

              <ul className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
                <li>
                  <SocialLinkControl
                    href={SOCIAL_LINKS.github}
                    label="GitHub"
                    Icon={Github}
                    isExpanded={activeContactItem === "github"}
                    onClose={() => setActiveContactItem(null)}
                    onToggle={() => toggleContactItem("github")}
                  />
                </li>
                <li>
                  <SocialLinkControl
                    href={SOCIAL_LINKS.linkedin}
                    label="LinkedIn"
                    Icon={Linkedin}
                    isExpanded={activeContactItem === "linkedin"}
                    onClose={() => setActiveContactItem(null)}
                    onToggle={() => toggleContactItem("linkedin")}
                  />
                </li>
                <li>
                  <SocialLinkControl
                    href={SOCIAL_LINKS.x}
                    label="Twitter/X"
                    Icon={Twitter}
                    isExpanded={activeContactItem === "x"}
                    onClose={() => setActiveContactItem(null)}
                    onToggle={() => toggleContactItem("x")}
                  />
                </li>
                <li>
                  <EmailContactControl
                    isExpanded={activeContactItem === "email"}
                    onClose={() => setActiveContactItem(null)}
                    onToggle={() => toggleContactItem("email")}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="site-footer-stage" ref={stageRef}>
        <div className="site-footer-frame">
          <div className="site-footer-wordmark-slot">
            <p className="site-footer-wordmark" aria-hidden="true">
              camila escudero
            </p>
          </div>

          <div className="site-footer-curtain" ref={curtainRef}>
            <picture>
              <source srcSet={andesFooterAvif} type="image/avif" />
              <source srcSet={andesFooterWebp} type="image/webp" />
              <img
                src={andesFooterJpg}
                alt=""
                width={1280}
                height={720}
                decoding="async"
                loading="lazy"
              />
            </picture>
          </div>
          <p className="site-footer-legal">
            © {currentYear} Camila Escudero · {t("hero.location")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
