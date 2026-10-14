import { useEffect, useRef, useState } from "react";

interface Props {
  locale?: "en" | "es";
}

export function AuroraNameFlow({ locale = "en" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(locale === "es" ? "Aurora" : "Aurora");
  const [density, setDensity] = useState(40);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      particles.length = 0;
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed * 0.5,
          hue: 180 + Math.random() * 60,
        });
      }
    };
    spawn();

    const draw = () => {
      ctx.fillStyle = "rgba(5, 10, 25, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.7)`;
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Simple letter outline hint
      ctx.fillStyle = "rgba(180, 230, 255, 0.9)";
      ctx.font = "bold 48px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(name.slice(0, 12), canvas.width / 2, canvas.height / 2);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [name, density, speed]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="rounded-lg border bg-background px-3 py-1.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 12))}
          placeholder={locale === "es" ? "Tu nombre" : "Your name"}
          maxLength={12}
        />
        <label className="text-xs text-muted-foreground">
          Density
          <input type="range" min={10} max={80} value={density} onChange={(e) => setDensity(+e.target.value)} className="ml-2" />
        </label>
        <label className="text-xs text-muted-foreground">
          Speed
          <input type="range" min={0.3} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="ml-2" />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[360px] w-full rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-lg"
      />
      <p className="text-xs text-muted-foreground">
        {locale === "es"
          ? "Partículas aurora fluyen alrededor de las letras. Restaurado para desbloquear el build."
          : "Aurora particles flow around the letters. Restored to unblock the build."}
      </p>
    </div>
  );
}
