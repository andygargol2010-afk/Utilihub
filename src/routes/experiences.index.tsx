import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Experiences Hub | UtiliHub";
const description = cleanDescription(
  "Discover interactive playgrounds, simulators, games and studios. Live mini-previews, shareable, mobile-friendly.",
);

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/experiences") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/experiences") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/experiences") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/experiences") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/experiences") },
    ],
  }),
  component: ExperiencesHubEn,
});

function ParticleMini() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 80, y: 50 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(enable, 800);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * 160,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: 2 + Math.random() * 2,
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, 160, 100);
      particles.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = 0.15 / dist;
        p.vx += dx * force;
        p.vy += dy * force;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 160) p.vx *= -1;
        if (p.y < 0 || p.y > 100) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${200 + p.x}, 70%, 55%)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={100}
      className="h-24 w-full rounded-xl bg-sky-100/60"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouse.current = {
          x: ((e.clientX - rect.left) / rect.width) * 160,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        };
      }}
    />
  );
}

function SeatingMini() {
  const [assigned, setAssigned] = useState<number[]>([]);
  const tables = [0, 1, 2, 3];
  return (
    <div className="flex h-24 items-center justify-center gap-2 rounded-xl bg-rose-50">
      {tables.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setAssigned((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]))}
          className={`size-8 rounded-full border-2 transition ${
            assigned.includes(i) ? "border-rose-600 bg-rose-500" : "border-rose-300 bg-white hover:bg-rose-100"
          }`}
          aria-label={`Table ${i + 1}`}
        />
      ))}
    </div>
  );
}

function ExperiencesHubEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Discover · Play · Share</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Experiences Hub</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Interactive playgrounds, simulators, games and studios. Try mini-previews, then dive in. Shareable links, works on mobile.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <div className="flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-5 shadow-sm">
          <ParticleMini />
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Interactive Particles</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Hover the preview. Mouse attracts particles live.
          </span>
          <Link to="/playgrounds/particles" className="mt-4 text-sm font-bold text-sky-700">
            Open full playground →
          </Link>
        </div>

        <Link
          to="/playgrounds/gravity-particles"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>✨</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Gravity Particles</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Click to place attractors. Watch particles orbit in real time. Tunable gravity and count.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Open playground →</span>
        </Link>

        <Link
          to="/playgrounds/particle-signature"
          className="group flex flex-col rounded-3xl border border-purple-900/15 bg-gradient-to-br from-purple-50 via-white to-violet-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🌌</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Particle Signature</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Type a name to generate a unique shareable particle signature. Particles orbit text-seeded attractors.
          </span>
          <span className="mt-5 text-sm font-bold text-purple-700">Open playground →</span>
        </Link>

        <Link
          to="/postcard"
          className="group flex flex-col rounded-3xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>💌</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Shareable</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Particle Postcard</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Type a message. Particles swarm into glowing text. Share the link or download PNG.
          </span>
          <span className="mt-5 text-sm font-bold text-violet-700">Create postcard →</span>
        </Link>

        <Link
          to="/firework"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🎆</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Shareable</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Firework Signature</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Type a name. Fireworks form the letters then explode into a unique constellation. Share or download PNG.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Create signature →</span>
        </Link>

        <Link
          to="/fluid-type"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🌊</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Shareable</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Fluid Type Signature</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Type a name. Particles form the letters as a living fluid that responds to mouse or touch. Tune density, viscosity and moods.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Create signature →</span>
        </Link>

        <div className="flex flex-col rounded-3xl border border-rose-900/15 bg-gradient-to-br from-rose-50 via-white to-pink-50/80 p-5 shadow-sm">
          <SeatingMini />
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Studio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Event Seating Chart</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Click tables to assign seats. Instant visual feedback.
          </span>
          <Link to="/playgrounds/seating-chart" className="mt-4 text-sm font-bold text-rose-700">
            Open studio →
          </Link>
        </div>

        <Link
          to="/simulators"
          className="group flex flex-col rounded-3xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-indigo-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🔬</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Lab</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Physics & Chemistry Simulators</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Gravity, pendulums, molecules. Change parameters, watch live.
          </span>
          <span className="mt-5 text-sm font-bold text-violet-700">Explore simulators →</span>
        </Link>

        <Link
          to="/games"
          className="group flex flex-col rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🎮</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Games</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Browser Games</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Tetris, 2048, Snake and more. Instant play, no signup.
          </span>
          <span className="mt-5 text-sm font-bold text-emerald-700">Play games →</span>
        </Link>

        <Link
          to="/tools/$slug"
          params={{ slug: "3d-house-modeler" }}
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🏠</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Studio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">3D House Modeler</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Build houses in the browser. Walls, floors, roofs, free camera and realistic sky.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Open studio →</span>
        </Link>
      </div>
    </div>
  );
}
