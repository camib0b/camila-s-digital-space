import { useLanguage } from "@/contexts/LanguageContext";

const Skills = () => {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t("skills.frontend"),
      skills: ["Vue.js", "TypeScript", "Tailwind CSS", "Next.js", "HTML/CSS"],
    },
    {
      title: t("skills.backend"),
      skills: ["Node.js", "Python", "PostgreSQL", "REST APIs"],
    },
    {
      title: t("skills.tools"),
      skills: ["Git", "Graphite", "VS Code", "Vercel"],
    },
  ];

  return (
    <section id="work" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("skills.label")}
          </h2>

          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <div key={index}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  {category.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 text-sm text-muted-foreground border border-border rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
