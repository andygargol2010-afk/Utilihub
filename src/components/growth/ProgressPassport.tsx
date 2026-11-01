import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

type Locale = "en" | "es";

type Stamp = {
  id: string;
  label: { en: string; es: string };
  desc: { en: string; es: string };
};

const STAMPS: Stamp[] = [
  {
    id: "science-volcano",
    label: { en: "Science Kit: Volcano", es: "Kit Ciencia: Volcán" },
    desc: { en: "Complete the volcano experiment theme", es: "Completa el tema de experimento volcán" },
  },
  {
    id: "memory-level-3",
    label: { en: "Memory Match L3", es: "Memoria L3" },
    desc: { en: "Reach level 3 in memory match", es: "Alcanza nivel 3 en memoria" },
  },
  {
    id: "binpack-high",
    label: { en: "Bin Pack 80%+", es: "Empaque 80%+" },
    desc: { en: "Achieve 80%+ utilization", es: "Logra 80%+ de utilización" },
  },
  {
    id: "adsense-score-80",
    label: { en: "AdSense 80+", es: "AdSense 80+" },
    desc: { en: "Score 80+ on compliance kit", es: "Puntaje 80+ en kit de cumplimiento" },
  },
  {
    id: "quote-share",
    label: { en: "Quote Card Shared", es: "Tarjeta Cita Compartida" },
    desc: { en: "Generate and share a quote card", es: "Genera y comparte una tarjeta de cita" },
  },
  {
    id: "streak-7",
    label: { en: "7-Day Streak", es: "Racha 7 días" },
    desc: { en: "Maintain a 7-day return streak", es: "Mantén racha de retorno de 7 días" },
  },
];

export function ProgressPassport({ locale }: { locale: Locale }) {
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const passportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("stamps");
    if (fromUrl) {
      setEarned(new Set(fromUrl.split(",").filter(Boolean)));
    } else {
      const saved = localStorage.getItem("utilihub-passport");
      if (saved) setEarned(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("utilihub-passport", JSON.stringify([...earned]));
    const url = new URL(window.location.href);
    if (earned.size > 0) {
      url.searchParams.set("stamps", [...earned].join(","));
    } else {
      url.searchParams.delete("stamps");
    }
    window.history.replaceState({}, "", url.toString());
  }, [earned]);

  const toggle = (id: string) => {
    setEarned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setEarned(new Set());
  };

  const progress = Math.round((earned.size / STAMPS.length) * 100);
  const complete = progress === 100;

  const shareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("stamps", [...earned].join(","));
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generatePng = async () => {
    if (!passportRef.current) return;
    const canvas = await html2canvas(passportRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = "utilihub-progress-passport.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-md mx-auto">
      <div ref={passportRef} className="rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-lg">
        <h2 className="text-center text-xl font-black text-emerald-700">
          {locale === "es" ? "Pasaporte de Progreso UtiliHub" : "UtiliHub Progress Passport"}
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {earned.size} / {STAMPS.length} {locale === "es" ? "sellos" : "stamps"} · {progress}%
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {complete && (
          <div className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-center text-sm font-bold text-emerald-800">
            {locale === "es" ? "¡Pasaporte completo! Todos los sellos ganados." : "Passport complete! All stamps earned."}
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {STAMPS.map((s) => {
            const has = earned.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`relative rounded-xl border-2 p-3 text-left text-xs transition ${has ? "border-emerald-500 bg-emerald-50" : "border-muted bg-muted/30"}`}
              >
                {has && (
                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-500 text-[10px] font-black text-white shadow-md rotate-12">
                    ✓
                  </div>
                )}
                <div className="font-bold pr-6">{s.label[locale]}</div>
                <div className="mt-1 text-muted-foreground">{has ? "✓" : "○"} {s.desc[locale]}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={generatePng} className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
          {locale === "es" ? "Descargar PNG" : "Download PNG"}
        </button>
        <button type="button" onClick={shareLink} className="flex-1 rounded-xl border px-4 py-3 text-sm font-bold">
          {copied
            ? (locale === "es" ? "¡Copiado!" : "Copied!")
            : (locale === "es" ? "Copiar enlace" : "Copy link")}
        </button>
      </div>
      <div className="mt-2">
        <button type="button" onClick={reset} className="w-full rounded-xl border border-red-300 px-4 py-2 text-xs font-medium text-red-600">
          {locale === "es" ? "Reiniciar pasaporte" : "Reset passport"}
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {locale === "es" ? "Toca un sello para marcarlo (demo). El progreso se guarda localmente y la URL se actualiza." : "Tap a stamp to mark it (demo). Progress saves locally and the URL updates."}
      </p>
    </div>
  );
}
