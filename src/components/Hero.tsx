import { Github, Linkedin, Mail, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      {/* Toggles */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Notes */}
          <p className="text-xs text-muted-foreground mb-8 animate-fade-up leading-relaxed">
            {t("hero.note1")}
            <br />
            {t("hero.note2")}
          </p>

          {/* Location */}
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 animate-fade-up">
            {t("hero.location")}
          </p>

          {/* Name */}
          <h1 className="mb-4 animate-fade-up-delay-1">
            camila escudero
          </h1>

          {/* Tagline */}
          <p className="text-base text-muted-foreground mb-4 animate-fade-up-delay-2 leading-relaxed max-w-lg">
            {t("hero.tagline")}
          </p>
          <p className="text-sm text-muted-foreground/70 mb-10 animate-fade-up-delay-2">
            {t("hero.subtagline")}
          </p>

          {/* Links row */}
          <div className="flex items-center gap-5 animate-fade-up-delay-3 mb-6">
            <Link
              to="/cv"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("hero.cta.cv")}
            </Link>
            <a
              href="#contact"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("hero.cta.contact")}
            </a>
            <a
              href="#work"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("hero.cta.work")}
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 animate-fade-up-delay-4">
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
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
