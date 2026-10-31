import { useState } from "react";
import { Github, Linkedin, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIAL_LINKS } from "@/content/social";
import EmailContactControl from "./EmailContactControl";
import SocialLinkControl from "./SocialLinkControl";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activeContactItem, setActiveContactItem] = useState<string | null>(null);

  const toggleContactItem = (itemId: string) => {
    setActiveContactItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  return (
    <footer className="py-10 border-t border-border">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
            <p className="text-xs text-muted-foreground">{t("hero.location")}</p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Camila Escudero
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <Link
              to="/cv"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-hover ease-hover link-underline flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("hero.cta.cv")}
            </Link>
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
    </footer>
  );
};

export default Footer;
