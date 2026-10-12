import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { extractPostingFromUrl, fetchCvHistory, generateTailoredCvApi } from "@/lib/cvTailorApi";
import type { CvChangeLogEntry, CvWarning } from "@/lib/cv-tailor/types";
import { renderCvPdf } from "@/lib/cv-tailor/pdf";

const CVTailor = () => {
  const [postingUrl, setPostingUrl] = useState("");
  const [postingText, setPostingText] = useState("");
  const [editableCv, setEditableCv] = useState("");
  const [changeLog, setChangeLog] = useState<CvChangeLogEntry[]>([]);
  const [warnings, setWarnings] = useState<CvWarning[]>([]);
  const [history, setHistory] = useState<
    Array<{ id: number; company: string; role_title: string; created_at: string }>
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const keptCount = useMemo(() => changeLog.filter((entry) => entry.kept).length, [changeLog]);

  const loadHistory = async () => {
    const items = await fetchCvHistory();
    setHistory(items);
  };

  const handleExtract = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const text = await extractPostingFromUrl(postingUrl.trim());
      setPostingText(text);
      setStatus("Posting text loaded from URL.");
    } catch {
      setStatus("Could not extract from that URL. Paste the posting text instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const result = await generateTailoredCvApi({
        text: postingText,
        postingUrl: postingUrl.trim() || undefined,
        save: true,
      });
      setEditableCv(result.plainText);
      setChangeLog(result.changeLog);
      setWarnings(result.warnings);
      const kept = result.changeLog.filter((entry) => entry.kept).length;
      setStatus(`Tailored CV ready. ${kept} changes kept after Jev review.`);
      await loadHistory();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const bytes = await renderCvPdf({ language: "en", plainText: editableCv, sections: {} });
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "camila-escudero-cv.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableCv);
    setStatus("Copied CV text to clipboard.");
  };

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel="Home"
        stickyClassName="border-b border-border sticky top-0 z-50 bg-background"
        containerClassName="container px-6 py-3 flex items-center justify-between max-w-6xl mx-auto"
      />

      <div className="container px-6 py-10 max-w-6xl mx-auto">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-2xl font-medium text-foreground mb-2">CV tailor</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste a job posting or LinkedIn URL. The pipeline selects only verified facts, runs Jev validation,
            and fits a one-page A4 CV.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10">
          <section className="space-y-4">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground">Posting URL</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={postingUrl}
                onChange={(event) => setPostingUrl(event.target.value)}
              />
              <Button type="button" variant="outline" disabled={loading || !postingUrl.trim()} onClick={handleExtract}>
                Fetch
              </Button>
            </div>

            <label className="block text-xs uppercase tracking-wider text-muted-foreground">Posting text</label>
            <textarea
              className="w-full min-h-[220px] rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed"
              value={postingText}
              onChange={(event) => setPostingText(event.target.value)}
              placeholder="Paste the full job description…"
            />

            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={loading || postingText.trim().length < 80} onClick={handleGenerate}>
                Generate tailored CV
              </Button>
              <Button type="button" variant="outline" disabled={!editableCv} onClick={handleDownloadPdf}>
                Download PDF
              </Button>
              <Button type="button" variant="outline" disabled={!editableCv} onClick={handleCopy}>
                Copy as text
              </Button>
            </div>

            {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}

            {warnings.length > 0 ? (
              <div className="rounded-md border border-border p-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground">Warnings</p>
                {warnings.map((warning) => (
                  <p key={warning.code} className="text-sm text-muted-foreground">{warning.message}</p>
                ))}
              </div>
            ) : null}

            {history.length > 0 ? (
              <div className="rounded-md border border-border p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground mb-3">History</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {history.map((item) => (
                    <li key={item.id}>
                      {item.company} — {item.role_title}
                      <span className="text-xs font-mono ml-2">{item.created_at}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="space-y-4">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground">CV preview (editable)</label>
            <textarea
              className="w-full min-h-[420px] rounded-md border border-border bg-card px-3 py-2 text-sm font-mono leading-relaxed"
              value={editableCv}
              onChange={(event) => setEditableCv(event.target.value)}
            />

            <div className="rounded-md border border-border p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground mb-3">Change log</p>
              {changeLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">No changes yet.</p>
              ) : (
                <ul className="space-y-3 max-h-[320px] overflow-y-auto">
                  {changeLog.map((entry) => (
                    <li key={entry.id} className="text-sm border-b border-border/60 pb-3">
                      <p className="text-foreground">{entry.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Jev: {entry.verdicts.join(", ")} → {entry.majorityVerdict}
                        {entry.highRisk ? " · high overstatement risk" : ""}
                        {" · "}
                        {entry.kept ? "kept" : "reverted"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CVTailor;
