import { Github, Linkedin, Mail, Twitter, FileText, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { GRADUATION_DATE } from "@/content/graduation";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const { language, t } = useLanguage();

  const getMonthsUntilGraduation = (): number => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const graduationThisYear = new Date(
      currentYear,
      GRADUATION_DATE.monthIndex,
      GRADUATION_DATE.day
    );

    const targetYear = now > graduationThisYear ? currentYear + 1 : currentYear;
    const currentMonthIndex = now.getMonth();

    return (targetYear - currentYear) * 12 + (GRADUATION_DATE.monthIndex - currentMonthIndex);
  };

  const getHeroTagline = (): string => {
    const monthsRemaining = getMonthsUntilGraduation();

    if (language === "es") {
      return monthsRemaining === 1
        ? "Un mes para graduarme."
        : `${monthsRemaining} meses para graduarme.`;
    }

    return monthsRemaining === 1
      ? "One month until graduation."
      : `${monthsRemaining} months until graduation.`;
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

          <p className="text-base text-muted-foreground mb-4 animate-fade-up-delay-2 leading-relaxed max-w-lg">
            {getHeroTagline()}
          </p>
          <p className="text-sm text-muted-foreground/70 mb-10 animate-fade-up-delay-2">
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
            <Link
              to="/tomorrow"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              {t("hero.cta.tomorrow")}
            </Link>
            <a
              href="#skills"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("hero.cta.work")}
            </a>
          </div>

          <div className="flex items-center gap-4 animate-fade-up-delay-4">
            {[
              { href: "https://github.com", label: "GitHub", Icon: Github },
              {
                href: "https://www.linkedin.com/in/camilaescudero/",
                label: "LinkedIn",
                Icon: Linkedin,
              },
              { href: "https://x.com/camib0b", label: "Twitter/X", Icon: Twitter },
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
