import { useLanguage } from "@/contexts/LanguageContext";
import { hockeyRoles } from "@/content/hockey";

const Hockey = () => {
  const { t } = useLanguage();

  return (
    <section id="hockey" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("hockey.label")}
          </h2>

          <div className="space-y-6">
            {hockeyRoles.map((role) => (
              <div
                key={role.id}
                className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
              >
                <div>
                  <p className="font-medium text-foreground">{t(role.roleKey)}</p>
                  {role.organizationKey ? (
                    <p className="text-sm text-muted-foreground">
                      {t(role.organizationKey)}
                    </p>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground font-mono shrink-0">
                  {t(role.periodKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hockey;
