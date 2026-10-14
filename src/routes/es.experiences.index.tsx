import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Hub de Experiencias | UtiliHub";
const description = cleanDescription(
  "Descubrí playgrounds, simuladores, juegos y estudios interactivos. Mini-previews en vivo, compartible, amigable en móvil.",
);

export const Route = createFileRoute("/es/experiences/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/experiences") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/experiences") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/experiences") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/experiences") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/experiences") },
    ],
  }),
  component: ExperiencesHubEs,
});

function ParticleMini() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 80, y: 50 });

  useEffect(() => {
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
  }, []);

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
          aria-label={`Mesa ${i + 1}`}
        />
      ))}
    </div>
  );
}

function ExperiencesHubEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Descubrí · Jugá · Compartí</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Hub de Experiencias</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Playgrounds, simuladores, juegos y estudios interactivos. Probá los mini-previews y sumergite. Enlaces compartibles, funciona en móvil.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <Link
          to="/es/postcard"
          className="group flex flex-col rounded-3xl border border-fuchsia-900/15 bg-gradient-to-br from-fuchsia-50 via-white to-pink-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>💌</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Viral</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Postal de Partículas</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Escribí un mensaje. Las partículas se agrupan para formar el texto. Compartí en X, WhatsApp o descargá PNG.
          </span>
          <span className="mt-5 text-sm font-bold text-fuchsia-700">Crear postal →</span>
        </Link>

        <div className="flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-5 shadow-sm">
          <ParticleMini />
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Partículas interactivas</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Pasá el mouse por el preview. Las partículas se atraen en vivo.
          </span>
          <Link to="/es/playgrounds/particulas" className="mt-4 text-sm font-bold text-sky-700">
            Abrir playground completo →
          </Link>
        </div>

        <Link
          to="/es/playgrounds/particulas-gravedad"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>✨</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Partículas de gravedad</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Hacé clic para colocar atrayentes. Mirá cómo las partículas orbitan en tiempo real. Gravedad y cantidad ajustables.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Abrir playground →</span>
        </Link>

        <Link
          to="/es/playgrounds/firma-particulas"
          className="group flex flex-col rounded-3xl border border-purple-900/15 bg-gradient-to-br from-purple-50 via-white to-violet-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🌌</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Playground</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Firma de Partículas</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Escribí un nombre para generar una firma única de partículas compartible. Orbitan atrayentes generados por el texto.
          </span>
          <span className="mt-5 text-sm font-bold text-purple-700">Abrir playground →</span>
        </Link>

        <div className="flex flex-col rounded-3xl border border-rose-900/15 bg-gradient-to-br from-rose-50 via-white to-pink-50/80 p-5 shadow-sm">
          <SeatingMini />
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estudio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Plano de asientos</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Hacé clic en las mesas para asignar. Feedback visual instantáneo.
          </span>
          <Link to="/es/playgrounds/plano-asientos" className="mt-4 text-sm font-bold text-rose-700">
            Abrir estudio →
          </Link>
        </div>

        <Link
          to="/es/simuladores"
          className="group flex flex-col rounded-3xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-indigo-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🔬</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Lab</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Simuladores de física y química</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Gravedad, péndulos, moléculas. Cambiá parámetros y mirá en vivo.
          </span>
          <span className="mt-5 text-sm font-bold text-violet-700">Explorar simuladores →</span>
        </Link>

        <Link
          to="/es/juegos"
          className="group flex flex-col rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🎮</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Juegos</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Juegos en el navegador</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Tetris, 2048, Snake y más. Jugá al instante, sin registro.
          </span>
          <span className="mt-5 text-sm font-bold text-emerald-700">Jugar →</span>
        </Link>

        <Link
          to="/es/herramientas/$slug"
          params={{ slug: "modelador-casas-3d" }}
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>🏠</span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estudio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Modelador de casas 3D</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Construí casas en el navegador. Paredes, pisos, techos, cámara libre y cielo realista.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Abrir estudio →</span>
        </Link>
      </div>
    </div>
  );
}
