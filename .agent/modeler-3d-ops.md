# UtiliHub 3D Modeler — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:modeler-3d-ops.md -->`.

---

## When this runs

Invoked by **house-modeler-hourly-improve** when MODE = **MODELADOR-3D** (~10% of non-FORCE runs).

Declare: `Modo: MODELADOR-3D`, task id, acceptance test. Then implement **one** task below.

---

## PRODUCT TASKS (pick one)

### 1) GRAPHICS / STUDIO LOOK
- Soften or clarify grid, ambient/key light balance, background color, shadow softness.
- Keep **Tinkercad-studio** identity (readable primitives, not outdoor realism).
- **Done when:** scene reads cleaner in preview; FPS still interactive on mid mobile.

### 2) MATERIALS / PRESETS
- Improve existing `MatPreset` (`default` | `matte` | `metal` | `glass`) or add **one** new preset with EN+ES label.
- **Done when:** swatch applies visibly and consistently on box/sphere.

### 3) SHAPES
- Polish geometry for one existing `ShapeKind`, or add **one** new primitive fully wired (helpers geometry + shapeList EN/ES + create path).
- **Done when:** user can add it from the palette and transform it like others.

### 4) SELECTION / GIZMO / ALIGN
- Clearer multi-select, marquee, align/distribute (`modeler3d-align`), or transform feedback.
- **Done when:** selecting and moving objects feels less ambiguous than before.

### 5) UI / MOBILE
- Palette, property panel, onboarding, or touch targets under ~768px.
- Desktop layout density unchanged unless fixing a real bug.
- **Done when:** phone can add + select + recolor without mis-taps; EN+ES strings.

### 6) SCENES / SHARE / PERSISTENCE
- Named scenes, presets, share encode/decode, autosave robustness (`modeler3d-scenes` / storage keys).
- **Done when:** save/load or share path works in a stated test without wiping the scene.

### 7) FIX BUGS
- Dispose leaks, history undo/redo edge cases, clipboard, group/ungroup, export.
- Smallest diff that fixes the failure mode.

---

## Procedure

1. Read `modeler-3d.md` + this file (+ state if present).
2. Open the relevant `modeler3d-*` module; mirror patterns.
3. One acceptance line → implement → self-check dispose + EN/ES.
4. Commit: `feat(modeler-3d): …` or `fix(modeler-3d): …`.
5. POST-PUSH deploy check on fix/spanish-complete (same as house-modeler ops).
6. Update `.agent/modeler-3d-state.md` last_run notes if useful.
7. House-modeler agent: still **bump `runs_done`** in house-modeler-state (this run counts toward lifetime).
8. Spanish summary: note MODELADOR-3D, task, acceptance steps, deploy.

---

## Ranking when choosing

Prefer: FIX BUGS → SELECTION/UI mobile → MATERIALS/GRAPHICS → SHAPES → SCENES.

Skip busywork with no visible/behavior change.

---

## ALWAYS

- Tinkercad-style, not house-modeler realism.
- Never touch `HouseModeler3D.tsx` in this mode.
- Lazy route only; no home bundle bloat.
- One outcome; honest Spanish summary.

<!-- end:modeler-3d-ops.md -->
