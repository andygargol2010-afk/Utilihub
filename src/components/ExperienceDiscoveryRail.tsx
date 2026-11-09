import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";
import { type Props, EXPERIENCES, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "./ExperienceDiscoveryRail.part2";

export function ExperienceDiscoveryRail({ locale }: Props) {
  const [category, setCategory] = useState("all");
  const [shuffleKey, setShuffleKey] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    const list = category === "all" ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === category);
    const shuffled = [...list];
    let seed = shuffleKey + 1;
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [category, shuffleKey]);

  const isEs = locale === "es";
  const isPt = locale === "pt";

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement) && document.activeElement !== sectionRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === "s" || e.key === "S") {
        setShuffleKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ariaLabel = isPt ? "Descubra experiências" : isEs ? "Descubre experiencias" : "Discover experiences";
  const title = isPt ? "Experiências interativas" : isEs ? "Experiencias interactivas" : "Interactive experiences";
  const shuffleLabel = isPt ? "Embaralhar" : isEs ? "Barajar" : "Shuffle";
  const shuffleTitle = isPt ? "Embaralhar (S)" : isEs ? "Barajar (S)" : "Shuffle (S)";
  const leftLabel = isPt ? "Rolar para a esquerda" : isEs ? "Desplazar a la izquierda" : "Scroll left";
  const rightLabel = isPt ? "Rolar para a direita" : isEs ? "Desplazar a la derecha" : "Scroll right";

  return (
    <section
      ref={sectionRef}
      className="container-page py-6 relative"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShuffleKey((k) => k + 1)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            data-event="discovery-rail-shuffle"
            title={shuffleTitle}
          >
            {shuffleLabel}
          </button>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="hidden rounded-lg border border-border bg-card p-1.5 hover:bg-accent sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={leftLabel}
            data-event="discovery-rail-scroll-left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="hidden rounded-lg border border-border bg-card p-1.5 hover:bg-accent sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={rightLabel}
            data-event="discovery-rail-scroll-right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              category === c.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-accent"
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            data-event={`discovery-rail-category-${c.id}`}
          >
            {isPt ? c.labelPt : isEs ? c.labelEs : c.labelEn}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filtered.map((exp) => {
            const path = isPt ? exp.pathPt : isEs ? exp.pathEs : exp.pathEn;
            const title = isPt ? exp.titlePt : isEs ? exp.titleEs : exp.titleEn;
            const desc = isPt ? exp.descPt : isEs ? exp.descEs : exp.descEn;
            const color = CATEGORY_COLORS[exp.category] || "from-primary/60 to-primary/30";
            const Icon = CATEGORY_ICONS[exp.category] || Sparkles;
            const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
            return (
              <div key={exp.id} className="relative min-w-[220px] max-w-[240px] flex-shrink-0 snap-start">
                <Link
                  to={path}
                  className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  data-event="discovery-rail-click"
                  data-exp={exp.id}
                >
                  <div className={`relative h-20 bg-gradient-to-br ${color} opacity-90 transition group-hover:opacity-100`}>
                    <Icon className="absolute bottom-2 right-2 size-5 text-white/80" aria-hidden />
                  </div>
                  <div className="p-4 pb-10">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      {CATEGORIES.find((c) => c.id === exp.category)?.[isPt ? "labelPt" : isEs ? "labelEs" : "labelEn"]}
                    </p>
                    <h3 className="mt-1 text-sm font-bold leading-snug">{title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{desc}</p>
                  </div>
                </Link>
                <div className="absolute bottom-2 right-2 z-10">
                  <ExperienceShareButton
                    title={title}
                    url={fullUrl}
                    locale={locale}
                    variant="icon"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
