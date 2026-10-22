import CurtainReveal from "@/components/CurtainReveal";
import DestinationHintLink from "@/components/DestinationHintLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { hockeyRoles, type HockeyRole } from "@/content/hockey";

const HockeyRoleTitle = ({ role }: { role: HockeyRole }) => {
  const { t } = useLanguage();
  const title = t(role.roleKey);

  if (role.href === undefined || role.destinationKey === undefined) {
    return <p className="font-medium text-foreground">{title}</p>;
  }

  return (
    <DestinationHintLink
      title={title}
      destination={t(role.destinationKey)}
      target={{ kind: "external", url: role.href }}
    />
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

          <CurtainReveal className="space-y-6">
            {hockeyRoles.map((role) => (
              <div
                key={role.id}
                className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
              >
                <HockeyRoleTitle role={role} />
                <p className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {t(role.periodKey)}
                </p>
              </div>
            ))}
          </CurtainReveal>

          <a
            href="/cv/Camila_Escudero_Coaching_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-8 inline-block font-medium text-foreground"
          >
            {t("hockey.coachingCv")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hockey;
