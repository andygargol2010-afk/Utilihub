import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Device = "convex-lens" | "concave-lens" | "concave-mirror" | "convex-mirror";

const W = 560;
const H = 320;
const AXIS_Y = H / 2;
const ELEM_X = 320;

function uToX(uCm: number) {
  return ELEM_X - uCm * 2.2;
}

function vToX(vCm: number, isMirror: boolean) {
  if (isMirror) return ELEM_X - vCm * 2.2;
  return ELEM_X + vCm * 2.2;
}

function computeImage(device: Device, u: number, fAbs: number) {
  const converging = device === "convex-lens" || device === "concave-mirror";
  const f = converging ? fAbs : -fAbs;
  const isMirror = device.includes("mirror");

  if (Math.abs(u - f) < 0.05) {
    return {
      v: Infinity as number,
      m: Infinity as number,
      real: false,
      inverted: false,
      atInfinity: true,
      f,
      isMirror,
    };
  }

  const v = 1 / (1 / f - 1 / u);
  const m = -v / u;
  const real = v > 0;
  const inverted = m < 0;
  return { v, m, real, inverted, atInfinity: false, f, isMirror };
}

export function OpticsSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [device, setDevice] = useState<Device>("convex-lens");
  const [u, setU] = useState(40);
  const [fAbs, setFAbs] = useState(20);
  const [objH] = useState(28);

  const result = useMemo(() => computeImage(device, u, fAbs), [device, u, fAbs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0c1929");
    g.addColorStop(1, "#061018");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(16, AXIS_Y);
    ctx.lineTo(W - 16, AXIS_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    const isMirror = result.isMirror;
    const f = result.f;
    const objX = uToX(u);
    const fMark = isMirror ? ELEM_X - Math.abs(f) * 2.2 : ELEM_X + Math.abs(f) * 2.2;
    const fMark2 = isMirror ? ELEM_X + Math.abs(f) * 2.2 : ELEM_X - Math.abs(f) * 2.2;

    const drawF = (x: number, label: string) => {
      ctx.fillStyle = "rgba(125,211,252,0.9)";
      ctx.beginPath();
      ctx.arc(x, AXIS_Y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(label, x - 4, AXIS_Y + 16);
    };
    drawF(fMark, "F");
    drawF(fMark2, "F'");

    ctx.strokeStyle = "rgba(56,189,248,0.85)";
    ctx.lineWidth = 2.5;
    if (!isMirror) {
      ctx.beginPath();
      ctx.ellipse(ELEM_X, AXIS_Y, 10, 70, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(56,189,248,0.7)";
      const tip = device === "convex-lens" ? 1 : -1;
      for (const y of [AXIS_Y - 68, AXIS_Y + 68]) {
        ctx.beginPath();
        ctx.moveTo(ELEM_X, y);
        ctx.lineTo(ELEM_X - 6, y + tip * 10);
        ctx.lineTo(ELEM_X + 6, y + tip * 10);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      const side = device === "concave-mirror" ? 1 : -1;
      ctx.beginPath();
      ctx.arc(ELEM_X + side * 40, AXIS_Y, 80, -0.95, 0.95, side < 0);
      ctx.stroke();
      ctx.strokeStyle = "rgba(226,232,240,0.35)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ELEM_X + side * 44, AXIS_Y, 80, -0.95, 0.95, side < 0);
      ctx.stroke();
    }

    const topY = AXIS_Y - objH;
    ctx.strokeStyle = "#34d399";
    ctx.fillStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, AXIS_Y);
    ctx.lineTo(objX, topY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX, topY);
    ctx.lineTo(objX - 6, topY + 12);
    ctx.lineTo(objX + 6, topY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Objeto" : "Object", objX - 14, topY - 8);

    if (!result.atInfinity && Number.isFinite(result.v) && Number.isFinite(result.m)) {
      const imgX = vToX(result.v, isMirror);
      const imgH = objH * Math.abs(result.m);
      const imgTop = result.inverted ? AXIS_Y + imgH : AXIS_Y - imgH;
      const color = result.real ? "#fbbf24" : "#c084fc";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.setLineDash(result.real ? [] : [5, 4]);
      ctx.beginPath();
      ctx.moveTo(imgX, AXIS_Y);
      ctx.lineTo(imgX, imgTop);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(imgX, imgTop);
      ctx.lineTo(imgX - 6, imgTop + (result.inverted ? -12 : 12));
      ctx.lineTo(imgX + 6, imgTop + (result.inverted ? -12 : 12));
      ctx.closePath();
      ctx.fill();
      ctx.fillText(es ? "Imagen" : "Image", imgX - 12, result.inverted ? imgTop + 18 : imgTop - 8);

      ctx.lineWidth = 1.4;
      const ray = (dash: boolean, col: string, pts: { x: number; y: number }[]) => {
        ctx.strokeStyle = col;
        ctx.setLineDash(dash ? [4, 3] : []);
        ctx.beginPath();
        ctx.moveTo(pts[0]!.x, pts[0]!.y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      if (!isMirror) {
        ray(false, "rgba(251,113,133,0.75)", [
          { x: objX, y: topY },
          { x: ELEM_X, y: topY },
        ]);
        if (device === "convex-lens") {
          ray(false, "rgba(251,113,133,0.75)", [
            { x: ELEM_X, y: topY },
            { x: imgX, y: imgTop },
          ]);
        } else {
          ray(true, "rgba(251,113,133,0.55)", [
            { x: ELEM_X, y: topY },
            { x: fMark2, y: AXIS_Y },
          ]);
          ray(false, "rgba(251,113,133,0.75)", [
            { x: ELEM_X, y: topY },
            { x: imgX, y: imgTop },
          ]);
        }
        ray(false, "rgba(96,165,250,0.8)", [
          { x: objX, y: topY },
          { x: imgX, y: imgTop },
        ]);
      } else {
        ray(false, "rgba(251,113,133,0.75)", [
          { x: objX, y: topY },
          { x: ELEM_X, y: topY },
        ]);
        ray(false, "rgba(251,113,133,0.75)", [
          { x: ELEM_X, y: topY },
          { x: imgX, y: imgTop },
        ]);
        ray(false, "rgba(96,165,250,0.8)", [
          { x: objX, y: topY },
          { x: ELEM_X, y: AXIS_Y },
        ]);
        ray(false, "rgba(96,165,250,0.8)", [
          { x: ELEM_X, y: AXIS_Y },
          { x: imgX, y: imgTop },
        ]);
      }
    } else if (result.atInfinity) {
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.font = "13px ui-sans-serif, system-ui";
      ctx.fillText(es ? "Imagen en el infinito" : "Image at infinity", ELEM_X + 20, 36);
    }
  }, [device, u, fAbs, objH, result, es]);

  const devices: { id: Device; en: string; es: string }[] = [
    { id: "convex-lens", en: "Convex lens", es: "Lente convergente" },
    { id: "concave-lens", en: "Concave lens", es: "Lente divergente" },
    { id: "concave-mirror", en: "Concave mirror", es: "Espejo cóncavo" },
    { id: "convex-mirror", en: "Convex mirror", es: "Espejo convexo" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {devices.map((d) => (
          <SimSecondaryButton key={d.id} theme="lab" active={device === d.id} onClick={() => setDevice(d.id)}>
            {es ? d.es : d.en}
          </SimSecondaryButton>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-sky-400/15 bg-black/30">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          {es ? "Distancia objeto u (cm)" : "Object distance u (cm)"}: {u}
          <input
            type="range"
            min={8}
            max={90}
            value={u}
            onChange={(e) => setU(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Distancia focal |f| (cm)" : "Focal length |f| (cm)"}: {fAbs}
          <input
            type="range"
            min={8}
            max={50}
            value={fAbs}
            onChange={(e) => setFAbs(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label: es ? "Imagen v" : "Image v",
            value: result.atInfinity ? "∞" : `${result.v.toFixed(1)} cm`,
          },
          {
            label: es ? "Aumento m" : "Magnification m",
            value: result.atInfinity ? "—" : result.m.toFixed(2),
          },
          {
            label: es ? "Tipo" : "Type",
            value: result.atInfinity
              ? es
                ? "Infinito"
                : "Infinity"
              : result.real
                ? es
                  ? "Real"
                  : "Real"
                : es
                  ? "Virtual"
                  : "Virtual",
          },
          {
            label: es ? "Orientación" : "Orientation",
            value: result.atInfinity
              ? "—"
              : result.inverted
                ? es
                  ? "Invertida"
                  : "Inverted"
                : es
                  ? "Derecha"
                  : "Upright",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/55">{s.label}</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-white/45">
        {es
          ? "Ecuación de lentes delgadas: 1/f = 1/v + 1/u · Rayos principales (paralelo y por el centro)."
          : "Thin-lens equation: 1/f = 1/v + 1/u · Principal rays (parallel and through center)."}
      </p>

      <div className="flex justify-center">
        <SimPrimaryButton
          theme="lab"
          onClick={() => {
            setU(40);
            setFAbs(20);
            setDevice("convex-lens");
          }}
        >
          {es ? "Restablecer" : "Reset"}
        </SimPrimaryButton>
      </div>
    </div>
  );
}
