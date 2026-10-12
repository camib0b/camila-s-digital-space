import type { JevVerdict } from "./types";

const JEV_URL = "https://api.typesafe.ai/v1/systemone";

export interface JevClient {
  evaluateChange(params: {
    posting: string;
    baseCv: string;
    tailoredCv: string;
    changeDescription: string;
  }): Promise<{ verdict: JevVerdict; overstatementScore: number }>;
}

type ChoiceAnswer = {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
};

type ScoreAnswer = {
  type: "score";
  score: number;
};

type SystemOneResponse = {
  answers: Record<string, ChoiceAnswer | ScoreAnswer>;
};

export function createJevClient(apiKey: string): JevClient {
  return {
    async evaluateChange({ posting, baseCv, tailoredCv, changeDescription }) {
      const state = {
        posting: posting.slice(0, 8000),
        base_cv: baseCv.slice(0, 8000),
        tailored_cv: tailoredCv.slice(0, 8000),
        change: changeDescription.slice(0, 2000),
      };
      const body = {
        state,
        model: "jev-latest",
        questions: {
          verdict: {
            type: "choice",
            instructions:
              "For this single CV change relative to the base CV and job posting, does the change help alignment, stay neutral, or hurt accuracy/fit?",
            criteria: {
              helps: "Improves truthful alignment with posting requirements.",
              neutral: "No meaningful improvement or minor reword only.",
              hurts: "Overstates, misrepresents, or reduces accuracy.",
            },
          },
          overstatement: {
            type: "score",
            instructions: "Rate overstatement risk of the change (0 = none, 2 = high).",
            criteria: ["No overstatement", "Some inflation risk", "High overstatement risk"],
          },
        },
      };

      const response = await fetch(JEV_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`jev_error:${response.status}:${text.slice(0, 200)}`);
      }
      const payload = (await response.json()) as SystemOneResponse;
      const verdictAnswer = payload.answers.verdict as ChoiceAnswer;
      const scoreAnswer = payload.answers.overstatement as ScoreAnswer;
      const verdict = (verdictAnswer.choice as JevVerdict) ?? "neutral";
      const overstatementScore = typeof scoreAnswer.score === "number" ? scoreAnswer.score : 1;
      return { verdict, overstatementScore };
    },
  };
}

export function majorityVerdict(verdicts: JevVerdict[]): JevVerdict {
  const counts: Record<JevVerdict, number> = { helps: 0, neutral: 0, hurts: 0 };
  for (const verdict of verdicts) {
    counts[verdict] += 1;
  }
  if (counts.helps >= counts.neutral && counts.helps >= counts.hurts) {
    return "helps";
  }
  if (counts.hurts >= counts.neutral) {
    return "hurts";
  }
  return "neutral";
}

export async function evaluateChangeWithMajority(
  client: JevClient,
  params: {
    posting: string;
    baseCv: string;
    tailoredCv: string;
    changeDescription: string;
  },
  runs = 3,
): Promise<{ verdicts: JevVerdict[]; majority: JevVerdict; overstatementScores: number[] }> {
  const verdicts: JevVerdict[] = [];
  const overstatementScores: number[] = [];
  for (let index = 0; index < runs; index += 1) {
    const result = await client.evaluateChange(params);
    verdicts.push(result.verdict);
    overstatementScores.push(result.overstatementScore);
  }
  return {
    verdicts,
    majority: majorityVerdict(verdicts),
    overstatementScores,
  };
}
