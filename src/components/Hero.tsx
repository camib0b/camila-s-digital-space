import { useState } from "react";
import { Github, Linkedin, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIAL_LINKS } from "@/content/social";
import EmailContactControl from "./EmailContactControl";
import SocialLinkControl from "./SocialLinkControl";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const { t } = useLanguage();
  const [activeContactItem, setActiveContactItem] = useState<string | null>(null);

  const toggleContactItem = (itemId: string) => {
    setActiveContactItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 animate-fade-up">
            {t("hero.location")}
          </p>

          <h1 className="mb-4 animate-fade-up-delay-1">camila escudero</h1>

          <p className="text-base text-muted-foreground mb-10 animate-fade-up-delay-2 leading-relaxed max-w-lg">
            {t("hero.subtagline")}
          </p>

          <div className="flex items-center gap-5 animate-fade-up-delay-3 mb-6">
            <Link
              to="/cv"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("hero.cta.cv")}
            </Link>
            <a
              href="#after-hero"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("hero.cta.work")}
            </a>
          </div>

          <div className="flex items-center gap-4 animate-fade-up-delay-4">
            <SocialLinkControl
              href={SOCIAL_LINKS.github}
              label="GitHub"
              Icon={Github}
              isExpanded={activeContactItem === "github"}
              onClose={() => setActiveContactItem(null)}
              onToggle={() => toggleContactItem("github")}
            />
            <SocialLinkControl
              href={SOCIAL_LINKS.linkedin}
              label="LinkedIn"
              Icon={Linkedin}
              isExpanded={activeContactItem === "linkedin"}
              onClose={() => setActiveContactItem(null)}
              onToggle={() => toggleContactItem("linkedin")}
            />
            <SocialLinkControl
              href={SOCIAL_LINKS.x}
              label="Twitter/X"
              Icon={Twitter}
              isExpanded={activeContactItem === "x"}
              onClose={() => setActiveContactItem(null)}
              onToggle={() => toggleContactItem("x")}
            />
            <EmailContactControl
              isExpanded={activeContactItem === "email"}
              onClose={() => setActiveContactItem(null)}
              onToggle={() => toggleContactItem("email")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
