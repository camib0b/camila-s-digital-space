import { Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
            {t("contact.label")}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {t("contact.description")}
          </p>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              Santiago, Chile
            </p>
            <a
              href="mailto:camilaescuderob@gmail.com"
              className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              <Mail className="w-3.5 h-3.5" />
              camilaescuderob@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
