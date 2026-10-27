# House Modeler — Backlog (EN)

score = value*reach/effort (each 1–5). Pick the highest-score open item that fits one run; split big ones.
New code goes in `src/components/general/house-modeler/` (imported by the monolith). Net monolith growth <= 2 KB per run.
Audit date 2026-10-26 (opened EN/ES, desktop+mobile): no undo/redo, no autosave (refresh loses the design), no PNG export, no time-of-day, no presets, no onboarding beyond Help. Existing: Save, Share, PDF, CSV, Duplicate, Frame, Rotate, Lock, Delete, Clear, Fullscreen, layers.

| # | Item | Val | Reach | Eff | Score | Status |
|---|------|-----|-------|-----|-------|--------|
| 1 | Autosave design to localStorage + restore on load (try/catch, versioned) | 5 | 5 | 2 | 12.5 | DONE run 299 (house-modeler/autosave.ts; parts+finishes+yaw; layers/locks not yet) |
| 2 | Undo / redo (Ctrl+Z / Ctrl+Y + toolbar buttons, snapshot stack in new module) | 5 | 5 | 3 | 8.3 | open |
| 3 | Export PNG screenshot button (renderer toBlob after a render, EN+ES) | 4 | 4 | 1 | 16 | DONE run 298 (house-modeler/exportPng.ts) |
| 4 | Ready-made house presets (small cabin, 2-room, garden shed) loadable in one click | 4 | 5 | 3 | 6.7 | open |
| 5 | Share link: encode design in URL hash, load on open | 5 | 4 | 3 | 6.7 | open |
| 6 | Time-of-day / lighting presets (morning, noon, sunset) via sun position | 3 | 4 | 2 | 6 | open |
| 7 | Dimension labels for the selected part (W x H x D, m) shown on canvas | 4 | 4 | 3 | 5.3 | open |
| 8 | Onboarding hint overlay on first visit (dismissable, remembered) incl. touch gestures | 3 | 5 | 2 | 7.5 | open |
| 9 | Mobile: bigger structure palette tap targets + one-finger orbit/two-finger pan hint | 3 | 4 | 2 | 6 | open |
| 10 | Performance: adaptive pixel ratio / shadow map size when FPS < 30 | 4 | 3 | 3 | 4 | open |
| 11 | Total floor area / wall area readout (feeds paint/flooring tools via links) | 3 | 3 | 2 | 4.5 | open |
| 12 | Snap-to-grid toggle + visible grid size option | 3 | 3 | 2 | 4.5 | open |
| 13 | Extract texture painters from monolith into house-modeler/ modules (hygiene) | 2 | 2 | 4 | 1 | open |
| 14 | Fix 2 unrelated 404 resource requests seen on tool page (non-modeler) | 2 | 5 | 2 | 5 | open |
| 15 | Texture/bump micro-polish (max 1 in 8 PRODUCT runs) | 1 | 2 | 1 | 2 | open |

Next pick by score: #2 undo/redo (8.3), #8 onboarding (7.5), #4 presets / #5 share link (6.7).
