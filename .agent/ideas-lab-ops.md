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
| **seo-locales** | New `/{lang}/` route trees for high-spoken languages; SEO-only (no EN/ES nav) | Registry + hreflang; quality translation |

---

## SEO-LOCALES (procedure when domain rolls)

Not a canvas playground. Goal = **search-discoverable** full pages in another language.

1. Read `.agent/seo-locales-registry.md` + `src/lib/i18n/seo-locales.ts`.
2. Pick locale: first code in priority queue not yet **active**, unless ACTIVE PROJECT already fixed one.
3. Scope (one outcome per run): e.g. locale home `/{code}` + 1 high-value experience **or** deepen pages for an already-active locale. Prefer complete quality over translating the entire site in one run.
4. Implement routes under prefix `/{code}/...` with `lang` / `dir` (Arabic → rtl).
5. Real translation of visible copy + title/description (not empty shells).
6. hreflang / alternates to EN+ES counterparts where equivalent pages exist; sitemap entries if the project uses a central sitemap.
7. **Do not** add header/footer/home nav entries from EN or ES pointing to these locales.
8. Update registry table + `SEO_LOCALES_ACTIVE` in same commit.
9. Deploy + smoke on `/{code}/...` paths. Spanish summary of locale chosen and paths shipped.
10. runs_total typically 3–6 for a first locale beachhead; 1–3 for incremental pages.

---

## ADSENSE-PREP (max 5 runs total)

Priority: About → Privacy → editorial depth → Terms → trust. One change/run. Never remove Adsterra. Track adsense-prep_runs in state.

---

## TRAFFIC-DIAGNOSIS

Measure 7d vs prior; thresholds −15% site / −25% route / 2× errors. A/B/C. Never strip Adsterra. Spanish report.

---

## QUALITY BAR

Product ideas: interactive, ≠ RECENT_CLOSED, ≤6–8 runs, visual payoff, EN+ES, next-step when required.

**seo-locales** exempt from canvas quality bar; must be real translated pages + registry update + no EN/ES nav pollution.

adsense-prep / traffic-diagnosis: as their sections.

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
runs_total: <1..15>
runs_remaining: <same at IDEATE>
acceptance: pending
share: url | png | both | n/a
next_step_required: yes | no
notes: <roll math + locale if seo-locales>
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

Weight sampling: CORE cumulative; GROWTH two-urn (seo-locales in FLEX only).

---

## Spanish summary template

Deploy; smoke; outcome; ACTIVE PROJECT; locale/registry if seo-locales; commits; Adsterra; next step.

---

## ALWAYS

Spanish summary; correct identity; quality > novelty; one outcome; next-step when required; never remove Adsterra; files win over automation prompt; two-urn GROWTH; truncation → re-read not invent; seo-locales → registry sync + no EN/ES nav links.

<!-- end:ideas-lab-ops.md -->
