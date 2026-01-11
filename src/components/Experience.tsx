import { Card } from "@/components/ui/card";
import { Briefcase, Calendar } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "Finapsys (health tech B2B SaaS)",
      period: "Summer 2024",
      description: "Built reactive frontend views and components in TypeScript + Vue.js.",
    },
    {
      title: "Asset Management Intern",
      company: "A3 Property Investments",
      period: "Summer 2023",
      description: "Developed responsive landing pages and contributed to a React component library.",
    },
    {
      title: "Retail & E-commerce Intern",
      company: "Visionary",
      period: "Sabatical 2021",
      description: "Owned e-commerce/PDV/distributor operations across Shopify + BSale; built sales & inventory forecasts and tracked core KPIs (conversion rate, avg. ticket, margin) to coordinate pricing, promos, and replenishment.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-primary text-sm tracking-widest uppercase mb-4 font-body">
              Experience
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              Where I've learned.
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              Three summer internships that shaped how I think about code, collaboration, and building products.
            </p>
          </div>

          {/* Experience timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 -translate-y-1 mt-2" />

                  {/* Content */}
                  <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <Card className="bg-card border-border p-6 hover:border-primary/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3 font-body">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                      <h3 className="text-lg font-display font-medium text-foreground mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-primary text-sm mb-3 font-body flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {exp.company}
                      </p>
                      <p className="text-muted-foreground text-sm font-body leading-relaxed">
                        {exp.description}
                      </p>
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
