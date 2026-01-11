import Hero from "@/components/Hero";
import About from "@/components/About";
import Dashboard from "@/components/Dashboard";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Books from "@/components/Books";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
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
