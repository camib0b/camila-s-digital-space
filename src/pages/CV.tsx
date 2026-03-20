import { ArrowLeft, Mail, MapPin, Linkedin, Github, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

const CV = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: t("cv.project1.title"),
      type: t("cv.project1.type"),
      description: t("cv.project1.description"),
      impact: t("cv.project1.impact"),
      technologies: ["React", "TypeScript", "FFmpeg", "Node.js", "PostgreSQL"],
    },
    {
      title: t("cv.project2.title"),
      type: t("cv.project2.type"),
      description: t("cv.project2.description"),
      impact: t("cv.project2.impact"),
      technologies: ["Python", "Linear Programming", "Gurobi", "Pandas"],
    },
  ];

  const workExperience = [
    {
      title: t("cv.job1.title"),
      company: t("cv.job1.company"),
      period: t("cv.job1.period"),
      bullets: [t("cv.job1.bullet1"), t("cv.job1.bullet2"), t("cv.job1.bullet3")],
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
      title: t("cv.job2.title"),
      company: t("cv.job2.company"),
      period: t("cv.job2.period"),
      bullets: [t("cv.job2.bullet1"), t("cv.job2.bullet2"), t("cv.job2.bullet3")],
      technologies: ["Vue.js", "Tailwind CSS", "PostgreSQL"],
    },
    {
      title: t("cv.job3.title"),
      company: t("cv.job3.company"),
      period: t("cv.job3.period"),
      bullets: [t("cv.job3.bullet1"), t("cv.job3.bullet2"), t("cv.job3.bullet3")],
      technologies: ["React", "Styled Components", "Jest", "Figma"],
    },
  ];

  const education = [
    {
      degree: t("cv.education.degree"),
      institution: t("cv.education.institution"),
      period: t("cv.education.period"),
      details: t("cv.education.details"),
      coursework: t("cv.education.coursework"),
    },
  ];

  const skills = {
    languages: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
    frameworks: ["React", "Node.js", "Vue.js", "Tailwind CSS"],
    tools: ["Git", "PostgreSQL", "Figma", "REST APIs", "Vite"],
  };

  const leadership = [
    {
      role: t("cv.leadership1.role"),
      organization: t("cv.leadership1.organization"),
      description: t("cv.leadership1.description"),
    },
    {
      role: t("cv.leadership2.role"),
      organization: t("cv.leadership2.organization"),
      description: t("cv.leadership2.description"),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="container px-6 py-3 flex items-center justify-between max-w-3xl mx-auto">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("cv.back")}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>
      </header>

      <div className="container px-6 py-12 max-w-3xl mx-auto">

        {/* Header + Summary */}
        <section className="flex flex-col md:flex-row gap-6 items-start mb-12">
          <div className="w-24 h-24 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
            <span className="text-xs text-muted-foreground">{t("cv.photo")}</span>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-foreground mb-1">Camila Escudero</h1>
            <p className="text-sm text-muted-foreground mb-3">{t("cv.role")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">{t("cv.summary")}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Santiago, Chile</span>
              <a href="mailto:hello@camilaescudero.com" className="flex items-center gap-1 hover:text-foreground transition-colors"><Mail className="w-3 h-3" />hello@camilaescudero.com</a>
              <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors"><Linkedin className="w-3 h-3" />LinkedIn</a>
              <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors"><Github className="w-3 h-3" />GitHub</a>
            </div>
          </div>
        </section>

        <div className="border-b border-border mb-10" />

        {/* Selected Projects */}
        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">{t("cv.selectedProjects")}</h2>
          <div className="space-y-6">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground text-sm">{project.title}</p>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">{project.type}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-1">{project.description}</p>
                <p className="text-sm text-foreground/70 mb-2">↳ {project.impact}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience */}
        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">{t("cv.workExperience")}</h2>
          <div className="space-y-6">
            {workExperience.map((job, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <div>
                    <p className="font-medium text-foreground text-sm">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">{job.period}</span>
                </div>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-0.5 mt-2 mb-2">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-foreground/40 mt-1">·</span>{b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {job.technologies.map((tech, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">{t("cv.education")}</h2>
          {education.map((edu, i) => (
            <div key={i}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                <div>
                  <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono shrink-0">{edu.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{edu.details}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Coursework: {edu.coursework}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">{t("cv.skills")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: t("cv.languages"), items: skills.languages },
              { label: t("cv.frameworks"), items: skills.frameworks },
              { label: t("cv.tools"), items: skills.tools },
            ].map((group, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((s, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership & Athletics */}
        <section>
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">{t("cv.leadershipAthletics")}</h2>
          <div className="space-y-3">
            {leadership.map((item, i) => (
              <div key={i}>
                <p className="text-sm">
                  <span className="font-medium text-foreground">{item.role}</span>
                  <span className="text-muted-foreground"> — {item.organization}</span>
                </p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border py-6">
        <div className="container px-6 text-center text-xs text-muted-foreground max-w-3xl mx-auto">
          Camila Escudero · Santiago, Chile · {t("cv.availableFor")}
        </div>
      </footer>
    </main>
  );
};

export default CV;
