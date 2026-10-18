import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function scrollToHashElement(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) {
    return false;
  }

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
    return true;
  }

  return false;
}

/**
 * Resets scroll on client-side route changes while preserving hash targets and
 * back/forward positions keyed by React Router history entries.
 */
const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const historyKey = location.key;
    const positions = scrollPositions.current;

    return () => {
      positions[historyKey] = window.scrollY;
    };
  }, [location]);

  useEffect(() => {
    if (navigationType === "POP") {
      const savedY = scrollPositions.current[location.key];
      if (savedY !== undefined) {
        window.scrollTo(0, savedY);
        return;
      }
    }

    if (location.hash) {
      if (!scrollToHashElement(location.hash)) {
        requestAnimationFrame(() => {
          scrollToHashElement(location.hash);
        });
      }
      return;
    }

    window.scrollTo(0, 0);
  }, [location, navigationType]);

  return null;
};

export default ScrollToTop;
