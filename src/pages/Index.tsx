import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import PersonalProjects from "@/components/PersonalProjects";
import Books from "@/components/Books";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hockey from "@/components/Hockey";
import HowIWork from "@/components/HowIWork";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <div id="after-hero">
        <PersonalProjects />
        <Experience />
        <Hockey />
        <HowIWork />
        <Books />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
