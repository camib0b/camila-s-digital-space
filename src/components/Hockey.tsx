import { Link } from "react-router-dom";
import CurtainReveal from "@/components/CurtainReveal";
import DestinationHintLink from "@/components/DestinationHintLink";
import SectionEyebrow from "@/components/SectionEyebrow";
import { useLanguage } from "@/contexts/LanguageContext";
import { hockeyRoles, type HockeyRole } from "@/content/hockey";

const coachingCvLinkClassName =
  "link-underline mt-8 inline-flex min-h-11 items-center font-medium text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

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
          <SectionEyebrow as="h2" className="mb-8" enterOnView>
            {t("hockey.label")}
          </SectionEyebrow>

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

          <Link to="/cv/hockey" className={coachingCvLinkClassName}>
            {t("hockey.coachingCv")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hockey;
