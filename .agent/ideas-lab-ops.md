# UtiliHub Ideas Lab — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:ideas-lab-ops.md -->`.

If truncated: re-fetch; section reads; do not guess MODE.

---

## DOMAIN NOTES

### CORE

| Domain | Intent | Good fit | Bad fit |
| --- | --- | --- | --- |
| playgrounds | Open canvases / particles | Gravity, signatures | Static form + number |
| journeys | Path / progression | Waypoint rivers | Single-step calculator |
| studio-composition | Compose / draw | Glow trails, neon | Quiz score only |
| games | Rules / score | Pulse catch style | Fake game form |
| simulators | Evolving systems | Physics, live viz | Spreadsheet only |
| kits | Multi-tool paths | Coherent kit UX | Random tool pile |
| **quality-lift** | Raise bar on one existing playground / game / simulator | Compare 3; elevate the weak or high-headroom one | New from-scratch idea; parity-only polish |

### GROWTH

| Domain | Intent | Gate |
| --- | --- | --- |
| traffic-bets | Measurable growth bet | Prefer Analytics findings |
| growth-surfaces | Discovery UI | Concrete shippable UI |
| share-hooks | Shareability | Tie to real surface |
| search-magnets | SEO depth (same language) | Original text |
| retention-loops | Return / next-step UX | Analytics when possible |
| conversion-paths | Home → value paths | Do not remove ads |
| traffic-diagnosis | Measure A/B/C | Not a product idea |
| adsense-prep | Trust gaps (temporary) | Max 5 runs; never remove Adsterra |
| **seo-locales** | New `/{lang}/` route trees for high-spoken languages; SEO-only (no EN/ES nav) | Registry + hreflang; quality translation; **retire domain at 5 active** |

---

## QUALITY-LIFT (procedure when domain rolls)

Not a new product. Goal = **raise the quality standard** of one *existing* interactive experience so the bar moves permanently.

### Hard rules

1. **runs_total must be 5–10** (inclusive). Never 1–4. This is a deep upgrade, not a quick polish pass.
2. **Forbidden — parity polish:** Do not ship a “make it about as good as the other two” upgrade. The chosen experience must end **notably above** the quality of the two peers used in the comparison (interaction depth, visual delight, mobile feel, feature completeness, or a distinctive capability they lack). Future quality-lift selections that include a previously “acceptable” peer must then be forced to climb further.
3. Keep existing routes/ids when possible; do not invent a parallel clone. EN+ES stay in sync. Never remove Adsterra. Guard Core Web Vitals (lazy route, modest mobile cost).
4. next-step: if the surface is under playgrounds|journeys|studio-composition|games, ensure next-step is present/updated before AdsterraBanner.

### IDEATE steps

1. **Decide family (mandatory random):** draw U_f ~ Uniform(0,1). Map equally:
   - U_f < 1/3 → `playgrounds`
   - 1/3 ≤ U_f < 2/3 → `games`
   - U_f ≥ 2/3 → `simulators`
   **Forbidden:** choosing the family because it has “more material”, more recent closes, or feels safer. Catalog size must not bias the roll. Record `U_f` and the chosen family in `notes`.
2. **Sample three existing** shipped experiences in that family (paths live on site / in repo). If fewer than three exist in-family, fill the shortfall from the other two families and note the mix — still do not re-roll the family just because the catalog is thin.
3. **Compare** them on: visual polish, interaction depth, mobile UX, feature completeness, delight, CWV cost. Write a short comparison in `notes`.
4. **Choose target:**
   - If one is **notably weaker** than the other two → that is the target (raise it *past* the peers, not merely level with them).
   - If all are similar → pick the one with most headroom for a distinctive elevated standard (new interaction mode, stronger visual system, better onboarding, richer controls, etc.).
5. Define in `idea` + `notes` the **elevated standard** being set (what the peers still lack after this project). Set `runs_total` 5–10, `runs_remaining` same, `id` = existing experience id, paths = existing paths, `domain: quality-lift`.

### EXECUTE

One primary outcome per run toward that elevated standard. Smoke EN+ES. On close: document in notes that the bar moved; peers may no longer count as “good enough” in a future three-way comparison.

---

## SEO-LOCALES (procedure when domain rolls)

Not a canvas playground. Goal = **search-discoverable** full pages in another language.

**Hard cap:** max **5** active SEO locales (beyond EN/ES). EN and ES do not count toward the 5.

### Before rolling work

1. Read `.agent/seo-locales-registry.md` + `src/lib/i18n/seo-locales.ts`.
2. Count `active` locales. If **≥ 5**:
   - Do **not** activate another language.
   - Retire domain: set `seo-locales: 0` in `weights_growth` (state), remove from GROWTH roll set, note in state NOTES «seo-locales retired at 5 active».
   - If this roll selected seo-locales only to retire → IDEATE another domain or CLOSE with the retirement commit. No new locale pages required solely for retirement.
3. If **< 5**: pick locale = first priority-queue code not yet active, unless ACTIVE PROJECT already fixed one.

### Ship (when < 5 active)

4. Scope (one outcome per run): locale home `/{code}` + 1 high-value experience **or** deepen pages for an already-active locale. Prefer complete quality over translating the entire site in one run.
5. Routes under `/{code}/...` with `lang` / `dir` (Arabic → rtl).
6. Real translation of visible copy + title/description (not empty shells).
7. hreflang / alternates to EN+ES counterparts where equivalent pages exist; sitemap if the project uses one.
8. **Do not** add header/footer/home nav entries from EN or ES to these locales.
9. Update registry table + `SEO_LOCALES_ACTIVE` same commit.
10. Deploy + smoke on `/{code}/...`. Spanish summary: locale, paths, active count N/5.
11. runs_total typically 3–6 for a first locale beachhead; 1–3 for incremental pages.
12. When the **5th** language becomes active: in the same or next META/close run, retire the domain (weight 0 + roll omit) as above.

---

## ADSENSE-PREP (max 5 runs total)

Priority: About → Privacy → editorial depth → Terms → trust. One change/run. Never remove Adsterra. Track adsense-prep_runs in state.

---

## TRAFFIC-DIAGNOSIS

Measure 7d vs prior; thresholds −15% site / −25% route / 2× errors. A/B/C. Never strip Adsterra. Spanish report.

---

## QUALITY BAR

Product ideas: interactive, ≠ RECENT_CLOSED, ≤6–8 runs, visual payoff, EN+ES, next-step when required.

**quality-lift** exception: runs_total **5–10** required; target is an *existing* playground|game|simulator; must set an elevated standard above the two comparison peers (no parity-only work).

**seo-locales** exempt from canvas quality bar; must be real translated pages + registry update + no EN/ES nav pollution.

adsense-prep / traffic-diagnosis: as their sections.

### Core Web Vitals when coding (Ideas Lab)

- **Route isolation:** playgrounds/experiences load on their own route via lazy/dynamic import. Never eager-import heavy canvas/WebGL into home, root layout, or catalog list chunks.
- **LCP:** do not add large hero images or fonts on shared shells without `font-display` / sized media; avoid blocking the home critical path.
- **INP:** no heavy work on first interaction; debounce; keep animation work off the main thread when possible (or keep particle counts modest on mobile).
- **CLS:** reserve space for interactive stages; fixed aspect boxes for canvas; do not shove layout with late-mounted UI.
- **Bundle:** no new heavy deps unless essential; prefer existing stack. One experience must not pull HouseModeler3D or the full tools registry.
- If a growth/idea would clearly regress mobile CWV, redesign lighter or defer — quality of discovery > flashy weight.

Commits: `feat` / `polish` / `docs(agent)` / `fix(build)`.

---

## IDEATE idea template

```
status: active
idea: <paragraph>
id: <kebab-case or locale code for seo-locales>
path_en: /... or n/a
path_es: /es/... or n/a
path_seo: /{code}/...   # when seo-locales
domain: <rolled>
runs_total: <1..15>   # quality-lift: MUST be 5–10
runs_remaining: <same at IDEATE>
acceptance: pending
share: url | png | both | n/a
next_step_required: yes | no
notes: <roll math + locale if seo-locales; quality-lift: U_f + family + the 3 compared + elevated standard>
adsense-prep_runs: <n>
```

---

## POST-SHIP SMOKE CHECK

User-facing: open shipped paths (EN+ES and/or `/{seo-code}/...`). Confirm shell + main content. seo-locales: smoke SEO paths, not nav from EN/ES.

---

## MODE

0) Deploy + load state → rules → ops (+ seo registry if needed).  
1) active && runs_remaining>0 → EXECUTE.  
2) done / remaining 0 → IDEATE (two-urn GROWTH).  
3) FIX-BUILD max 2.

EXECUTE playgrounds: component, EN+ES, next-step, Adsterra kept, smoke, state.

Weight sampling: CORE cumulative; GROWTH two-urn (seo-locales in FLEX only; **skip if active ≥ 5**).

---

## Spanish summary template

Deploy; smoke; outcome; ACTIVE PROJECT; locale/registry if seo-locales (N/5 active); quality-lift U_f/family/peers + elevated bar if quality-lift; commits; Adsterra; next step.

---

## ALWAYS

- Guard Core Web Vitals on every ship (lazy routes, no home bloat, modest mobile cost).

Spanish summary; correct identity; quality > novelty; one outcome; next-step when required; never remove Adsterra; files win over automation prompt; two-urn GROWTH; truncation → re-read not invent; seo-locales → registry sync + no EN/ES nav links; **retire seo-locales domain at 5 active**; **quality-lift → U_f uniform family, compare 3, elevate above peers, 5–10 runs, no parity polish**.

<!-- end:ideas-lab-ops.md -->
