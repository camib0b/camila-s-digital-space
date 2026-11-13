import { useState } from "react";
import { FileText, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIAL_LINKS } from "@/content/social";
import EmailContactControl from "./EmailContactControl";
import SocialLinkControl from "./SocialLinkControl";
import "./Footer.css";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activeContactItem, setActiveContactItem] = useState<string | null>(null);

  const toggleContactItem = (itemId: string) => {
    setActiveContactItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  return (
    <footer className="site-footer border-t border-border bg-background text-foreground">
      <div className="container px-6 py-14 md:px-8 md:py-20">
        <div className="site-footer-inner mx-auto flex max-w-2xl flex-col gap-8">
          <p id="site-footer-name" className="site-footer-wordmark">
            camila escudero
          </p>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <nav aria-labelledby="site-footer-name" className="flex max-w-full flex-wrap items-center gap-2">
              <Link
                to="/cv/growth"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center px-1 text-sm text-foreground"
              >
                <span className="site-footer-cv inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("footer.cv")}
                </span>
              </Link>

              <ul className="site-footer-contacts">
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

            <p className="text-sm text-muted-foreground">
              © {currentYear} · {t("hero.location")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
