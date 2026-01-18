import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const { t } = useLanguage();

  const bannerImages = [
    "/banner/camila-nomad-japan.png",
    "/banner/camila-nomad-sweden.png",
    "/banner/camila-chalk.png",
    "/banner/camila-hockey-1.jpeg",
    "/banner/camila-hockey-2.jpeg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBannerClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Toggles */}
      <div
        className={[
          "absolute top-6 right-6 z-20",
          "flex items-center gap-1",
          "rounded-xl",
          "border border-border/60",
          "bg-card/40 backdrop-blur-sm",
          "shadow-elev-1",
          "p-1",
        ].join(" ")}
        role="group"
        aria-label="Preferences"
      >
        <ThemeToggle />
        <div className="mx-1 h-6 w-px bg-border/60" aria-hidden="true" />
        <LanguageToggle />
      </div>


      {/* Controlled ambient glow (less “template-y”) */}
      <div className="pointer-events-none absolute inset-0 bg-glow opacity-70" />

      {/* Specular top sheen (Apple-like) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] opacity-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0))]" />

      {/* Ultra-subtle grid (keep it, but make it nearly imperceptible) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container relative z-10 px-6 md:px-8">
        {/* Notes: make them small + tight, not prominent */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs md:text-sm text-muted-foreground/90 leading-6">
            {t("hero.note1")}
            <br />
            {t("hero.note2")}
            <br />
          </p>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          {/* Location / micro label */}
          <p className="text-xs md:text-sm tracking-[0.22em] uppercase text-muted-foreground/90 mb-6 animate-fade-up">
            {t("hero.location")}
          </p>

          {/* Name: Inter by default; serif only as garnish */}
          <h1 className="mb-6 animate-fade-up-delay-1">
            <span className="block text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[1.02] text-foreground">
              Camila{" "}
              <span className="text-gradient">Escudero</span>
            </span>
            {/* Optional: add serif only if you *want* it (comment out if not) */}
            {/* <span className="heading-display block text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02]">
              Camila <span className="text-gradient">Escudero</span>
            </span> */}
          </h1>

          {/* Tagline: foreground with controlled opacity (avoid secondary-foreground) */}
          <p className="text-base md:text-lg lg:text-xl text-foreground/88 font-normal mb-8 animate-fade-up-delay-2 leading-relaxed">
            {t("hero.tagline")}
            <br className="hidden md:block" />
            <span className="text-muted-foreground/90">{t("hero.subtagline")}</span>
          </p>

          {/* Banner: premium surface (hairline + shadow + subtle lift) */}
          <div
            className="w-full max-w-4xl mx-auto mb-10 rounded-lg overflow-hidden cursor-pointer
                       border border-border/60 shadow-elev-1
                       transition-all duration-300 hover:shadow-elev-2 hover:-translate-y-[1px]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleBannerClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleBannerClick();
              }
            }}
            aria-label="Click to view next image"
          >
            {/* Specular overlay on image (very subtle) */}
            <div className="relative">
              <img
                src={bannerImages[currentImageIndex]}
                alt="Camila banner"
                className="w-full h-52 md:h-72 object-cover"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(199,163,91,0.12),rgba(0,0,0,0)_60%)]" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up-delay-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#contact">{t("hero.cta.contact")}</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#work">{t("hero.cta.work")}</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/cv" className="gap-2">
                <FileText className="w-4 h-4" />
                {t("hero.cta.cv")}
              </Link>
            </Button>
          </div>

          {/* Social Links: hover to foreground or gold, not orange */}
          <div className="flex items-center justify-center gap-6 animate-fade-up-delay-4">
            {[
              { href: "https://github.com", label: "GitHub", Icon: Github },
              { href: "https://www.linkedin.com/in/camilaescudero/", label: "LinkedIn", Icon: Linkedin },
              { href: "https://x.com/ca1000u", label: "Twitter/X", Icon: Twitter },
              { href: "mailto:camilaescuderob@gmail.com", label: "Email", Icon: Mail },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-muted-foreground/90 hover:text-foreground transition-colors duration-300
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/90 hover:text-foreground transition-colors duration-300 animate-float"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};

export default Hero;
