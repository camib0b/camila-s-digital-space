import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const Skills = () => {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t("skills.frontend"),
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML/CSS"],
    },
    {
      title: t("skills.backend"),
      skills: ["Node.js", "Python", "PostgreSQL", "REST APIs"],
    },
    {
      title: t("skills.tools"),
      skills: ["Git", "Figma", "VS Code", "Vercel"],
    },
  ];

  return (
    <section id="work" className="py-24 md:py-32 bg-card">
      <div className="container px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-primary text-sm tracking-widest uppercase mb-4 font-body">
              {t("skills.label")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              {t("skills.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              {t("skills.description")}
            </p>
          </div>

          {/* Skills grid */}
          <div className="space-y-10">
            {skillCategories.map((category, index) => (
              <div key={index}>
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4 font-body">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-body bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300 cursor-default"
                    >
                      {skill}
                    </Badge>
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
