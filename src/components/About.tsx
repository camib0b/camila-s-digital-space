import { Card } from "@/components/ui/card";
import { Code2, Users, Zap } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "Web Developer",
      description: "Focused on building clean, performant interfaces with modern frameworks.",
    },
    {
      icon: Users,
      title: "Team Player",
      description: "3 summer internships, collaborating with diverse teams on real projects.",
    },
    {
      icon: Zap,
      title: "Always Building",
      description: "Constantly seeking side projects to learn, experiment, and grow.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-primary text-sm tracking-widest uppercase mb-4 font-body">
              About
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              Tech, but very human.
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              I'm a 26-year-old engineering student in Santiago, one year away from graduation. 
              When I'm not coding, I'm on the field—playing and coaching field hockey. 
              I genuinely enjoy working, and I approach every project with the same energy 
              I bring to the game: focused, collaborative, and always pushing to improve.
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="bg-card border-border p-6 hover:border-primary/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
