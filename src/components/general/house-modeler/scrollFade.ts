/**
 * Fades the clipped edge(s) of a horizontally scrolling strip so touch users can
 * tell there are more controls off-screen. Desktop (>=768px) is left untouched.
 * Returns a cleanup function.
 */
export function attachScrollFade(el: HTMLElement): () => void {
  const update = () => {
    const narrow = typeof window !== "undefined" && window.innerWidth < 768;
    const max = el.scrollWidth - el.clientWidth;
    if (!narrow || max <= 4) {
      el.style.maskImage = "";
      el.style.webkitMaskImage = "";
      return;
    }
    const left = el.scrollLeft > 4 ? "transparent, #000 28px" : "#000, #000 0px";
    const right = el.scrollLeft < max - 4 ? "#000 calc(100% - 36px), transparent" : "#000, #000";
    const g = `linear-gradient(to right, ${left}, ${right})`;
    el.style.maskImage = g;
    el.style.webkitMaskImage = g;
  };
  update();
  el.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
  ro?.observe(el);
  return () => {
    el.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    ro?.disconnect();
  };
}
