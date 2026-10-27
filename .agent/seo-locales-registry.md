# SEO Locales Registry

**Purpose:** languages beyond EN/ES that exist as **SEO-first routes** (`/{lang}/...`).  
Not linked from EN or ES primary navigation — discovery via search + hreflang/sitemap.

**Maintainer:** Ideas Lab domain `seo-locales` (and any human/agent that adds a locale).

When this domain runs or a new locale ships: update the table below **and** `src/lib/i18n/seo-locales.ts`.

When shipping a **new** playground / high-traffic page later: check `active` locales and, if capacity allows, add matching `/{lang}/...` routes (or queue under seo-locales).

---

## Priority queue (not yet active)

Order = preferred pick when domain rolls and no forced locale in ACTIVE PROJECT:

1. `pt` — Portuguese (pt-BR bias for copy) — **now active**
2. `fr` — French — **now active**
3. `de` — German
4. `ar` — Arabic (`dir=rtl` required)
5. `hi` — Hindi
6. `id` — Indonesian
7. `ja` — Japanese
8. `ko` — Korean
9. `it` — Italian
10. `nl` — Dutch

Do **not** add EN (`/` or bare) or ES (`/es`) here — those are first-class product locales with nav.

---

## Active locales

| code | BCP-47 | dir | status | prefix | pages_done (paths) | notes |
| --- | --- | --- | --- | --- | --- | --- |
| pt | pt-BR | ltr | active | /pt | /pt, /pt/pulse-catch, /pt/orbit-defender-arcade, /pt/snake, /pt/pong | hreflang wired to EN+ES; no nav from EN/ES; minimal shell; fourth experience added |
| fr | fr-FR | ltr | active | /fr | /fr, /fr/fluid-ink-flow-playground | hreflang wired; no nav from EN/ES; minimal shell; first experience added |

---

## CAP = 5 active SEO locales

EN and ES are **not** SEO locales and do not count.

- Maximum **5** rows with status `active` in the table above / in `SEO_LOCALES_ACTIVE`.
- When the 5th language is activated and registered, Ideas Lab domain `seo-locales` must be **retired**: `weights_growth.seo-locales = 0`, omit from GROWTH domain roll, note in `ideas-lab-state.md`.
- Do not open a 6th SEO locale via that domain. Further pages for the existing 5 may still be added by other work when cheap.

---

## Rules (agent)

0. If active count ≥ 5 → no new locale; retire domain (see CAP).
1. One primary locale expansion outcome per `seo-locales` run (or continue same locale until a minimal viable set exists), only while active < 5.
2. Choose next code = first in priority queue not in **Active locales**, unless ACTIVE PROJECT specifies otherwise.
3. Route prefix: `/{code}/...` (e.g. `/pt`, `/ar/river-light`). File routes follow TanStack patterns used by the repo.
4. **No** links from EN/ES header/footer/home primary nav to these locales. Optional: hreflang alternates only.
5. Full page in target language: title, description, visible UI strings, FAQ/editorial on that page — not a thin machine-only stub.
6. `lang` + `dir` on document/shell for that route tree (`ar` → rtl).
7. Register in this file + `src/lib/i18n/seo-locales.ts` same commit.
8. Adsterra: keep banners; do not remove. HouseModeler3D: do not touch.
9. Smoke: open `/{code}/...` paths shipped this run (not EN/ES).

<!-- end:seo-locales-registry.md -->
