import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  laterBlocks,
  mapsUrl,
  morningBlocks,
  type Lang,
  type ScheduleBlock,
  durationLabel,
} from "@/content/tomorrow";

const copy = {
  back: { es: "Volver", en: "Back" },
  kicker: { es: "miércoles 26 de agosto", en: "wednesday 26 august" },
  title: { es: "Mañana", en: "Morning" },
  subtitle: {
    es: "Agenda completa hasta el mediodía, leída de tu calendario.",
    en: "Full morning laid out from your calendar.",
  },
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" },
  blocksLabel: { es: "Bloques", en: "Blocks" },
  committed: { es: "En calendario", en: "On the calendar" },
  transit: { es: "Traslado", en: "Transit" },
  later: { es: "Más tarde", en: "Later today" },
  laterBody: {
    es: "El bloque de clases en campus sigue hasta las 17:20. Después, hockey.",
    en: "The campus class block continues until 17:20. Then hockey.",
  },
  source: {
    es: "Desde Google Calendar · 25 ago 2026",
    en: "From Google Calendar · 25 Aug 2026",
  },
  map: { es: "Mapa", en: "Map" },
} as const;

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function BlockCard({
  block,
  lang,
}: {
  block: ScheduleBlock;
  lang: Lang;
}) {
  const isTransit = block.kind === "transit";
  const height = Math.max(88, Math.round(minutesBetween(block.start, block.end) * 0.85));

  return (
    <article className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr] sm:gap-6">
      <div className="pt-1 text-right">
        <p className="font-mono text-[13px] font-medium tabular-nums text-foreground">{block.start}</p>
        <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">{block.end}</p>
      </div>

      <div className="relative min-w-0 pb-6 pl-5">
        <span className="absolute top-2 bottom-2 left-0 w-px bg-border" aria-hidden="true" />
        <span
          className={`absolute top-2.5 left-[-3.5px] w-2 h-2 rounded-full ${
            isTransit ? "border border-border bg-background" : "bg-foreground"
          }`}
          aria-hidden="true"
        />

        <div
          className={`rounded-lg border px-4 py-4 ${
            isTransit ? "border-dashed border-border bg-transparent" : "border-border bg-card"
          }`}
          style={{ minHeight: height }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {block.tag ? (
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {block.tag[lang]}
              </span>
            ) : null}
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {durationLabel(block.start, block.end, lang)}
            </span>
          </div>
          <h2 className="mt-2 text-[17px] font-medium tracking-tight text-foreground">{block.title[lang]}</h2>
          {block.detail ? (
            <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{block.detail[lang]}</p>
          ) : null}
          {block.location ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex min-w-0 items-start gap-1.5">
                {isTransit ? (
                  <Clock className="mt-0.5 w-3 h-3 shrink-0" />
                ) : (
                  <MapPin className="mt-0.5 w-3 h-3 shrink-0" />
                )}
                <span className="leading-snug">{block.location[lang]}</span>
              </span>
              {block.mapQuery ? (
                <a
                  href={mapsUrl(block.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  {copy.map[lang]}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const Tomorrow = () => {
  const { language } = useLanguage();
  const lang: Lang = language === "es" ? "es" : "en";

  const committedMinutes = morningBlocks
    .filter((block) => block.kind === "event")
    .reduce((sum, block) => sum + minutesBetween(block.start, block.end), 0);

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={copy.back[lang]}
        stickyClassName="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        containerClassName="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between"
      />

      <section className="pt-32 pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 animate-fade-up">
            {copy.kicker[lang]}
          </p>
          <h1 className="mb-4 animate-fade-up-delay-1">{copy.title[lang]}</h1>
          <p className="text-base text-muted-foreground mb-2 animate-fade-up-delay-2 leading-relaxed max-w-xl">
            {copy.subtitle[lang]}
          </p>
          <p className="text-xs text-muted-foreground animate-fade-up-delay-3">{copy.timezone[lang]}</p>

          <dl className="grid grid-cols-3 gap-3 border-y border-border py-5 mt-10 animate-fade-up-delay-3">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {copy.blocksLabel[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {morningBlocks.filter((block) => block.kind === "event").length}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {copy.committed[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {`${Math.floor(committedMinutes / 60)}h ${committedMinutes % 60}m`}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {copy.transit[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">1h 30m</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          {morningBlocks.map((block) => (
            <BlockCard key={block.id} block={block} lang={lang} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border border-border bg-card px-5 py-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{copy.later[lang]}</p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{copy.laterBody[lang]}</p>
            <ul className="mt-5 space-y-4">
              {laterBlocks.map((block) => (
                <li
                  key={block.id}
                  className="flex items-start justify-between gap-4 border-t border-border pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] tabular-nums text-muted-foreground">
                      {block.start}–{block.end}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{block.title[lang]}</p>
                    {block.location ? (
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">{block.location[lang]}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {block.tag?.[lang]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{copy.source[lang]}</p>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            camila escudero
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Tomorrow;
