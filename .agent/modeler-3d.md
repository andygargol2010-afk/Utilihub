# UtiliHub 3D Modeler (Tinkercad-style) — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Loaded when the **house-modeler** automation rolls **MODELADOR-3D** (~10% of non-FORCE runs), or when a human points here.

Load order for a MODELADOR-3D run:
1. `.agent/modeler-3d-state.md` (optional notes)
2. `.agent/modeler-3d.md` (this file)
3. `.agent/modeler-3d-ops.md` (tasks + procedure)

**Truncation protocol:** missing end marker → re-fetch; never invent the tail.

---

## What this product is

| | |
| --- | --- |
| Slug | `modelador-3d` |
| Entry | `src/components/general/Modeler3D.tsx` → `modeler3d-app` → `modeler3d-studio` |
| Core modules | `modeler3d-core.tsx`, `modeler3d-three-init.ts`, `modeler3d-helpers.ts`, `modeler3d-align.ts`, `modeler3d-scenes.ts` |
| Catalog | General tools; featured with house modeler on home |
| **Not** | `HouseModeler3D.tsx` / `modelador-casas-3d` (different product; do not edit that monolith here) |

Audience: quick **Tinkercad-like** block building in the browser — primitives, color, transform, simple materials, save/share scenes. Not architectural realism (that is the house modeler).

---

## Graphics identity (Tinkercad-style) — mandatory

Target look & feel:

1. **Clear toy/studio aesthetic**, not photoreal architecture.
2. **Readable shapes** on a neutral or soft gradient studio backdrop (not outdoor Sky/terrain of the house modeler).
3. **Soft contact shadows** optional; prefer **PCF soft** already in three-init — do not add heavy postprocessing stacks.
4. **Flat-to-slightly-plastic materials** (matte / metal / glass presets already exist) — saturated but not neon-noise.
5. **Visible ground grid** (GridHelper) as orientation cue — keep it legible, not distracting.
6. **Selection feedback** must be obvious (outline, emissive, or gizmo clarity) — Tinkercad users need instant “what is selected”.
7. **Performance:** 60fps target with dozens of primitives; no per-frame realloc; dispose geometries/materials on delete.
8. **Mobile:** larger hit targets for add/select; do not require hover-only for critical actions.

**Anti-goals (do not pursue under this prompt):**
- Copying house-modeler plaster/timber/clay realism or outdoor Sky.
- AAA PBR asset packs or large GLTF libraries.
- Turning this into a second house builder.

---

## IMMUTABLE

1. Only branch `fix/spanish-complete`. Never main for product.
2. **Do not edit** `HouseModeler3D.tsx` in a MODELADOR-3D run.
3. Prefer surgical edits inside `modeler3d-*.ts(x)` + `Modeler3D.tsx`. Keep modular splits; avoid one new mega-file.
4. Labels EN+ES for any new UI string.
5. Commit identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.
6. One focused improvement per run. Build must pass; deploy check after push.
7. Spanish summary at end of the run (house-modeler agent still owns the automation_update / runs_done bump).
8. Core Web Vitals: keep `Modeler3D` **lazy** on its route; never eager-import into home/catalog.

---

## Quality bar

- User-visible change (graphics, UX, shape, material, or bug).
- Acceptance test stated in one line before coding.
- Match existing patterns in `modeler3d-helpers` / studio.
- No PLACEHOLDER stubs.
- Desktop behavior preserved when changing mobile UI (breakpoint-scoped).

<!-- end:modeler-3d.md -->
