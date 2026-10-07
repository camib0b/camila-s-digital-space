import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeAiMarkdown } from "@/lib/normalizeAiMarkdown";

interface AiInsightContentProps {
  content: string;
}

const headingClassName =
  "mb-2 mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground first:mt-0";

const insightMarkdownComponents: Components = {
  h1: ({ children }) => <h1 className={headingClassName}>{children}</h1>,
  h2: ({ children }) => <h2 className={headingClassName}>{children}</h2>,
  h3: ({ children }) => <h3 className={headingClassName}>{children}</h3>,
  h4: ({ children }) => <h4 className={headingClassName}>{children}</h4>,
  p: ({ children }) => <p className="my-2 text-sm leading-relaxed text-foreground">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-4 text-sm">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-4 text-sm">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed [&>p]:my-0">{children}</li>,
  strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l border-border pl-3 text-sm text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children }) => <code className="font-mono text-[12px]">{children}</code>,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-2 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-2 py-2 align-top tabular-nums">{children}</td>
  ),
};

const AiInsightContent = ({ content }: AiInsightContentProps) => {
  const markdown = normalizeAiMarkdown(content);

  return (
    <div className="max-w-none text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={insightMarkdownComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default AiInsightContent;
