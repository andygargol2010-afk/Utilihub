#!/usr/bin/env python3
"""Add keyboard shortcuts to PixeliHub (roadmap item 7)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* shortcuts-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Tip text with shortcuts
old_tip = '    tip: es ? "Clic/arrastrá · rueda = zoom" : "Click/drag · wheel = zoom",'
new_tip = '    tip: es ? "Clic/arrastrá · rueda = zoom · B/E/I/G · [ ] grosor · Ctrl+Z" : "Click/drag · wheel = zoom · B/E/I/G · [ ] brush · Ctrl+Z",'
if old_tip not in t:
    raise SystemExit("tip not found")
t = t.replace(old_tip, new_tip, 1)

# 2) Keyboard effect after redo function
# Find a stable anchor: the exportPng function start
old_anchor = "  const exportPng = async (copy: boolean) => {"
if old_anchor not in t:
    raise SystemExit("exportPng anchor not found")

shortcuts_block = '''  /* shortcuts-v1 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;

      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();

      if (mod && k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((mod && k === "z" && e.shiftKey) || (mod && k === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === "[" || e.key === "]") {
        e.preventDefault();
        setBrushSize((n) => {
          if (e.key === "[") return Math.max(1, n - 1);
          return Math.min(8, n + 1);
        });
        return;
      }

      if (!mod && /^[1-8]$/.test(e.key)) {
        setBrushSize(Number(e.key));
        return;
      }

      if (mod) return;

      const toolMap: Record<string, ToolId> = {
        b: "pencil",
        p: "pencil",
        e: "eraser",
        i: "eyedropper",
        o: "eyedropper",
        g: "fill",
        f: "fill",
        l: "line",
        r: "rect",
        c: "circle",
      };
      const nextTool = toolMap[k];
      if (nextTool) {
        e.preventDefault();
        setTool(nextTool);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const exportPng = async (copy: boolean) => {'''

t = t.replace(old_anchor, shortcuts_block, 1)

# 3) Expand tip UI with a compact shortcuts legend under the existing tip
old_tip_ui = '<p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>'
new_tip_ui = '''<p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">
              B pencil · E eraser · I dropper · G fill · L line · R rect · C circle<br />
              [ ] brush · 1–8 size · Ctrl+Z undo · Ctrl+Shift+Z redo
            </p>'''
if old_tip_ui not in t:
    raise SystemExit("tip ui not found")
t = t.replace(old_tip_ui, new_tip_ui, 1)

TARGET.write_text(t)
assert "shortcuts-v1" in TARGET.read_text()
assert "setBrushSize" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
