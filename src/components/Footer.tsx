import { useState } from "react";
import { Github, Linkedin, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "@/content/social";
import EmailContactControl from "./EmailContactControl";
import SocialLinkControl from "./SocialLinkControl";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeContactItem, setActiveContactItem] = useState<string | null>(null);

  const toggleContactItem = (itemId: string) => {
    setActiveContactItem((currentItemId) => (currentItemId === itemId ? null : itemId));
  };

  return (
    <footer className="py-10 border-t border-border bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Camila Escudero
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/cv"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="CV"
            >
              <FileText className="w-4 h-4" />
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
