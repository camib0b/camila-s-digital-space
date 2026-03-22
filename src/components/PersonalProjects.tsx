import { useLanguage } from "@/contexts/LanguageContext";

const PersonalProjects = () => {
  const { t } = useLanguage();

  const items = [
    t("personalProjects.item1"),
    t("personalProjects.item2"),
    t("personalProjects.item3"),
  ];

  return (
    <section id="personal-projects" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          <ul className="space-y-6">
            {items.map((text, index) => (
              <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
