import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ROWS: [string, string, string][] = [
  ["1–9, 0, Q W E T Y U I", "Elegir pieza (muro, suelo, techo…)", "Pick a part (wall, floor, roof…)"],
  ["Tab / Shift+Tab", "Seleccionar siguiente / anterior", "Select next / previous part"],
  ["← ↑ ↓ →", "Mover la pieza seleccionada", "Nudge the selected part"],
  ["R", "Girar la pieza", "Rotate the part"],
  ["D", "Duplicar", "Duplicate"],
  ["L", "Bloquear / desbloquear", "Lock / unlock"],
  ["Delete", "Borrar la pieza", "Delete the part"],
  ["Ctrl+Z · Ctrl+Y", "Deshacer · Rehacer", "Undo · Redo"],
  ["F", "Pantalla completa", "Fullscreen"],
  ["Esc", "Cancelar", "Cancel"],
  ["?", "Abrir / cerrar esta ayuda", "Open / close this help"],
];

/** "?" toolbar button + key that opens a keyboard-shortcut cheat sheet. Owns its state and key listener. */
export function ShortcutsHelp({ es }: { es: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const title = es ? "Atajos de teclado" : "Keyboard shortcuts";
  return (
    <>
      <button
        type="button"
        data-testid="shortcuts-button"
        onClick={() => setOpen(true)}
        title={title}
        aria-label={title}
        className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
      >
        ⌨ {es ? "Atajos" : "Shortcuts"}
      </button>
      {open && createPortal(
        <div
          data-testid="shortcuts-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="max-h-[85vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={es ? "Cerrar" : "Close"} className="min-h-11 min-w-11 rounded-lg border border-border text-lg">×</button>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {ROWS.map(([k, esT, enT]) => (
                  <tr key={k} className="border-t border-border">
                    <td className="py-1.5 pr-3 align-top"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{k}</kbd></td>
                    <td className="py-1.5">{es ? esT : enT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
