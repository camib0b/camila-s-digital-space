import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import PersonalProjects, { SmallTools } from "@/components/PersonalProjects";
import Hockey from "@/components/Hockey";
import PatternedBackground from "@/components/PatternedBackground";

const Home = () => {
  return (
    <main className="min-h-screen bg-background relative">
      <PatternedBackground />
      <div className="relative z-10">
        <Hero />
        <div id="after-hero">
          <PersonalProjects />
          <SmallTools />
          <Experience />
          <Hockey />
        </div>
      </div>
    </main>
  );
};

export default Home;
