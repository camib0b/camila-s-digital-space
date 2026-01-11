import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-card">
      <div className="container px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-primary text-sm tracking-widest uppercase mb-4 font-body">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              Let's connect.
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-xl mx-auto">
              Looking for internships, freelance projects, or just want to chat about 
              web development? I'd love to hear from you.
            </p>
          </div>

          {/* Contact card */}
          <Card className="bg-background border-border p-8 md:p-12 max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">Location</p>
                  <p className="text-foreground font-body">Santiago, Chile</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">Email</p>
                  <a 
                    href="mailto:camilaescuderob@gmail.com" 
                    className="text-foreground font-body link-underline hover:text-primary transition-colors duration-300"
                  >
                    camilaescuderob@gmail.com
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm mb-4 font-body">
                  Prefer email? Send me a message directly.
                </p>
                <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                  <a href="mailto:camilaescuderob@gmail.com">
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
