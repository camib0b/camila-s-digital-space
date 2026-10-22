import { useState, type MouseEvent } from "react";
import CurtainReveal from "@/components/CurtainReveal";
import DestinationHintLink from "@/components/DestinationHintLink";
import PdfOverlay from "@/components/PdfOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import { hockeyRoles, type HockeyRole } from "@/content/hockey";

const coachingCvPdfUrl = "/cv/Camila_Escudero_Coaching_CV.pdf";
const viewportNarrowerThan768Pixels = "(max-width: 767px)";

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
  const [coachingCvOverlayOpen, setCoachingCvOverlayOpen] = useState(false);

  const openCoachingCvOverlay = (event: MouseEvent<HTMLAnchorElement>) => {
    const modifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (modifiedClick) {
      return;
    }

    const narrowViewport = window.matchMedia(viewportNarrowerThan768Pixels).matches;
    if (narrowViewport) {
      return;
    }

    event.preventDefault();
    setCoachingCvOverlayOpen(true);
  };

  const closeCoachingCvOverlay = () => {
    setCoachingCvOverlayOpen(false);
  };

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
            href={coachingCvPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openCoachingCvOverlay}
            className="link-underline mt-8 inline-block font-medium text-foreground"
          >
            {t("hockey.coachingCv")}
          </a>
        </div>
      </div>

      {coachingCvOverlayOpen ? (
        <PdfOverlay
          pdfUrl={coachingCvPdfUrl}
          title={t("hockey.coachingCv")}
          closeLabel={t("hockey.coachingCv.close")}
          downloadLabel={t("hockey.coachingCv.download")}
          onClose={closeCoachingCvOverlay}
        />
      ) : null}
    </section>
  );
};

export default Hockey;
