import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { hockeyRoles, type HockeyRole } from "@/content/hockey";

const HockeyRoleTitle = ({ role }: { role: HockeyRole }) => {
  const { t } = useLanguage();
  const title = t(role.roleKey);

  if (role.href === undefined || role.destinationKey === undefined) {
    return <p className="font-medium text-foreground">{title}</p>;
  }

  const destination = t(role.destinationKey);
  const accessibleName = `${title}. ${destination}. ${t("social.openInNewTab")}`;

  return (
    <a
      href={role.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleName}
      className="hockey-role-link group inline-flex min-w-0 max-w-full flex-wrap items-baseline font-medium text-foreground"
    >
      <span className="link-underline transition-colors duration-200 group-hover:text-muted-foreground group-focus-visible:text-muted-foreground">
        {title}
      </span>
      <ExternalLink
        className="ml-1.5 h-3.5 w-3.5 shrink-0 self-center text-muted-foreground transition-colors duration-200 group-hover:text-teal-500 group-focus-visible:text-teal-500 dark:group-hover:text-teal-300 dark:group-focus-visible:text-teal-300"
        aria-hidden="true"
      />
      <span className="hockey-destination-hint text-xs font-normal text-muted-foreground" aria-hidden="true">
        {destination}
      </span>
    </a>
  );
};

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
                <HockeyRoleTitle role={role} />
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
