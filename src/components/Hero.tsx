import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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

          <div className="mb-10 animate-fade-up-delay-1 space-y-2 max-w-lg">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("hero.acfin")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("hero.ava.before")}
              <Link to="/ava" className="text-inherit no-underline hover:underline">
                AVA
              </Link>
              {t("hero.ava.after")}
            </p>
          </div>

          <div className="flex items-center gap-4 animate-fade-up-delay-2">
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
