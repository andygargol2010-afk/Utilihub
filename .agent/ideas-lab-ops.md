# UtiliHub Ideas Lab — Ops (2/3)

**Part 2 of 3.** Procedures, quality, MODE. End marker: `<!-- end:ideas-lab-ops.md -->`.

If this file truncates on read: re-fetch; then read by `##` sections; if still incomplete, stop and report — do not guess MODE.

---

## DOMAIN NOTES

### CORE

| Domain | Intent | Good fit | Bad fit |
| --- | --- | --- | --- |
| playgrounds | Open canvases / particles | Gravity, signatures, constellations | Static form + number |
| journeys | Path / progression | Waypoint rivers, celebration arcs | Single-step calculator |
| studio-composition | Compose / draw | Glow trails, mandalas, neon | Quiz score only |
| games | Rules / score | Pulse catch style | Fake game form |
| simulators | Evolving systems | Physics, waves, live viz | Spreadsheet only |
| kits | Multi-tool paths | Coherent kit UX | Random tool pile |

### GROWTH

| Domain | Intent | Gate |
| --- | --- | --- |
| traffic-bets | Measurable growth bet | Prefer 2–3 Analytics findings |
| growth-surfaces | Discovery UI | Concrete shippable UI |
| share-hooks | Shareability | Tie to real surface |
| search-magnets | SEO depth | Original text; no doorway |
| retention-loops | Return / next-step UX | Analytics when possible |
| conversion-paths | Home → value paths | Do not remove ads |
| traffic-diagnosis | Measure A/B/C | Not a product idea |
| adsense-prep | Trust gaps (temporary) | Max 5 runs; never remove Adsterra |

---

## ADSENSE-PREP (max 5 runs total)

Not a product idea. Priority: (1) About EN+ES (2) Privacy AdSense/cookies (3) Editorial depth on thin pages (4) Terms consistency (5) Other trust signals. One change per run. Never remove Adsterra. Never claim approval. Ship on fix/spanish-complete. Increment adsense-prep_runs in **state** file. On run 5 done: remove from GROWTH in state + rules.

---

## TRAFFIC-DIAGNOSIS

Measure 7d vs prior 7d. Material: site ≤ −15% WoW, top route ≤ −25%, or 4xx/5xx ≥ 2×. Classify A technical / B intentional / C external. No material → "sin alerta", no cosmetic commits. Never strip Adsterra. Spanish report + "Adsterra intacto".

---

## QUALITY BAR

Must: real interactive experience; different from RECENT_CLOSED; ≤6–8 runs; immediate visual payoff; EN+ES; next-step when required.

Anti: color-picker-only, thin calculator, AI wrapper no local interaction, duplicate routes, accounts/payments, HouseModeler3D, stripping ads.

adsense-prep: real reviewable improvement only.

Commits: `feat` / `polish` / `docs(agent)` / `fix(build)`.

---

## IDEATE idea template

```
status: active
idea: <paragraph>
id: <kebab-case>
path_en: /...
path_es: /es/...
domain: <rolled>
runs_total: <1..15>
runs_remaining: <same at IDEATE>
acceptance: pending
share: url | png | both | n/a
next_step_required: yes | no
acceptance_bullets:
  - ...
notes: <U, catalog, GROWTH: U_g urn p_fixed, weights pre→post>
adsense-prep_runs: <n>
```

Update **ideas-lab-state.md** DOMAIN WEIGHTS in same commit.

---

## POST-SHIP SMOKE CHECK

After READY on user-facing changes: open path_en + path_es; confirm shell, main surface, next-step if required. Fail → fix or honest pending. Skip for docs-only / diagnosis-only.

---

## MODE

### 0) Bootstrap
1. Deploy list fix/spanish-complete.
2. Load state → rules → ops (truncation protocol in rules file).
3. Read ACTIVE PROJECT from state.

### 1) active && runs_remaining > 0 → EXECUTE
Advance idea; one outcome; decrement runs; commit state + code; deploy; smoke if user-facing; close → update RECENT_CLOSED + last_closed in state → IDEATE same/next run.

### 2) done / runs_remaining == 0 → IDEATE
Roll (§11 rules); last_closed re-roll once; RECENT_CLOSED check; template; write state; commit. Usually no huge ship same run.

### 3) FIX-BUILD (max 2)
Logs → imports → routes → TS → next-step → SEO → never remove Adsterra. `fix(build): …`.

### EXECUTE checklist (playgrounds etc.)
Component; EN+ES routes + SEO; visual on load; share; next-step.ts; PlaygroundNextStep before Adsterra; deploy + smoke; update state.

### Weight sampling
CORE: cumulative weighted; selected→1 others+1.  
GROWTH two-urn: p_fixed; FIXED urn no weight updates; FLEX anti-starvation among non-FIXED only.

---

## Spanish summary template

Deploy; smoke; outcome; ACTIVE PROJECT fields; weights/urn if IDEATE; commits + identity; Adsterra/next-step; next step.

---

## ALWAYS

Spanish summary; correct commit identity; quality > novelty; one outcome; next-step when required; never remove Adsterra; never HouseModeler3D theater; state+rules+ops files win over automation prompt; two-urn GROWTH; truncation → re-read/split not invent.

<!-- end:ideas-lab-ops.md -->
