import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, MapPin, Linkedin, Github, Download } from "lucide-react";
import { Link } from "react-router-dom";

const CV = () => {
  const workExperience = [
    {
      title: "Software Engineering Intern",
      company: "Tech Company",
      period: "Summer 2024",
      description: "Developed full-stack features for internal tools. Collaborated with cross-functional teams on API design and frontend implementation.",
      technologies: ["React", "TypeScript", "Node.js"]
    },
    {
      title: "Web Development Intern",
      company: "Digital Agency",
      period: "Summer 2023",
      description: "Built responsive web applications for clients. Focused on performance optimization and accessibility standards.",
      technologies: ["Vue.js", "Tailwind CSS", "PostgreSQL"]
    },
    {
      title: "Frontend Developer Intern",
      company: "Startup",
      period: "Summer 2022",
      description: "Created user interfaces for a SaaS product. Implemented design systems and component libraries.",
      technologies: ["React", "Styled Components", "Figma"]
    }
  ];

  const interests = [
    {
      category: "Sports",
      items: ["Field Hockey Player", "Field Hockey Coach", "Team Leadership"]
    },
    {
      category: "Technology",
      items: ["Web Development", "UI/UX Design", "Open Source"]
    },
    {
      category: "Creative",
      items: ["Side Projects", "Electronic Music", "Reading"]
    }
  ];

  const education = [
    {
      degree: "Engineering Degree",
      institution: "University",
      period: "2020 – 2026 (Expected)",
      focus: "Web Development & Software Engineering",
      status: "1 year remaining"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="container px-6 py-12 md:py-16 max-w-4xl mx-auto">
        {/* Profile Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start mb-12">
          {/* Profile Picture Placeholder */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center flex-shrink-0">
            <span className="text-muted-foreground text-xs text-center px-4">Profile Photo</span>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-2">
              Camila Escudero
            </h1>
            <p className="text-lg text-primary font-medium mb-4">
              Engineering Student & Web Developer
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Building thoughtful web experiences with a focus on clean code and user-centered design. 
              Field hockey player and coach. Always working on something.
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Santiago, Chile
              </span>
              <a href="mailto:hello@camilaescudero.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                hello@camilaescudero.com
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </section>

        <Separator className="mb-12 bg-border/40" />

        {/* Work Experience - Priority 1 */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            Work Experience
          </h2>

          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <Card key={index} className="bg-card/50 border-border/40 hover:border-border/60 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-primary text-sm">{job.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{job.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Interests - Priority 2 */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            Interests & Activities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interests.map((interest, index) => (
              <Card key={index} className="bg-card/50 border-border/40">
                <CardContent className="p-5">
                  <h3 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">
                    {interest.category}
                  </h3>
                  <ul className="space-y-2">
                    {interest.items.map((item, i) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education - Priority 3 */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            Education
          </h2>

          {education.map((edu, index) => (
            <Card key={index} className="bg-card/50 border-border/40">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-primary text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">{edu.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Focus: {edu.focus}
                </p>
                <p className="text-muted-foreground/70 text-sm mt-1 italic">
                  {edu.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Skills Summary */}
        <section>
          <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            Technical Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "JavaScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Git", "Figma", "REST APIs", "HTML/CSS"].map((skill, i) => (
              <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-muted/30 text-muted-foreground border border-border/40 hover:border-primary/40 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container px-6 text-center text-sm text-muted-foreground">
          <p>Camila Escudero · Santiago, Chile</p>
        </div>
      </footer>
    </main>
  );
};

export default CV;
