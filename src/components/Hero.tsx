import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDown, Github, Linkedin, Mail, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const { t } = useLanguage();
  
  // Image banner state
  const bannerImages = [
    "/banner/camila-nomad-japan.png",
    "/banner/camila-nomad-sweden.png",
    "banner/camila-chalk.png",
    "/banner/camila-hockey-1.jpeg",
    "/banner/camila-hockey-2.jpeg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBannerClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Language and Theme Toggles */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-glow animate-pulse-soft" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 px-6 md:px-8">

      <span className="text-muted-foreground">{t("hero.note")}</span>

        <div className="max-w-3xl mx-auto text-center">
          {/* Greeting */}
          <p className="text-muted-foreground text-sm md:text-base tracking-widest uppercase mb-6 animate-fade-up font-body">
            {t("hero.location")}
          </p>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium mb-6 animate-fade-up-delay-1">
            <span className="text-foreground">Camila</span>{" "}
            <span className="text-gradient">Escudero</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-secondary-foreground font-light mb-8 animate-fade-up-delay-2 font-body leading-relaxed">
            {t("hero.tagline")}            
            <br className="hidden md:block" />
            <span className="text-muted-foreground">{t("hero.subtagline")}</span>
          </p>

          {/* Image Banner */}
          <div 
            className="w-full max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden cursor-pointer transition-opacity duration-300 hover:opacity-90 animate-fade-up-delay-2"
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
            <img
              src={bannerImages[currentImageIndex]}
              alt={currentImageIndex === 0 ? "Camila in Japan" : "Camila in Sweden"}
              className="w-full h-48 md:h-64 object-cover"
            />
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

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 animate-fade-up-delay-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/camilaescudero/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/ca1000u" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Twitter/X"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="mailto:camilaescuderob@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a 
        href="#about" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 animate-float"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};

export default Hero;
