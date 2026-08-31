import { AVA_EVENTS, AVA_TIMELINE_MARKS, MATCH_MINUTES } from "@/content/ava";

import type { Language } from "@/i18n/types";

const METRE = 10;
const PAD_X = 28;
const PAD_Y = 20;
const FIELD_LENGTH = 91.4 * METRE;
const FIELD_WIDTH = 55 * METRE;
const VIEW_WIDTH = FIELD_LENGTH + PAD_X * 2;
const VIEW_HEIGHT = FIELD_WIDTH + PAD_Y * 2;

const FIELD_LEFT = PAD_X;
const FIELD_TOP = PAD_Y;
const FIELD_RIGHT = FIELD_LEFT + FIELD_LENGTH;
const FIELD_BOTTOM = FIELD_TOP + FIELD_WIDTH;
const FIELD_CENTER_X = (FIELD_LEFT + FIELD_RIGHT) / 2;
const FIELD_CENTER_Y = (FIELD_TOP + FIELD_BOTTOM) / 2;

const GOAL_WIDTH = 3.66 * METRE;
const GOAL_DEPTH = 1.2 * METRE;
const GOAL_HALF = GOAL_WIDTH / 2;
const SHOOTING_CIRCLE_RADIUS = 14.63 * METRE;
const FIVE_METRE_RADIUS = SHOOTING_CIRCLE_RADIUS + 5 * METRE;
const PENALTY_SPOT = 6.4 * METRE;
const TWENTY_THREE_METRE = 22.9 * METRE;

function shootingCirclePath(goalX: number, intoField: 1 | -1, radius: number): string {
  const postTop = FIELD_CENTER_Y - GOAL_HALF;
  const postBottom = FIELD_CENTER_Y + GOAL_HALF;
  const backlineTop = postTop - radius;
  const backlineBottom = postBottom + radius;
  const capX = goalX + intoField * radius;
  const sweep = intoField === 1 ? 1 : 0;

  return [
    `M ${goalX} ${backlineTop}`,
    `A ${radius} ${radius} 0 0 ${sweep} ${capX} ${postTop}`,
    `L ${capX} ${postBottom}`,
    `A ${radius} ${radius} 0 0 ${sweep} ${goalX} ${backlineBottom}`,
  ].join(" ");
}

function eventLabel(token: (typeof AVA_EVENTS)[number]["token"], language: Language) {
  const event = AVA_EVENTS.find((item) => item.token === token);
  if (!event) {
    return token;
  }
  return language === "es" ? event.es : event.en;
}

const HockeyPitch = ({ caption }: { caption: string }) => {
  const leftGoalY = FIELD_CENTER_Y - GOAL_HALF;
  const rightTwentyThree = FIELD_RIGHT - TWENTY_THREE_METRE;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label={caption}
    >
      <title>{caption}</title>
      <rect
        className="ava-pitch-fill"
        x={FIELD_LEFT}
        y={FIELD_TOP}
        width={FIELD_LENGTH}
        height={FIELD_WIDTH}
      />
      <rect
        className="ava-pitch-line is-strong"
        x={FIELD_LEFT}
        y={FIELD_TOP}
        width={FIELD_LENGTH}
        height={FIELD_WIDTH}
      />
      <line
        className="ava-pitch-line is-strong"
        x1={FIELD_CENTER_X}
        y1={FIELD_TOP}
        x2={FIELD_CENTER_X}
        y2={FIELD_BOTTOM}
      />
      <circle className="ava-pitch-mark" cx={FIELD_CENTER_X} cy={FIELD_CENTER_Y} r="2.4" />
      <line
        className="ava-pitch-line"
        x1={FIELD_LEFT + TWENTY_THREE_METRE}
        y1={FIELD_TOP}
        x2={FIELD_LEFT + TWENTY_THREE_METRE}
        y2={FIELD_BOTTOM}
      />
      <line
        className="ava-pitch-line"
        x1={rightTwentyThree}
        y1={FIELD_TOP}
        x2={rightTwentyThree}
        y2={FIELD_BOTTOM}
      />
      <path
        className="ava-pitch-line is-dotted"
        d={shootingCirclePath(FIELD_LEFT, 1, FIVE_METRE_RADIUS)}
      />
      <path
        className="ava-pitch-line is-dotted"
        d={shootingCirclePath(FIELD_RIGHT, -1, FIVE_METRE_RADIUS)}
      />
      <path
        className="ava-pitch-line is-strong"
        d={shootingCirclePath(FIELD_LEFT, 1, SHOOTING_CIRCLE_RADIUS)}
      />
      <path
        className="ava-pitch-line is-strong"
        d={shootingCirclePath(FIELD_RIGHT, -1, SHOOTING_CIRCLE_RADIUS)}
      />
      <rect
        className="ava-pitch-line is-strong"
        x={FIELD_LEFT - GOAL_DEPTH}
        y={leftGoalY}
        width={GOAL_DEPTH}
        height={GOAL_WIDTH}
      />
      <rect
        className="ava-pitch-line is-strong"
        x={FIELD_RIGHT}
        y={leftGoalY}
        width={GOAL_DEPTH}
        height={GOAL_WIDTH}
      />
      <circle
        className="ava-pitch-mark"
        cx={FIELD_LEFT + PENALTY_SPOT}
        cy={FIELD_CENTER_Y}
        r="2.2"
      />
      <circle
        className="ava-pitch-mark"
        cx={FIELD_RIGHT - PENALTY_SPOT}
        cy={FIELD_CENTER_Y}
        r="2.2"
      />
    </svg>
  );
};

const AvaStage = ({ caption }: { caption: string }) => {
  return (
    <div className="ava-stage" aria-hidden="false">
      <div className="ava-scan" aria-hidden="true" />
      <div className="ava-stage-field">
        <HockeyPitch caption={caption} />
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
