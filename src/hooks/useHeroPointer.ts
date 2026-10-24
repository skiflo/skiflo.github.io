import { useCallback, type RefObject } from "react";

/** Sets --hero-px/py and --hero-dx/dy on the hero element for backdrop parallax + glow. */
export function useHeroPointer(ref: RefObject<HTMLElement | null>) {
  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--hero-px", "50%");
    el.style.setProperty("--hero-py", "50%");
    el.style.setProperty("--hero-dx", "0");
    el.style.setProperty("--hero-dy", "0");
  }, [ref]);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      el.style.setProperty("--hero-px", `${x * 100}%`);
      el.style.setProperty("--hero-py", `${y * 100}%`);
      el.style.setProperty("--hero-dx", String((x - 0.5) * 2));
      el.style.setProperty("--hero-dy", String((y - 0.5) * 2));
    },
    [ref],
  );

  return { onMouseMove, onMouseLeave: reset };
}
