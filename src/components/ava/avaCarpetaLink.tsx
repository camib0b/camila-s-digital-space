import type { ReactNode } from "react";

export const CARPETA_CL_LABEL = "carpeta.cl";
export const CARPETA_CL_URL = "https://carpeta.cl";

export function renderWithCarpetaLinks(text: string): ReactNode {
  const labelIndex = text.indexOf(CARPETA_CL_LABEL);
  if (labelIndex < 0) {
    return text;
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const nextIndex = text.indexOf(CARPETA_CL_LABEL, cursor);
    if (nextIndex < 0) {
      nodes.push(text.slice(cursor));
      break;
    }

    if (nextIndex > cursor) {
      nodes.push(text.slice(cursor, nextIndex));
    }

    nodes.push(
      <a
        key={nextIndex}
        className="ava-inline-link"
        href={CARPETA_CL_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {CARPETA_CL_LABEL}
      </a>,
    );

    cursor = nextIndex + CARPETA_CL_LABEL.length;
  }

  return nodes.length === 1 ? nodes[0] : <>{nodes}</>;
}
