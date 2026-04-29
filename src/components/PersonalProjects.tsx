import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const PersonalProjects = () => {
  const { t } = useLanguage();

  const items = [
    { text: t("personalProjects.item1") },
    { text: t("personalProjects.item2"), href: "/ava" },
    { text: t("personalProjects.item3") },
  ];

  return (
    <section id="personal-projects" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          <ul className="space-y-6">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                <span>{item.text}</span>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="ml-3 inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted/60 transition-colors duration-200"
                  >
                    View project
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
