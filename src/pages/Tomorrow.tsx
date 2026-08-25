import { Calendar, Clock, MapPin, Moon, Sun, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

type Block = {
  time: string;
  title: string;
  detail?: string;
  location?: string;
  kind: "routine" | "work" | "class" | "sport" | "transit" | "note";
};

const morningBlocks: Block[] = [
  {
    time: "06:15",
    title: "Alarm · wake up",
    detail: "400–500 ml water right away. Soft start — no rush.",
    kind: "routine",
  },
  {
    time: "06:15 – 06:45",
    title: "Morning routine",
    detail: "Bathroom, face, light stretch. Clothes ready the night before.",
    kind: "routine",
  },
  {
    time: "06:45 – 07:15",
    title: "Breakfast + prep",
    detail: "Protein-forward breakfast. Pack bag for uni + any WFH notes.",
    kind: "routine",
  },
  {
    time: "07:15 – 07:30",
    title: "Buffer · settle in",
    detail: "Open laptop, clear desk, start work environment.",
    kind: "routine",
  },
  {
    time: "07:30 – 09:30",
    title: "Work from home",
    detail: "Focused block before classes.",
    location: "Av Vitacura 4747, Vitacura",
    kind: "work",
  },
  {
    time: "09:30 – 09:55",
    title: "Wrap WFH · leave for uni",
    detail: "Close laptop, grab bag, head out. Aim to leave by ~09:55.",
    kind: "transit",
  },
  {
    time: "09:55 – 11:00",
    title: "Commute to campus",
    detail: "~55–60 min public transport from doorstep to classroom.",
    location: "Ingeniería UC, Macul",
    kind: "transit",
  },
];

const dayBlocks: Block[] = [
  {
    time: "11:00 – 17:20",
    title: "Clases",
    detail: "11:00 BDD · 12:20 Innovación · 14:50 ETI",
    location: "Ingeniería UC, Benito Rebolledo 1872–1976, Macul",
    kind: "class",
  },
  {
    time: "17:00 – 19:00",
    title: "Sub-12 grupo azul",
    detail: "Hockey training — overlaps end of classes; plan exit accordingly.",
    location: "Chile Hockey · Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa",
    kind: "sport",
  },
];

const nightBefore = [
  "Lay out clothes for WFH + uni + hockey bag if needed",
  "Pack uni backpack (laptop, chargers, notes)",
  "Prep breakfast items / water bottle in fridge",
  "Set alarm for 06:15 (and a backup +10 min)",
  "Charge phone + laptop",
  "Lights out aiming for ~22:30–23:00 for 7.5–8 h sleep",
];

const kindStyles: Record<
  Block["kind"],
  { border: string; badge: string; label: string }
> = {
  routine: {
    border: "border-l-sky-500/70",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    label: "Routine",
  },
  work: {
    border: "border-l-amber-500/70",
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
    label: "Work",
  },
  class: {
    border: "border-l-violet-500/70",
    badge: "bg-violet-500/10 text-violet-800 dark:text-violet-300",
    label: "Class",
  },
  sport: {
    border: "border-l-emerald-500/70",
    badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
    label: "Hockey",
  },
  transit: {
    border: "border-l-slate-400/70",
    badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    label: "Transit",
  },
  note: {
    border: "border-l-muted-foreground/40",
    badge: "bg-muted text-muted-foreground",
    label: "Note",
  },
};

function TimelineItem({ block }: { block: Block }) {
  const style = kindStyles[block.kind];
  return (
    <li
      className={`relative pl-4 border-l-2 ${style.border} py-3 first:pt-0 last:pb-0`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="text-xs font-medium tabular-nums text-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          {block.time}
        </span>
        <span
          className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${style.badge}`}
        >
          {style.label}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground">{block.title}</p>
      {block.detail && (
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {block.detail}
        </p>
      )}
      {block.location && (
        <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{block.location}</span>
        </p>
      )}
    </li>
  );
}

const Tomorrow = () => {
  const { t, language } = useLanguage();

  const dateLabel =
    language === "es"
      ? "Miércoles 26 de agosto de 2026"
      : "Wednesday, 26 August 2026";

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={t("tomorrow.back")}
        stickyClassName="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm"
        containerClassName="container px-6 py-3 flex items-center justify-between max-w-3xl mx-auto"
      />

      <div className="container px-6 py-10 max-w-3xl mx-auto">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {t("tomorrow.label")}
          </p>
          <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-2">
            {t("tomorrow.title")}
          </h1>
          <p className="text-sm text-muted-foreground mb-1">{dateLabel}</p>
          <p className="text-sm text-muted-foreground max-w-xl">
            {t("tomorrow.subtitle")}
          </p>
        </header>

        <div className="mb-10 rounded-lg border border-border bg-card px-4 py-3 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("tomorrow.tip")}
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Sun className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              {t("tomorrow.morning")}
            </h2>
          </div>
          <ul className="space-y-0">
            {morningBlocks.map((b) => (
              <TimelineItem key={b.time + b.title} block={b} />
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-4 h-4 text-violet-500" />
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              {t("tomorrow.calendar")}
            </h2>
          </div>
          <ul className="space-y-0">
            {dayBlocks.map((b) => (
              <TimelineItem key={b.time + b.title} block={b} />
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Moon className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              {t("tomorrow.nightBefore")}
            </h2>
          </div>
          <ul className="space-y-2">
            {nightBefore.map((item) => (
              <li
                key={item}
                className="text-sm text-muted-foreground flex gap-2 leading-relaxed"
              >
                <span className="text-foreground/40 select-none">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[11px] text-muted-foreground/70 border-t border-border pt-6">
          Snapshot from Google Calendar · generated for camilaescudero.cl/tomorrow
        </p>
      </div>
    </main>
  );
};

export default Tomorrow;
