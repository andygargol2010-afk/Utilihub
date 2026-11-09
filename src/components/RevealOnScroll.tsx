import { useEffect, useRef, type ReactNode } from "react";

/** Adds `.is-visible` via Intersection Observer for soft list entrance. */
export function RevealOnScroll({
  children,
  className = "",
  rootMargin = "0px 0px -8% 0px",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`.trim()}>
      {children}
    </div>
  );
}
