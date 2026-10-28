# UtiliHub House Modeler — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:house-modeler-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit state in the **same commit** as the counting run’s code/docs change (PRODUCT / FIX-BUILD / META with work). Never a second deploy-only commit for `runs_done`.  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

| | |
| --- | --- |
| task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland on cap | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |

---

## RUN LIFETIME

```
runs_done: 318
runs_max: 500
```

- End of counting run → `runs_done += 1` (this file + commit).
- Never raise `runs_max` or reset without user request.
- When `runs_done >= runs_max` → pause this auto + enable Fightersland (see rules). **STOP**.

---

## FORCE FOCUS — MOBILE UI (temporary)

```
status: done
remaining_runs: 0
note: completed after PRODUCT run 163 (larger secondary controls + spacing under 768px)
```

User request 2026-10-16: next 3 executions focus on making the UI more comfortable for phone users; PC unchanged. Completed.

---

## MONOLITH NOTES

```
path: src/components/general/HouseModeler3D.tsx
approx_bytes: 364529
fps_baseline_desktop: ~4 fps (1366x768, headless SwiftShader software GL in cloud sandbox, 2026-10-26; compare only against same environment)
last_known_good_hint: (post META 261 health 331826 B / 7519 lines, no PLACEHOLDER, SHA de1e458a)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: PRODUCT
last_date: 2026-10-28
SEO_LOCALES_ACTIVE: pt (defer)
deploy: READY (prior tip eb56ea51; recent catalog tip 372efa6c ERROR unrelated to modeler)
note: PRODUCT run 318 Mirror button flips whole design (house-modeler/MirrorButton.tsx), monolith +330 B, build OK, 0 modeler console errors, fps desktop 5 SwiftShader. runs_done=318. Prior: PRODUCT run 317 Tab/Shift+Tab cycles selection (module cycleSelect.ts), build OK, 0 modeler console errors, fps desktop 4.75 SwiftShader. runs_done=317. Prior: PRODUCT run 316 per-part lock persisted in autosave/share/undo (SavedPart.l), monolith +156 B, build OK, 0 modeler console errors, fps desktop 4 SwiftShader. runs_done=316. Prior: PRODUCT run 315 shortcut tip + nudge label follow the chosen snap grid (was hard-coded 0.5 m), monolith +78 B, build OK, 0 modeler console errors, fps desktop 4.5 SwiftShader. runs_done=315. Prior: PRODUCT run 314 clear-all feedback hint (backlog #18), monolith +322 B, build OK, 0 modeler console errors, fps desktop 5.25 SwiftShader. runs_done=314. Prior: PRODUCT run 313 share link carries time-of-day (&tod=), monolith +203 B, build OK, 0 modeler console errors, fps desktop 3.25 SwiftShader. runs_done=313. Prior: PRODUCT run 312 persist time-of-day (backlog #16), monolith +234 B, build OK, 0 modeler console errors, fps desktop 4.5 SwiftShader (baseline ~4). runs_done=312. Prior: PRODUCT run 311 mobile toolbar edge-fade (backlog #9), monolith +235 B, build OK, 0 modeler console errors, fps desktop 5.75 SwiftShader. runs_done=311. Prior: PRODUCT run 310 adaptive render resolution (backlog #10), fps desktop 4.75 SwiftShader; mobile canvas 492->246px and ~12fps. runs_done=310. Prior: PRODUCT run 309 snap-grid size picker (backlog #12), monolith +424 B, build OK, 0 modeler console errors, fps desktop ~3.25 SwiftShader. runs_done=309. Prior: PRODUCT run 308 area readout chip (backlog #11), monolith +633 B, build OK, 0 modeler console errors, fps desktop ~3 SwiftShader (baseline ~4). runs_done=308. Prior: PRODUCT run 307 dimension labels (backlog #7), monolith +288 B, build OK, 0 modeler console errors, fps desktop ~2.75 SwiftShader (baseline ~4, noise). runs_done=307. Prior: MODELADOR-3D run 306 Import scene JSON (Open button). runs_done=306. Prior: PRODUCT run 305 time-of-day presets. Build OK, 0 modeler console errors, fps ~3 desktop SwiftShader. runs_done=305.
PRODUCT run 305: time-of-day lighting presets (backlog #6): Morning/Noon/Sunset/Dusk dropdown, new modules house-modeler/lighting.ts + TimeOfDayPicker.tsx; monolith +546 B (360607). Verified EN+ES desktop+mobile, 0 modeler console errors (only 2 known unrelated 404s). fps ~3 in SwiftShader (baseline ~4, noise-level, no new render cost). Local server: `PORT=4173 node .output/server/index.mjs` after build; EN url /tools/3d-house-modeler, ES /es/herramientas/modelador-casas-3d. runs_done=305.
```

Refresh after each run.

---

## NOTES

```
Prefer local-clone surgical PRODUCT when auth available. Prefer META if only path is full rewrite >300KB via tool channel.
PRODUCT run 234: clay tiles densify (flecks 9→12, moss denser) via local clone surgical.
PRODUCT run 235: health check + deferred chimney-crown densify due to no sandbox push auth.
PRODUCT run 236: chimney crown densify (courses 4→5 + soot/flecks/lime) via local clone surgical.
PRODUCT run 237: worn-earth densify (grit/damp/leaf/cracks) via local clone surgical.
RESTORE 2026-10-20: failed PRODUCT push truncated to PLACEHOLDER; restored via Actions (06f436ec).
META run 238: confirmed READY deploy + monolith health; door-metal densify still queued for authenticated local push.
META run 239: reconfirmed monolith health (~351kB, no PLACEHOLDER), deploy READY, door densify deferred.
MODELADOR-3D run 240: concrete MatPreset added surgically in helpers.
RESTORE 2026-10-20: push_files literalized content; monolith restored via Actions (aa9dbdb7). Door densify still deferred.
META run 241: confirmed tip READY, monolith intact (~330kB SHA aa9dbdb7), door densify deferred due to truncation risk.
PRODUCT run 242: door sheet-metal densify (seams 5→7, rivets 6→9 + weathering) via local clone surgical. runs_done=242.
PRODUCT run 243: roof-metal densify (seams 7→9 + fastener dots + denser weathering) via local clone surgical. runs_done=243.
META run 244: confirmed READY deploy + monolith health (331247 B); railing-metal densify deferred (no push auth / truncation risk).
PRODUCT run 245: railing-metal densify (flutes 10→14 + flecks/weathering) via local clone surgical. runs_done=245. Its Vercel deploys ERROR'd on unrelated catalog duplicate slug (generador-lorem-ipsum); subsequent catalog fixes made tip READY.
META run 246: confirmed tip READY (6eb3bb0), monolith intact 331563 B / 7513 lines, no PLACEHOLDER. Grass densify deferred (no sandbox push auth).
META run 247: confirmed monolith intact 331564 B / 7514 lines, no PLACEHOLDER. Tip e34109a has ERROR deploy from other agents (registry restore + playgrounds). Grass densify deferred again (truncation risk). runs_done=247.
META run 248: confirmed monolith intact 331335 B / 7514 lines, no PLACEHOLDER. Grass densify deferred (no sandbox push auth / truncation risk on full rewrite). Recent tip ERROR from playgrounds (unrelated). runs_done=248.
PRODUCT run 249: grass densify (clumps 48→64, blades 30→42, wear 6→8; relief clumps 70→90, blades 46→60) via local clone surgical. runs_done=249.
PRODUCT run 250: gravel densify (pebbles 120→160, larger stones 18→24, moss patches 8→12, rake lines 7→10) via local clone surgical. runs_done=250.
PRODUCT run 251: foundation board-formed densify (boards 4→5 + denser dust/stains) via local clone surgical. runs_done=251.
META run 252: confirmed tip READY + monolith health (331568 B / 7513 lines, no PLACEHOLDER). Wall-masonry densify deferred (no sandbox push auth / truncation risk). runs_done=252.
PRODUCT run 253: wall-masonry densify (cols 4→5, rows 7→8 + denser flecks/weathering) via local clone surgical. runs_done=253.
PRODUCT run 254: plaster densify (flecks/trowel/dirt/micro-pits) via local clone surgical. runs_done=254.
PRODUCT run 255: timber densify (mottling 18→26, grain 7→10, micro-fibers 4→6) via local clone surgical. runs_done=255.
META run 256: confirmed tip READY + monolith health (331827 B / 7520 lines, no PLACEHOLDER). runs_done=256.
META run 257: confirmed tip READY + monolith health (~345kB, SHA de1e458a, no PLACEHOLDER). Next densify deferred (truncation risk). runs_done=257.
MODELADOR-3D run 258: added pyramid ShapeKind (ConeGeometry 4 sides) fully wired in modeler3d-helpers (type/geometry/size/labels/list). Surgical. No HouseModeler3D touch. runs_done=258.
META run 259: confirmed tip READY + monolith health (331826 B, no PLACEHOLDER, SHA de1e458a). Chimney-brick densify deferred due to tool-channel truncation risk. runs_done=259.
META run 260: confirmed tip READY (eb56ea51) + monolith health (~345kB, SHA de1e458a, no PLACEHOLDER). Chimney-brick densify deferred (tool-channel truncation risk on >300kB rewrite). runs_done=260.
META run 261: confirmed monolith health 331826 B / 7519 lines / SHA de1e458a / no PLACEHOLDER. Recent catalog tip ERROR unrelated. Chimney-brick densify deferred (tool-channel truncation risk). runs_done=261.
MODELADOR-3D run 262: pyramid base aligned to axes (rotateY 45deg) + distinct palette icon. Surgical. runs_done=262.
MODELADOR-3D run 263: hemisphere ShapeKind (closed lathe dome) wired in modeler3d-helpers. Surgical, tsc OK. runs_done=263.
PRODUCT run 264: chimney-brick densify (160 flecks + 9 lime efflorescence streaks) via local clone surgical. runs_done=264.
MODELADOR-3D run 265: ceramic MatPreset (glossy glazed, EN/ES) in helpers. Surgical, tsc checked. runs_done=265.
PRODUCT run 266: fascia-board densify (knots, nail heads, rain streaks) via local clone surgical. runs_done=266.
MODELADOR-3D run 267: glow (emissive) MatPreset in helpers. Surgical. runs_done=267.
PRODUCT run 268: plinth masonry densify (grain flecks, damp splash, efflorescence) via local clone surgical. runs_done=268.
PRODUCT run 269: joinery (window sash) paint-wear densify (chips, stipple, sill grime) via local clone surgical. runs_done=269.
PRODUCT run 270: door-leaf timber densify (stile grain, kick scuffs, hand-worn varnish) via local clone surgical. runs_done=270.
PRODUCT run 271: nosing timber densify (end-grain checks, hand-worn edge, joint grime, specks) via local clone surgical. runs_done=271.
PRODUCT run 272: wall head-plate densify (oak knots, drying checks, joint grime/dust specks) via local clone surgical. runs_done=272.
MODELADOR-3D run 273: capsule ShapeKind (CapsuleGeometry) wired in helpers, tsc OK. runs_done=273.
MODELADOR-3D run 274: brushed-metal MatPreset (Metal cepillado) in helpers. runs_done=274.
PRODUCT run 275: glazing densify (rain droplets + run-off trails + lower-corner grime) via local clone surgical. runs_done=275.
PRODUCT run 276: hedgerow densify (16 leaf flecks per crown: sunlit tops + dark gaps) via local clone surgical. runs_done=276.
PRODUCT run 277: plaster bump densify (90 micro pits/sand grains) via local clone surgical. runs_done=277.
PRODUCT run 278: wall-masonry bump densify (110 grain pits/chisel specks) via local clone surgical. runs_done=278.
PRODUCT run 279: chimney-brick bump densify (120 clay pits/grit specks) via local clone surgical. runs_done=279.
PRODUCT run 280: timber bump densify (90 grain ridges + 8 knots) via local clone surgical. runs_done=280.
MODELADOR-3D run 281: velvet MatPreset (Terciopelo, sheen cloth) in helpers. runs_done=281.
PRODUCT run 282: clay tile bump densify (110 pits/grit specks) via local clone surgical. runs_done=282.
PRODUCT run 283: chimney-crown bump densify (90 cast-stone pores/grit specks) via local clone surgical. runs_done=283.
PRODUCT run 284: roof-metal bump densify (100 oxide pits/grit specks) via local clone surgical. runs_done=284.
PRODUCT run 285: railing-metal bump densify (90 paint pits/grit specks) via local clone surgical. runs_done=285.
PRODUCT run 286: door-metal bump densify (90 oxide pits/grit specks) via local clone surgical. runs_done=286.
PRODUCT run 287: joinery bump densify (90 paint pits/grit specks) via local clone surgical. runs_done=287.
PRODUCT run 288: fascia bump densify (90 wood pores/grit specks) via local clone surgical. runs_done=288.
PRODUCT run 289: door-leaf bump densify (90 wood pores/grit specks) via local clone surgical. runs_done=289.
PRODUCT run 290: footing board-formed bump densify (90 concrete pores/grit specks) via local clone surgical. runs_done=290.
PRODUCT run 291: head-plate bump densify (90 oak pores/grit specks) via local clone surgical. runs_done=291.
PRODUCT run 292: gravel dedicated pebble bump map (domed stones, dark gaps) via local clone surgical. runs_done=292.
PRODUCT run 293: plinth dedicated stone bump map (raised stones, recessed mortar, chipped tops, grain pits) via local clone surgical. runs_done=293.
PRODUCT run 294: worn-earth dedicated bump map (clods, hairline cracks, foot dimples) via local clone surgical. runs_done=294.
PRODUCT run 295: interior quarry-floor dedicated bump map (square pavers, recessed grout, pits) via local clone surgical. runs_done=295.
PRODUCT run 296: planter foliage leaf texture + dedicated bump map (was flat colour) via local clone surgical. runs_done=296.
META run 297: created .agent/house-modeler-backlog.md from browser audit (no undo/autosave/PNG/presets); local build+playwright OK, 0 modeler console errors. runs_done=297.
PRODUCT run 298: Export PNG button (backlog #3) in new module house-modeler/exportPng.ts; value run. Note: npm ci fails (lockfile missing @vercel/global-config); WindChillTool.tsx has tsc TS1005 at line 111 (unrelated, vite build still passes). runs_done=298.
PRODUCT run 299: autosave to localStorage + restore on load (backlog #1), new module house-modeler/autosave.ts; monolith +2005 B. Needs `npm install` (npm ci fails). runs_done=299.
PRODUCT run 300: undo/redo (backlog #2): history.ts snapshot stack, Ctrl+Z/Shift+Z/Y + Undo/Redo toolbar buttons EN+ES; autosave restore refactored into restoreParts; monolith +2093 B. runs_done=300.
PRODUCT run 301: first-visit onboarding hint overlay (backlog #8), new module house-modeler/OnboardingHint.tsx EN+ES, localStorage-remembered; monolith +119 B. runs_done=301.
PRODUCT run 302: share link (backlog #5): Copy link button, #design= hash wins over autosave, sanitizeParts shared in autosave.ts; monolith +1114 B. runs_done=302.
PRODUCT run 303: house presets (backlog #4): cabin/two-room/shed dropdown, replaces scene via restoreParts (undoable); monolith +221 B. runs_done=303.
MODELADOR-3D run 304: real autosave of live scene every 2s + pagehide/visibilitychange (was beforeunload only, unreliable on mobile); saveScene guarded until engine ready. Verified add cube -> reload restores, desktop+mobile. Monolith untouched. runs_done=304.
PRODUCT run 305: time-of-day lighting presets (backlog #6): Morning/Noon/Sunset/Dusk dropdown, new modules house-modeler/lighting.ts + TimeOfDayPicker.tsx; monolith +546 B (360607). Verified EN+ES desktop+mobile, 0 modeler console errors (only 2 known unrelated 404s). fps ~3 in SwiftShader (baseline ~4, noise-level, no new render cost). Local server: `PORT=4173 node .output/server/index.mjs` after build; EN url /tools/3d-house-modeler, ES /es/herramientas/modelador-casas-3d. runs_done=305.
MODELADOR-3D run 306: Import scene JSON (new 'Open/Abrir' toolbar button, importJSON in modeler3d-core, confirm before replace, invalid-file alert EN+ES, undoable). Verified EN desktop + ES mobile round trip export->clear->open, 0 console errors. House monolith untouched (360607 B). runs_done=306.
PRODUCT run 307: selected-part dimension label W × H × D m (backlog #7), new module house-modeler/dimensionLabel.ts; monolith +288 B (360895). Verified EN desktop + ES mobile. runs_done=307.
PRODUCT run 308: floor/wall/roof gross area chip next to part count (backlog #11), new module house-modeler/areaStats.ts; monolith +633 B. Verified EN desktop + ES mobile (preset -> chip). runs_done=308.
PRODUCT run 309: snap grid size picker 0.1/0.25/0.5/1 m (backlog #12), new module house-modeler/snapGrid.tsx; GRID const replaced by gridStep(); persisted in localStorage. Verified EN desktop + ES mobile. runs_done=309.
PRODUCT run 310: adaptive pixel ratio (backlog #10), new module house-modeler/adaptiveQuality.ts; monolith +~450 B. Verified EN desktop (1052->789px, fps 4.75) + ES mobile dsf2 (492->246px, ~12fps), 0 new modeler console errors. runs_done=310.
PRODUCT run 311: toolbar scroll-fade on <768px (backlog #9), new module house-modeler/scrollFade.ts; monolith +235 B (362557). Verified EN desktop (no mask, unchanged) + ES mobile (mask at start/mid/end). #14 404s = WONTFIX (Vercel-only scripts). Note: npm run build rewrites src/routeTree.gen.ts and public/og-image.png; do not commit them. runs_done=311.
PRODUCT run 312: time-of-day choice persisted in localStorage (backlog #16), loadTimeOfDay/saveTimeOfDay in lighting.ts; monolith +234 B (362791). Verified EN desktop + ES mobile: pick Dusk -> reload -> Dusk restored and scene dark. fps 4.5. runs_done=312.
PRODUCT run 313: share link includes time of day (&tod=dusk etc., sunset omitted; applied on load when no local parts), shareLink.ts readShareTod; monolith +203 B (362994). Verified EN desktop + ES mobile: dusk link opened in fresh context shows Dusk. runs_done=313.
PRODUCT run 314: after Clear (button or C key) an action hint says the scene can be recovered with Ctrl+Z/Undo (backlog #18). runs_done=314.
PRODUCT run 315: stale '0.5 m' in shortcut tip + nudge pad label now follows snap grid via withGridLabels (snapGrid.tsx), EN+ES. runs_done=315.
PRODUCT run 316: per-part lock (L) persisted in autosave, share link and undo (SavedPart.l); verified lock->reload->locked, unlock->Ctrl+Z->locked. runs_done=316.
PRODUCT run 317: Tab/Shift+Tab cycles part selection (backlog #21), house-modeler/cycleSelect.ts; shortcut tip EN+ES updated. runs_done=317.
PRODUCT run 318: Mirror button (backlog #22) flips whole design left-right around its centre, undoable; verified EN desktop + ES mobile (preset -> mirror -> Ctrl+Z restores). runs_done=318.
```

<!-- end:house-modeler-state.md -->
