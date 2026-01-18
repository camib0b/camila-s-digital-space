import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, MapPin, Linkedin, Github, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const CV = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: t("cv.project1.title"),
      type: t("cv.project1.type"),
      description: t("cv.project1.description"),
      impact: t("cv.project1.impact"),
      technologies: ["React", "TypeScript", "FFmpeg", "Node.js", "PostgreSQL"],
      link: "#"
    },
    {
      title: t("cv.project2.title"),
      type: t("cv.project2.type"),
      description: t("cv.project2.description"),
      impact: t("cv.project2.impact"),
      technologies: ["Python", "Linear Programming", "Gurobi", "Pandas", "Data Visualization"],
      link: "#"
    }
  ];

  const workExperience = [
    {
      title: t("cv.job1.title"),
      company: t("cv.job1.company"),
      period: t("cv.job1.period"),
      bullets: [
        t("cv.job1.bullet1"),
        t("cv.job1.bullet2"),
        t("cv.job1.bullet3")
      ],
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"]
    },
    {
      title: t("cv.job2.title"),
      company: t("cv.job2.company"),
      period: t("cv.job2.period"),
      bullets: [
        t("cv.job2.bullet1"),
        t("cv.job2.bullet2"),
        t("cv.job2.bullet3")
      ],
      technologies: ["Vue.js", "Tailwind CSS", "PostgreSQL"]
    },
    {
      title: t("cv.job3.title"),
      company: t("cv.job3.company"),
      period: t("cv.job3.period"),
      bullets: [
        t("cv.job3.bullet1"),
        t("cv.job3.bullet2"),
        t("cv.job3.bullet3")
      ],
      technologies: ["React", "Styled Components", "Jest", "Figma"]
    }
  ];

  const education = [
    {
      degree: t("cv.education.degree"),
      institution: t("cv.education.institution"),
      period: t("cv.education.period"),
      details: t("cv.education.details"),
      coursework: t("cv.education.coursework")
    }
  ];

  const skills = {
    languages: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
    frameworks: ["React", "Node.js", "Vue.js", "Tailwind CSS"],
    tools: ["Git", "PostgreSQL", "Figma", "REST APIs", "Vite"]
  };

  const leadership = [
    {
      role: t("cv.leadership1.role"),
      organization: t("cv.leadership1.organization"),
      description: t("cv.leadership1.description")
    },
    {
      role: t("cv.leadership2.role"),
      organization: t("cv.leadership2.organization"),
      description: t("cv.leadership2.description")
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              {t("cv.back")}
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              {t("cv.downloadPdf")}
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-6 py-12 md:py-16 max-w-4xl mx-auto">
        
        {/* 1. Header + Summary */}
        <section className="flex flex-col md:flex-row gap-8 items-start mb-10">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <span className="text-muted-foreground text-xs text-center px-3">{t("cv.photo")}</span>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-1">
              Camila Escudero
            </h1>
            <p className="text-lg text-primary font-medium mb-3">
              {t("cv.role")}
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-5 max-w-2xl">
              {t("cv.summary")}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Santiago, Chile
              </span>
              <a href="mailto:hello@camilaescudero.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5" />
                hello@camilaescudero.com
              </a>
              <a href="#" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </section>

        <Separator className="mb-10 bg-border/40" />

        {/* 2. Selected Projects */}
        <section className="mb-10">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-primary"></span>
            {t("cv.selectedProjects")}
          </h2>

          <div className="grid gap-4">
            {projects.map((project, index) => (
              <Card key={index} className="bg-card/50 border-border/40 hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-2">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      <a href={project.link} className="text-muted-foreground hover:text-primary transition-colors mt-0.5">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded w-fit">
                      {project.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    {project.description}
                  </p>
                  <p className="text-sm text-primary/80 mb-3 font-medium">
                    ↳ {project.impact}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Work Experience */}
        <section className="mb-10">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-primary"></span>
            {t("cv.workExperience")}
          </h2>

          <div className="space-y-4">
            {workExperience.map((job, index) => (
              <Card key={index} className="bg-card/50 border-border/40">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-primary text-sm">{job.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{job.period}</span>
                  </div>
                  <ul className="text-muted-foreground text-sm leading-relaxed mb-3 space-y-1">
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {job.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. Education */}
        <section className="mb-10">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-primary"></span>
            {t("cv.education")}
          </h2>

          {education.map((edu, index) => (
            <Card key={index} className="bg-card/50 border-border/40">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-primary text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{edu.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{edu.details}</p>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  Relevant Coursework: {edu.coursework}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* 5. Skills */}
        <section className="mb-10">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-primary"></span>
            {t("cv.skills")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{t("cv.languages")}</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.languages.map((skill, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 rounded-md bg-muted/30 text-muted-foreground border border-border/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{t("cv.frameworks")}</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.frameworks.map((skill, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 rounded-md bg-muted/30 text-muted-foreground border border-border/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{t("cv.tools")}</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.tools.map((skill, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 rounded-md bg-muted/30 text-muted-foreground border border-border/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Leadership & Athletics */}
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-primary"></span>
            {t("cv.leadershipAthletics")}
          </h2>

          <div className="grid gap-3">
            {leadership.map((item, index) => (
              <Card key={index} className="bg-card/50 border-border/40">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                    <h3 className="font-semibold text-foreground text-sm">{item.role}</h3>
                    <span className="text-primary text-sm">— {item.organization}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-10">
        <div className="container px-6 text-center text-xs text-muted-foreground">
          <p>Camila Escudero · Santiago, Chile · {t("cv.availableFor")}</p>
        </div>
      </footer>
    </main>
  );
};

export default CV;
