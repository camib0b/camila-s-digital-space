import { useState } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL } from "@/content/contact";
import { SOCIAL_LINKS } from "@/content/social";
import EmailContactControl from "./EmailContactControl";
import GitHubContributions from "./GitHubContributions";
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
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto pt-5">
          <div className="relative isolate mb-4 w-fit max-w-full">
            <GitHubContributions />
            <h1 className="relative z-10 animate-fade-up">camila escudero</h1>
          </div>

          <div className="mb-10 max-w-lg animate-fade-up-delay-1 space-y-3">
            <p className="text-lg leading-relaxed text-foreground">{t("hero.headline")}</p>
            <p className="text-lg leading-relaxed text-muted-foreground">{t("hero.subline")}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-11 max-w-full cursor-pointer items-center text-base text-foreground link-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {t("hero.cta.hiring")}
            </a>
          </div>

          <div className="flex items-center gap-1 animate-fade-up-delay-2">
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
