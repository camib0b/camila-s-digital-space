import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeAiMarkdown } from "@/lib/normalizeAiMarkdown";

interface AiInsightContentProps {
  content: string;
}

const AiInsightContent = ({ content }: AiInsightContentProps) => {
  const markdown = normalizeAiMarkdown(content);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-p:my-2 prose-p:leading-relaxed prose-li:my-0.5 prose-strong:text-foreground prose-strong:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

export default AiInsightContent;
