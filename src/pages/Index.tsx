import Hero from "@/components/Hero";
import About from "@/components/About";
import Dashboard from "@/components/Dashboard";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Books from "@/components/Books";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hockey from "@/components/Hockey";

const Index = () => {
  return (
    <main className="min-h-screen">
      <p>Don't bother children when skateboarding</p>
      <Hero />
      <Hockey />
      <About />
      <Dashboard />
      <Skills />
      <Experience />
      <Books />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
