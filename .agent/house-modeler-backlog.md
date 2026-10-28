# House Modeler — Backlog (EN)

score = value*reach/effort (each 1–5). Pick the highest-score open item that fits one run; split big ones.
New code goes in `src/components/general/house-modeler/` (imported by the monolith). Net monolith growth <= 2 KB per run.
Audit date 2026-10-26 (opened EN/ES, desktop+mobile): no undo/redo, no autosave (refresh loses the design), no PNG export, no time-of-day, no presets, no onboarding beyond Help. Existing: Save, Share, PDF, CSV, Duplicate, Frame, Rotate, Lock, Delete, Clear, Fullscreen, layers.

| # | Item | Val | Reach | Eff | Score | Status |
|---|------|-----|-------|-----|-------|--------|
| 1 | Autosave design to localStorage + restore on load (try/catch, versioned) | 5 | 5 | 2 | 12.5 | DONE run 299 (house-modeler/autosave.ts; parts+finishes+yaw; layers/locks not yet) |
| 2 | Undo / redo (Ctrl+Z / Ctrl+Y + toolbar buttons, snapshot stack in new module) | 5 | 5 | 3 | 8.3 | DONE run 300 (house-modeler/history.ts; Ctrl+Z/Shift+Z/Y + Undo/Redo buttons; locks/layers not in snapshot) |
| 3 | Export PNG screenshot button (renderer toBlob after a render, EN+ES) | 4 | 4 | 1 | 16 | DONE run 298 (house-modeler/exportPng.ts) |
| 4 | Ready-made house presets (small cabin, 2-room, garden shed) loadable in one click | 4 | 5 | 3 | 6.7 | DONE run 303 (house-modeler/presets.ts + PresetPicker.tsx; 3 presets, confirm before replace, undoable) |
| 5 | Share link: encode design in URL hash, load on open | 5 | 4 | 3 | 6.7 | DONE run 302 (house-modeler/shareLink.ts; Copy link button; #design= hash wins over autosave) |
| 6 | Time-of-day / lighting presets (morning, noon, sunset) via sun position | 3 | 4 | 2 | 6 | DONE run 305 (house-modeler/lighting.ts + TimeOfDayPicker.tsx; morning/noon/sunset/dusk; choice not persisted yet) |
| 7 | Dimension labels for the selected part (W x H x D, m) shown on canvas | 4 | 4 | 3 | 5.3 | DONE run 307 (house-modeler/dimensionLabel.ts; DOM overlay W × H × D m above selected part) |
| 8 | Onboarding hint overlay on first visit (dismissable, remembered) incl. touch gestures | 3 | 5 | 2 | 7.5 | DONE run 301 (house-modeler/OnboardingHint.tsx) |
| 9 | Mobile: toolbar scroll affordance (edge fade) so off-screen controls are discoverable | 3 | 4 | 2 | 6 | DONE run 311 (house-modeler/scrollFade.ts; fade mask <768px only, hides at scroll ends; palette targets already 44px; gesture hint exists in onboarding) |
| 10 | Performance: adaptive pixel ratio / shadow map size when FPS < 30 | 4 | 3 | 3 | 4 | DONE run 310 (house-modeler/adaptiveQuality.ts; pixel ratio steps 2→1.5→1→0.75 when fps<28 over 2.5s, never steps back up; shadow map size untouched) |
| 11 | Total floor area / wall area readout (feeds paint/flooring tools via links) | 3 | 3 | 2 | 4.5 | DONE run 308 (house-modeler/areaStats.ts; gross floor/wall/roof m² chip, openings not subtracted) |
| 12 | Snap-to-grid toggle + visible grid size option | 3 | 3 | 2 | 4.5 | DONE run 309 (house-modeler/snapGrid.tsx; 0.1/0.25/0.5/1 m dropdown, persisted, drives snap + nudges) |
| 13 | Extract texture painters from monolith into house-modeler/ modules (hygiene) | 2 | 2 | 4 | 1 | open |
| 14 | Fix 2 unrelated 404 resource requests seen on tool page (non-modeler) | 2 | 5 | 2 | 5 | WONTFIX (run 311: /_vercel/insights and speed-insights scripts only exist on Vercel; 404 only on local server) |
| 16 | Persist time-of-day choice across reloads | 3 | 4 | 1 | 12 | DONE run 312 (lighting.ts load/saveTimeOfDay) |
| 17 | Share link carries time of day | 3 | 3 | 1 | 9 | DONE run 313 (shareLink.ts &tod=) |
| 18 | Clear-all (button / C key, no confirm) shows 'Ctrl+Z or Undo brings it back' hint | 3 | 4 | 1 | 12 | DONE run 314 (clearedHintRef in monolith) |
| 19 | Stale '0.5 m' in shortcut tip / nudge label follows snap grid | 2 | 4 | 1 | 8 | DONE run 315 (withGridLabels in snapGrid.tsx) |
| 20 | Persist per-part lock in autosave/share/undo | 3 | 3 | 1 | 9 | DONE run 316 (SavedPart.l) |
| 21 | Tab / Shift+Tab cycles selection between parts (keyboard a11y, skips hidden layers) | 3 | 3 | 1 | 9 | DONE run 317 (house-modeler/cycleSelect.ts) |
| 22 | Mirror button: flip whole design left-right around its centre (undoable) | 3 | 3 | 1 | 9 | DONE run 318 (house-modeler/MirrorButton.tsx; only layout+yaw mirrored) |
| 23 | Turn 90 button: rotate whole design 90 deg around footprint centre (undoable) | 3 | 3 | 1 | 9 | DONE run 319 (house-modeler/RotateDesignButton.tsx) |
| 24 | Measure tool: toggle, two ground taps -> distance label (m + ft), snaps to grid | 4 | 4 | 3 | 5.3 | DONE run 320 (house-modeler/measure.tsx; ground only, not part-to-part) |
| 25 | Camera View picker: 3D / Plan (top) / Front / Side framing whole design | 4 | 4 | 1 | 16 | DONE run 322 (house-modeler/ViewPicker.tsx) |
| 26 | Hide/Show roof toggle to see the interior (roofs only, nothing deleted) | 4 | 4 | 1 | 16 | DONE run 323 (house-modeler/RoofToggle.tsx; not persisted; roof placed while hidden stays visible until next toggle) |
| 27 | Bugfix: placing a roof while roofs are hidden re-shows all roofs (toggle no longer lies) | 3 | 3 | 1 | 9 | DONE run 324 |
| 28 | Keyboard shortcuts cheat sheet (? key + Shortcuts button, portal dialog, EN+ES) | 3 | 4 | 1 | 12 | DONE run 325 (house-modeler/ShortcutsHelp.tsx) |
| 29 | Edge snap: place/drag pulls a part flush to neighbouring part edges (<=0.3 m, roofs excluded) | 4 | 5 | 2 | 10 | DONE run 326 (house-modeler/edgeSnap.ts; ghost preview not snapped; palette-drag ghost unchanged) |
| 30 | Spin view: turntable toggle auto-orbits camera for presentations, stops on canvas press | 3 | 4 | 1 | 12 | DONE run 327 (house-modeler/TurntableToggle.tsx) |
| 31 | Estimated build cost chip (rough USD from floor/wall/roof area + per-piece prices, rounded to 100) | 4 | 4 | 1 | 16 | DONE run 328 (house-modeler/costEstimate.ts) |
| 32 | Multi-select (shift/ctrl-click or box) with move/delete/duplicate of the group | 5 | 4 | 4 | 5 | open |
| 33 | Layers hidden/visible state + locks in undo snapshot and autosave | 3 | 3 | 2 | 4.5 | open |
| 34 | Subtract door/window openings from wall area readout and cost chip | 3 | 3 | 2 | 4.5 | DONE run 330 (areaStats.ts; fixed 2.0/1.3 m2 per door/window) |
| 35 | Measure tool: snap to part corners, part-to-part distance | 3 | 3 | 2 | 4.5 | open |
| 36 | Mobile: pinch-to-zoom/two-finger pan hint + double-tap Frame | 3 | 4 | 2 | 6 | open (hint exists in onboarding; double-tap conflicts with tap-to-place, View picker already frames) |
| 37 | Export design as image with transparent/white background + dimension overlay option | 2 | 3 | 2 | 3 | open |
| 38 | Persist snap-grid/view/roof-hidden state in share link (full scene state) | 2 | 3 | 2 | 3 | open |
| 39 | Floor-plan 2D export (top view PNG with room labels) | 4 | 3 | 3 | 4 | open |
| 15 | Texture/bump micro-polish (max 1 in 8 PRODUCT runs) | 1 | 2 | 1 | 2 | open |

Ideas for next audit: layers/locks in undo snapshot, measure tool (distance between two points), Delete-key/Ctrl+D discoverability, include time-of-day in share link.
Next pick by score: #13 extraction (hygiene), then new audit for fresh items (e.g. persist time-of-day, layers/locks in undo snapshot, measure tool).

New ideas (run 314): Tab/Shift+Tab to cycle selection, measure tool, stale shortcut tip text (says arrows nudge 0.5 m; now grid-dependent), layers/locks in undo snapshot.

Next ideas (run 319): measure tool, layers/hidden state in autosave+undo, multi-select, extraction #13.

Next ideas (run 320): measure snapping to part corners, layers/hidden state in autosave+undo, multi-select, extraction #13.

META run 329 (2026-10-28): backlog refreshed with #32-#39 (roll=1). Recommended next picks by score: #36, #32 (split: selection model first), #39. Texture/bump allowance: last 40+ runs were value runs, so budget is fine; still max 1 in 8.
