import { Github, Linkedin, Mail, Twitter, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

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
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/camilaescudero/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://x.com/ca1000u" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="Twitter/X">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="mailto:camilaescuderob@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
