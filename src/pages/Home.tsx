import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import PersonalProjects, { SmallTools } from "@/components/PersonalProjects";
import Books from "@/components/Books";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hockey from "@/components/Hockey";
import HowIWork from "@/components/HowIWork";
import PatternedBackground from "@/components/PatternedBackground";

const Home = () => {
  return (
    <main className="min-h-screen bg-background relative">
      <PatternedBackground />
      <div className="relative z-10">
        <Hero />
        <div id="after-hero">
          <PersonalProjects />
          <Experience />
          <SmallTools />
          <Hockey />
          <HowIWork />
          <Books />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Home;
