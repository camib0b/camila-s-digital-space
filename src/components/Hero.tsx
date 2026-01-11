import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Twitter } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-glow animate-pulse-soft" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 px-6 md:px-8">

      <span className="text-muted-foreground">Web dev is so much more than front end.</span>

        <div className="max-w-3xl mx-auto text-center">
          {/* Greeting */}
          <p className="text-muted-foreground text-sm md:text-base tracking-widest uppercase mb-6 animate-fade-up font-body">
            Santiago, Chile
          </p>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium mb-6 animate-fade-up-delay-1">
            <span className="text-foreground">Camila</span>{" "}
            <span className="text-gradient">Escudero</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-secondary-foreground font-light mb-8 animate-fade-up-delay-2 font-body leading-relaxed">
            One year to graduation. Crafting thoughtful web experiences.            
            <br className="hidden md:block" />
            <span className="text-muted-foreground">Realize that everything connects to everything else.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up-delay-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#work">See My Work</a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 animate-fade-up-delay-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/camilaescudero/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/ca1000u" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Twitter/X"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="mailto:camilaescuderob@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a 
        href="#about" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 animate-float"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};

export default Hero;
