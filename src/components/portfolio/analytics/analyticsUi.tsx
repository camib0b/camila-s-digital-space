import katex from "katex";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import "katex/dist/katex.min.css";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function Formula({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: true }),
    [tex],
  );
  return <div className="overflow-x-auto text-sm text-foreground" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MethodNote({
  title,
  formulas,
  notes,
}: {
  title: string;
  formulas: readonly string[];
  notes: readonly string[];
}) {
  return (
    <details className="mt-4 border-t border-border">
      <summary className="cursor-pointer list-none py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3 pb-2">
        {formulas.map((tex) => (
          <Formula key={tex} tex={tex} />
        ))}
        {notes.map((note) => (
          <p key={note} className="text-xs leading-relaxed text-muted-foreground">
            {note}
          </p>
        ))}
      </div>
    </details>
  );
}

export function SourceFooter({ tag }: { tag: string }) {
  return <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-wide text-muted-foreground">{tag}</p>;
}

export function UnavailableNote({ label, reason }: { label: string; reason: string }) {
  return (
    <div className="border border-border px-3 py-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-foreground">{reason}</p>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="analytics-rise border border-border bg-card px-4 py-5 md:px-5">
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
