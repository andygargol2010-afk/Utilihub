#!/usr/bin/env python3
"""Wire Modeler3D entrypoints to the complete HouseModeler3D on fix/spanish-complete.

Avoids the missing modeler3d-core import that breaks modeler3d-studio.
Does not rewrite the 346KB HouseModeler3D monolith.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] if (Path(__file__).parent.name == "scripts") else Path.cwd()
GEN = ROOT / "src" / "components" / "general"

MODEL_APP = GEN / "modeler3d-app.tsx"
MODEL_ENTRY = GEN / "Modeler3D.tsx"

APP_CONTENT = '''import type { GeneralTool } from "@/lib/general/types";
import { HouseModeler3D } from "./HouseModeler3D";

/**
 * Full 3D modeler entry — uses the complete HouseModeler3D implementation.
 * (modeler3d-studio depended on missing modeler3d-core; this restores a working path.)
 */
export function Modeler3DApp(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <HouseModeler3D {...props} />;
}
'''

ENTRY_CONTENT = '''import type { GeneralTool } from "@/lib/general/types";
import { Modeler3DApp } from "./modeler3d-app";

/** Thin re-export so the large 3D app stays behind a small entry (push size limits). */
export function Modeler3D(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <Modeler3DApp {...props} />;
}
'''

def main() -> None:
    if not (GEN / "HouseModeler3D.tsx").is_file():
        raise SystemExit("HouseModeler3D.tsx missing — cannot wire Modeler3D")
    MODEL_APP.write_text(APP_CONTENT, encoding="utf-8")
    MODEL_ENTRY.write_text(ENTRY_CONTENT, encoding="utf-8")
    print(f"Wrote {MODEL_APP.relative_to(ROOT)}")
    print(f"Wrote {MODEL_ENTRY.relative_to(ROOT)}")
    print("OK: Modeler3D → modeler3d-app → HouseModeler3D")

if __name__ == "__main__":
    main()
