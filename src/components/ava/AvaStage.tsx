import { AVA_EVENTS, AVA_TIMELINE_MARKS, MATCH_MINUTES } from "@/content/ava";

import type { Language } from "@/i18n/types";

function eventLabel(token: (typeof AVA_EVENTS)[number]["token"], language: Language) {
  const event = AVA_EVENTS.find((item) => item.token === token);
  if (!event) {
    return token;
  }
  return language === "es" ? event.es : event.en;
}

const AvaStage = ({ caption }: { caption: string }) => {
  return (
    <div className="ava-stage" aria-hidden="false">
      <div className="ava-scan" aria-hidden="true" />
      <div className="ava-stage-field">
        <svg viewBox="0 0 914 550" role="img" aria-label={caption}>
          <title>{caption}</title>
          <rect className="ava-pitch-fill" x="28" y="28" width="858" height="494" />
          <rect className="ava-pitch-line is-strong" x="28" y="28" width="858" height="494" />
          <line className="ava-pitch-line is-strong" x1="457" y1="28" x2="457" y2="522" />
          <circle className="ava-pitch-line" cx="457" cy="275" r="91" />
          <circle className="ava-pitch-mark" cx="457" cy="275" r="3.2" />
          <line className="ava-pitch-line" x1="228" y1="28" x2="228" y2="522" />
          <line className="ava-pitch-line" x1="686" y1="28" x2="686" y2="522" />
          <path
            className="ava-pitch-line is-strong"
            d="M28 128 A147 147 0 0 1 28 422"
          />
          <path
            className="ava-pitch-line is-strong"
            d="M886 128 A147 147 0 0 0 886 422"
          />
          <line className="ava-pitch-line" x1="28" y1="201" x2="18" y2="201" />
          <line className="ava-pitch-line" x1="28" y1="349" x2="18" y2="349" />
          <line className="ava-pitch-line" x1="886" y1="201" x2="896" y2="201" />
          <line className="ava-pitch-line" x1="886" y1="349" x2="896" y2="349" />
          <rect className="ava-pitch-line is-strong" x="14" y="201" width="14" height="148" />
          <rect className="ava-pitch-line is-strong" x="886" y="201" width="14" height="148" />
          <circle className="ava-pitch-mark" cx="92" cy="275" r="3" />
          <circle className="ava-pitch-mark" cx="822" cy="275" r="3" />
        </svg>
      </div>
      <div className="ava-stage-caption">
        <span>{caption}</span>
        <span>70:00</span>
      </div>
    </div>
  );
};

export const AvaTimeline = ({ language }: { language: Language }) => {
  return (
    <div className="ava-timeline">
      <div className="ava-timeline-rail">
        <div className="ava-timeline-line" />
        <div className="ava-playhead" aria-hidden="true" />
        {AVA_TIMELINE_MARKS.map((mark) => (
          <div
            key={`${mark.token}-${mark.at}`}
            className="ava-mark"
            style={{ left: `${(mark.at / MATCH_MINUTES) * 100}%` }}
          >
            <span />
            <span>{eventLabel(mark.token, language)}</span>
          </div>
        ))}
      </div>
      <div className="ava-timeline-ends">
        <span>00:00</span>
        <span>35:00</span>
        <span>70:00</span>
      </div>
    </div>
  );
};

export default AvaStage;
