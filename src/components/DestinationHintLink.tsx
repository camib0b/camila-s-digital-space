import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export type DestinationHintTarget =
  | { kind: "internal"; path: string; fullPage?: boolean }
  | { kind: "external"; url: string };

type DestinationHintLinkProps = {
  title: string;
  destination: string;
  target: DestinationHintTarget;
  className?: string;
};

const destinationHintLinkClassName =
  "hockey-role-link group inline-flex min-w-0 max-w-full flex-wrap items-baseline font-medium text-foreground";

const destinationHintTitleClassName =
  "link-underline transition-colors duration-200 group-hover:text-muted-foreground group-focus-visible:text-muted-foreground";

const externalLinkIconClassName =
  "ml-1.5 h-3.5 w-3.5 shrink-0 self-center text-muted-foreground transition-colors duration-200 group-hover:text-teal-500 group-focus-visible:text-teal-500 dark:group-hover:text-teal-300 dark:group-focus-visible:text-teal-300";

/**
 * The home-list link used by field hockey roles. The label is the link.
 * External targets show the external-link icon and open in a new tab.
 * Internal routes stay in the same tab, with no icon. The destination hint
 * uses `.hockey-destination-hint` on `.hockey-role-link`.
 */
const DestinationHintLink = ({ title, destination, target, className }: DestinationHintLinkProps) => {
  const { t } = useLanguage();
  const accessibleName =
    target.kind === "external"
      ? `${title}. ${destination}. ${t("social.openInNewTab")}`
      : `${title}. ${destination}`;
  const linkClassName = cn(destinationHintLinkClassName, className);

  const content = (
    <>
      <span className={destinationHintTitleClassName}>{title}</span>
      {target.kind === "external" ? (
        <ExternalLink className={externalLinkIconClassName} aria-hidden="true" />
      ) : null}
      <span className="hockey-destination-hint text-xs font-normal text-muted-foreground" aria-hidden="true">
        {destination}
      </span>
    </>
  );

  if (target.kind === "external") {
    return (
      <a
        href={target.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={accessibleName}
        className={linkClassName}
      >
        {content}
      </a>
    );
  }

  if (target.fullPage) {
    return (
      <a href={target.path} aria-label={accessibleName} className={linkClassName}>
        {content}
      </a>
    );
  }

  return (
    <Link to={target.path} aria-label={accessibleName} className={linkClassName}>
      {content}
    </Link>
  );
};

export default DestinationHintLink;
