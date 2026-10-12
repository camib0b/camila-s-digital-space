export type CvLanguage = "en" | "es";

export type JevVerdict = "helps" | "neutral" | "hurts";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface TailoredBullet {
  sourceId: string;
  text: string;
}

export interface TailoredRoleSection {
  roleId: string;
  bullets: TailoredBullet[];
}

export interface TailoredProjectSection {
  projectId: string;
  bullets: TailoredBullet[];
}

export interface TailoredCvDocument {
  language: CvLanguage;
  headline: string;
  summaryBulletSourceIds: string[];
  skillIds: string[];
  roles: TailoredRoleSection[];
  projects: TailoredProjectSection[];
  includeEducation: boolean;
  includeAthletics: boolean;
  includeLanguages: boolean;
}

export interface PostingAnalysis {
  language: CvLanguage;
  seniority: string;
  yearsRequired: number | null;
  degreeRequired: boolean;
  mustHaveSkills: string[];
  keywords: string[];
  companyName: string | null;
  roleTitle: string | null;
}

export interface CvChangeLogEntry {
  id: string;
  section: string;
  description: string;
  before: string | null;
  after: string;
  verdicts: JevVerdict[];
  majorityVerdict: JevVerdict;
  overstatementScores: number[];
  maxOverstatementRisk: number;
  kept: boolean;
  highRisk: boolean;
}

export interface CvWarning {
  code: string;
  message: string;
}

export interface CvGenerateResult {
  ok: true;
  postingAnalysis: PostingAnalysis;
  baseCv: RenderedCv;
  tailoredCv: RenderedCv;
  document: TailoredCvDocument;
  changeLog: CvChangeLogEntry[];
  warnings: CvWarning[];
}

export interface RenderedCv {
  language: CvLanguage;
  plainText: string;
  sections: Record<string, string[]>;
}

export interface CvFactsFile {
  rules: {
    mandatorySkillLabels: string[];
    acfinFraming: string;
    internshipsMarkedInDates: boolean;
    visionaryFraming: string;
    forbiddenProductNamesOnBusinessCvs: string[];
    maxBulletWords: number;
  };
  contact: {
    name: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
  };
  headline: LocalizedText;
  summaryBullets: Array<{ id: string; en: string; es: string }>;
  education: {
    degree: LocalizedText;
    institution: LocalizedText;
    period: LocalizedText;
    details: LocalizedText;
    graduationMonth: string;
    coursework: LocalizedText;
  };
  languages: { pair: LocalizedText; note: LocalizedText };
  skills: Array<{ id: string; label: string }>;
  roles: Array<{
    id: string;
    title: LocalizedText;
    company: LocalizedText;
    period: LocalizedText;
    isInternship: boolean;
    gapYear?: boolean;
    technologies: string[];
    priority: number;
    bullets: Array<{ id: string; priority: number; en: string; es: string }>;
  }>;
  projects: Array<{
    id: string;
    title: LocalizedText;
    type: LocalizedText;
    priority: number;
    bullets: Array<{ id: string; priority: number; en: string; es: string }>;
    technologies: string[];
  }>;
  athletics: Array<{
    id: string;
    role: LocalizedText;
    organization: LocalizedText;
    description?: LocalizedText;
  }>;
  todos?: string[];
}
