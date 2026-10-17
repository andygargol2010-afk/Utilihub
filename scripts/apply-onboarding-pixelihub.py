#!/usr/bin/env python3
"""Add first-visit onboarding overlay to PixeliHub (roadmap item 18)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* onboarding-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) storage key constant
old_storage = 'const STORAGE_KEY = "utilihub-pixelihub-v1";'
new_storage = '''const STORAGE_KEY = "utilihub-pixelihub-v1";
/* onboarding-v1 */
const ONBOARD_KEY = "utilihub-pixelihub-onboard-v1";'''
if old_storage not in t:
    raise SystemExit("STORAGE_KEY not found")
t = t.replace(old_storage, new_storage, 1)

# 2) state after status
old_status = '  const [status, setStatus] = useState("");'
new_status = '''  const [status, setStatus] = useState("");
  const [showOnboard, setShowOnboard] = useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) !== "1"; } catch { return true; }
  });
  const [onboardStep, setOnboardStep] = useState(0);'''
if old_status not in t:
    raise SystemExit("status state not found")
t = t.replace(old_status, new_status, 1)

# 3) labels
old_lab = '''    tip: es ? "Clic/arrastrá · rueda = zoom · B/E/I/G · [ ] grosor · Ctrl+Z" : "Click/drag · wheel = zoom · B/E/I/G · [ ] brush · Ctrl+Z",
  }), [es]);'''
new_lab = '''    tip: es ? "Clic/arrastrá · rueda = zoom · B/E/I/G · [ ] grosor · Ctrl+Z" : "Click/drag · wheel = zoom · B/E/I/G · [ ] brush · Ctrl+Z",
    help: es ? "Ayuda" : "Help",
    skip: es ? "Saltar" : "Skip",
    next: es ? "Siguiente" : "Next",
    done: es ? "Listo" : "Done",
    onboardTitle: es ? "Bienvenido a PixeliHub" : "Welcome to PixeliHub",
  }), [es]);'''
if old_lab not in t:
    raise SystemExit("labels tip not found")
t = t.replace(old_lab, new_lab, 1)

# 4) onboard steps + dismiss before return
old_return = "  return (\n    <div className=\"/* sticky-mobile-v1 */"
if old_return not in t:
    raise SystemExit("return not found")

pre = '''  const finishOnboard = () => {
    setShowOnboard(false);
    try { localStorage.setItem(ONBOARD_KEY, "1"); } catch { /* ignore */ }
  };

  const onboardSteps = es
    ? [
        { title: "Dibujá", body: "Elegí una herramienta abajo (o a la izquierda en PC) y pintá en el canvas. Pellizcá o usá la rueda para zoom." },
        { title: "Capas y color", body: "Sumá capas, cambiá opacidad y usá las paletas. El gotero (◎) toma color del dibujo." },
        { title: "Exportar y compartir", body: "PNG a 1×–16×, hoja de sprites, JSON del proyecto o enlace #ph para compartir." },
        { title: "Atajos", body: "B lápiz · E goma · G relleno · Ctrl+Z deshacer. Tocá ? cuando quieras ver esta guía otra vez." },
      ]
    : [
        { title: "Draw", body: "Pick a tool (bottom on mobile, left on desktop) and paint on the canvas. Wheel or pinch area for zoom." },
        { title: "Layers & color", body: "Add layers, tweak opacity, switch palettes. The dropper (◎) samples from your art." },
        { title: "Export & share", body: "PNG at 1×–16×, spritesheet, project JSON, or a #ph share link." },
        { title: "Shortcuts", body: "B pencil · E eraser · G fill · Ctrl+Z undo. Tap ? anytime to reopen this guide." },
      ];

  return (
    <div className="/* sticky-mobile-v1 */'''

t = t.replace(old_return, pre, 1)

# 5) Help button in toolbar after PIXELIHUB brand
old_brand = '''        <span className="mr-1 text-[11px] font-black tracking-[0.18em] text-rose-400">PIXELIHUB</span>
        <div className="mx-1 h-4 w-px bg-zinc-700" />'''
new_brand = '''        <span className="mr-1 text-[11px] font-black tracking-[0.18em] text-rose-400">PIXELIHUB</span>
        <button
          type="button"
          title={t.help}
          onClick={() => { setOnboardStep(0); setShowOnboard(true); }}
          className="rounded px-1.5 py-0.5 text-[11px] font-bold text-zinc-400 hover:bg-zinc-800 hover:text-rose-300"
        >
          ?
        </button>
        <div className="mx-1 h-4 w-px bg-zinc-700" />'''
if old_brand not in t:
    raise SystemExit("brand not found")
t = t.replace(old_brand, new_brand, 1)

# 6) Overlay before closing outer div — replace final structure
old_end = '''            <p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">
              B pencil · E eraser · I dropper · G fill · L line · R rect · C circle<br />
              [ ] brush · 1–8 size · Ctrl+Z undo · Ctrl+Shift+Z redo
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}'''

new_end = '''            <p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">
              B pencil · E eraser · I dropper · G fill · L line · R rect · C circle<br />
              [ ] brush · 1–8 size · Ctrl+Z undo · Ctrl+Shift+Z redo
            </p>
          </div>
        </aside>
      </div>

      {showOnboard ? (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.onboardTitle}
            className="w-full max-w-sm rounded-2xl border border-zinc-600/80 bg-[#16161c] p-4 shadow-2xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">{t.onboardTitle}</p>
            <p className="mt-2 text-sm font-semibold text-zinc-100">{onboardSteps[onboardStep]?.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{onboardSteps[onboardStep]?.body}</p>
            <div className="mt-3 flex items-center gap-1.5">
              {onboardSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i === onboardStep ? "bg-rose-500" : i < onboardStep ? "bg-rose-500/40" : "bg-zinc-700"}`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={finishOnboard}
                className="rounded-lg px-3 py-2 text-[12px] font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                {t.skip}
              </button>
              {onboardStep < onboardSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setOnboardStep((s) => s + 1)}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-[12px] font-bold text-white hover:bg-rose-400"
                >
                  {t.next}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishOnboard}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-[12px] font-bold text-white hover:bg-rose-400"
                >
                  {t.done}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}'''

if old_end not in t:
    raise SystemExit("end block not found")
t = t.replace(old_end, new_end, 1)

# outer needs relative for absolute overlay
t = t.replace(
    'className="/* sticky-mobile-v1 */ -m-1 overflow-x-hidden rounded-xl',
    'className="/* sticky-mobile-v1 */ relative -m-1 overflow-x-hidden rounded-xl',
    1,
)

TARGET.write_text(t)
assert "onboarding-v1" in TARGET.read_text()
assert "showOnboard" in TARGET.read_text()
assert "finishOnboard" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
