import Hero from "@/components/Hero";
import About from "@/components/About";
import Dashboard from "@/components/Dashboard";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import PersonalProjects from "@/components/PersonalProjects";
import Books from "@/components/Books";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hockey from "@/components/Hockey";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Experience />
      <PersonalProjects />
      <Hockey />
      <Dashboard />
      <Skills />
      <Books />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
