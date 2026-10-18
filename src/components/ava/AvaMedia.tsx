import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const MAXIMUM_REVEAL_DELAY_MILLISECONDS = 80;

type AvaMediaImageStyle = CSSProperties & {
  "--ava-media-reveal-delay": string;
};

type AvaMediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "eager" | "lazy";
  /**
   * Stagger when several frames enter together. Capped at 80ms.
   * Ignored when the visitor prefers reduced motion.
   */
  revealDelayMilliseconds?: number;
};

/**
 * Reserved frame for an AVA product screenshot.
 * The plate holds the bitmap's aspect ratio, then the image reveals once
 * when it has decoded and entered the viewport. Import and render one frame
 * per shot (Etiquetado, Presentación). Pass revealDelayMilliseconds={50}
 * on a second frame only when both enter together.
 */
function AvaMedia({
  src,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  revealDelayMilliseconds = 0,
}: AvaMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [trackedSource, setTrackedSource] = useState(src);
  const [hasDecodedImage, setHasDecodedImage] = useState(false);
  const [isInView, setIsInView] = useState(false);

  if (src !== trackedSource) {
    setTrackedSource(src);
    setHasDecodedImage(false);
    setIsInView(false);
  }

  const boundedRevealDelayMilliseconds = Math.min(
    Math.max(revealDelayMilliseconds, 0),
    MAXIMUM_REVEAL_DELAY_MILLISECONDS,
  );

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth > 0) {
      setHasDecodedImage(true);
    }
  }, [src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }
        setIsInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [src]);

  const isRevealed = hasDecodedImage && isInView;
  const imageStyle: AvaMediaImageStyle = {
    "--ava-media-reveal-delay": `${boundedRevealDelayMilliseconds}ms`,
  };

  return (
    <div
      ref={frameRef}
      className={cn("ava-media", className)}
      data-visible={isRevealed ? "true" : "false"}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div className="ava-media-skeleton" aria-hidden="true" />
      <img
        ref={imageRef}
        className="ava-media-image"
        style={imageStyle}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth > 0) {
            setHasDecodedImage(true);
          }
        }}
        onError={() => {
          setHasDecodedImage(true);
        }}
      />
    </div>
  );
}

export default AvaMedia;
