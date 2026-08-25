import { Clock, MapPin, Moon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  STATS,
  durationLabel,
  laterBlocks,
  mapsUrl,
  morningBlocks,
  nightBefore,
  pageCopy,
  type Lang,
  type ScheduleBlock,
} from "@/content/tomorrow";

function BlockCard({
  block,
  lang,
  last,
}: {
  block: ScheduleBlock;
  lang: Lang;
  last?: boolean;
}) {
  const transit = block.kind === "transit";
  const plan = block.kind === "plan";
  const dur = block.end ? durationLabel(block.start, block.end, lang) : "";

  return (
    <article className="grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr] sm:gap-6">
      <div className="pt-1 text-right font-mono tabular-nums">
        <div className="text-[0.8125rem] font-medium text-foreground">{block.start}</div>
        {block.end ? (
          <div className="mt-0.5 text-[0.6875rem] text-muted-foreground">{block.end}</div>
        ) : null}
      </div>
      <div className={`relative min-w-0 pl-5 ${last ? "pb-0" : "pb-6"}`}>
        <span
          className={`absolute left-0 top-2.5 size-2 rounded-full ${
            transit || plan ? "border border-border bg-background" : "bg-foreground"
          }`}
        />
        {!last ? (
          <span className="absolute bottom-1 left-[3.5px] top-5 w-px bg-border" />
        ) : null}
        <div
          className={`rounded-[10px] p-4 ${
            transit
              ? "border border-dashed border-border bg-transparent"
              : "border border-border bg-card"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {block.tag[lang]}
            </span>
            {dur ? (
              <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                {dur}
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 text-[1.0625rem] font-medium tracking-tight text-foreground">
            {block.title[lang]}
          </h2>
          {block.detail ? (
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {block.detail[lang]}
            </p>
          ) : null}
          {block.location ? (
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3 shrink-0" strokeWidth={1.75} />
                {block.location[lang]}
              </span>
              {block.mapQuery ? (
                <a
                  href={mapsUrl(block.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                >
                  {pageCopy.map[lang]}
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const Tomorrow = () => {
  const { language } = useLanguage();
  const lang: Lang = language === "es" ? "es" : "en";

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={pageCopy.back[lang]}
        stickyClassName="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm"
        containerClassName="container px-6 py-3 flex items-center justify-between max-w-3xl mx-auto"
      />

      <div className="container px-6 max-w-3xl mx-auto">
        <header className="pb-10 pt-16 sm:pt-20">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {pageCopy.kicker[lang]}
          </p>
          <h1 className="mb-4 text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            {pageCopy.title[lang]}
          </h1>
          <p className="mb-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {pageCopy.subtitle[lang]}
          </p>
          <p className="text-xs text-muted-foreground">{pageCopy.timezone[lang]}</p>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {pageCopy.blocksLabel[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {STATS.blocks}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {pageCopy.committed[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {STATS.committed}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {pageCopy.transit[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {STATS.transit}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {pageCopy.first[lang]}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums text-foreground">
                {STATS.first}
              </dd>
            </div>
          </dl>
        </header>

        <div className="mb-10 rounded-[10px] border border-border bg-card px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{pageCopy.note[lang]}</p>
        </div>

        <section className="mb-4">
          {morningBlocks.map((block, i) => (
            <BlockCard
              key={block.id}
              block={block}
              lang={lang}
              last={i === morningBlocks.length - 1}
            />
          ))}
        </section>

        <section className="mb-16 mt-6 rounded-[10px] border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <h3 className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {pageCopy.later[lang]}
            </h3>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            {pageCopy.laterBody[lang]}
          </p>
          <ul className="mt-5">
            {laterBlocks.map((block) => (
              <li
                key={block.id}
                className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4 first:mt-0 first:border-t-0 first:pt-0"
              >
                <div>
                  <div className="font-mono text-xs tabular-nums text-muted-foreground">
                    {block.start}–{block.end}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {block.title[lang]}
                  </div>
                  {block.location ? (
                    <p className="mt-1.5 max-w-md text-xs text-muted-foreground">
                      {block.location[lang]}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {block.tag[lang]}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <div className="mb-4 flex items-center gap-2">
            <Moon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
            <h3 className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {pageCopy.night[lang]}
            </h3>
          </div>
          <ul className="space-y-2">
            {nightBefore.map((item) => (
              <li
                key={item.es}
                className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="select-none text-foreground/35">·</span>
                <span>{item[lang]}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[11px] text-muted-foreground/70 border-t border-border pt-6 pb-10">
          {pageCopy.source[lang]}
        </p>
      </div>
    </main>
  );
};

export default Tomorrow;
