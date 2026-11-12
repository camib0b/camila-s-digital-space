import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollCenteredIndex } from "@/hooks/useScrollCenteredIndex";
import type { TranslationKey } from "@/i18n/types";

const capabilityItems = [
  "ava.session.flow.import",
  "ava.session.flow.tag",
  "ava.session.flow.analyze",
  "ava.session.flow.present",
  "ava.session.flow.export",
] as const satisfies readonly TranslationKey[];

const AvaCapabilityList = () => {
  const { t } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);
  const activeIndex = useScrollCenteredIndex(listRef, capabilityItems.length);
  const reducedMotion = activeIndex === null;

  return (
    <section className="ava-section" aria-labelledby="ava-capabilities-heading">
      <div className="ava-shell">
        <h2 className="ava-kicker" id="ava-capabilities-heading">
          {t("ava.session.kicker")}
        </h2>
        <ol
          ref={listRef}
          className="ava-capability-list"
          data-reduced={reducedMotion ? "true" : "false"}
        >
          {capabilityItems.map((itemKey, index) => {
            const isActive = reducedMotion || index === activeIndex;
            return (
              <li key={itemKey} data-scroll-center-item="" data-active={isActive ? "true" : "false"}>
                {t(itemKey)}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default AvaCapabilityList;
