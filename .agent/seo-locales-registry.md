# SEO Locales Registry

**Purpose:** languages beyond EN/ES as **full product surfaces** under `/{lang}/...`, not thin keyword shells.

**Maintainer:** Ideas Lab domain `seo-locales`.

**RESET 2026-10-28:** previous thin shells for `pt` / `fr` / `de` were removed. Domain starts from zero. Do not re-ship minimal homes with only 3–4 games.

When this domain runs: update this file **and** `src/lib/i18n/seo-locales.ts` in the same commit.

When EN/ES ship new high-traffic experiences later: check **Active locales** and extend `pages_done` for each active code (or queue work under seo-locales).

---

## Priority queue (not yet active)

Order = preferred pick when domain rolls:

1. `fr` — French
2. `de` — German
3. `ar` — Arabic (`dir=rtl` required)
4. `hi` — Hindi
5. `id` — Indonesian
6. `ja` — Japanese
7. `ko` — Korean
8. `it` — Italian
9. `nl` — Dutch

Do **not** add EN or ES here — those are first-class product locales with nav.

---

## Active locales

| code | BCP-47 | dir | status | prefix | pages_done (paths) | notes |
| --- | --- | --- | --- | --- | --- | --- |
| pt | pt-BR | ltr | active | /pt | /pt/, /pt/ferramentas, /pt/jogos, /pt/simuladores, /pt/privacidade, /pt/cookies, /pt/contato, /pt/sobre, /pt/playgrounds, /pt/kits, /pt/jornadas, /pt/kit-circuito-simples, /pt/simulador-dinamica-populacional, /pt/jogos/$slug, /pt/kit-aviao-papel + dynamic games | Full parity bar met after 12 runs. Home + hubs + experiences + legal + hreflang. |

---

## Parity bar (definition of “active”)

A locale may be marked `active` only when it has **at least**:

1. Locale home matching current EN/ES home structure (hero, value props, experience rail / featured, not a stub).
2. Tools hub (or equivalent catalog entry points) in that language.
3. Games + simulators index (or shared catalog routes with locale UI strings).
4. All high-traffic experiences already on EN that the project scoped (list in `pages_done`).
5. `lang` + `dir`, hreflang alternates, sitemap entries.
6. Design parity with current EN shell (not a frozen old minimal template).

Thin shells (home + 4 games only) are **forbidden**.

---

## CAP = 5 active SEO locales

EN and ES do not count.

- Max **5** rows with status `active`.
- When the 5th language meets the parity bar and is registered, retire domain weight: `weights_growth.seo-locales = 0`.
- Further pages for existing actives may still be added when EN grows.

---

## Rules (agent)

0. If active count ≥ 5 → no new locale; retire domain weight.
1. **One locale at a time.** Continue the same locale across runs until the parity bar is met (or project is closed intentionally).
2. **`runs_total` must be ≥ 11** for any new `seo-locales` project (hard minimum). Global Ideas Lab max-6 does **not** apply to this domain.
3. Choose next code = first in priority queue not in **Active locales**, unless ACTIVE PROJECT forces one.
4. Route prefix: `/{code}/...`. Follow existing TanStack file-route patterns.
5. **No** primary-nav links from EN/ES to these locales. hreflang + sitemap only.
6. Full UI strings in the target language for every shipped page — no thin machine stubs.
7. Register in this file + `src/lib/i18n/seo-locales.ts` same commit when activating.
8. Adsterra: keep. HouseModeler3D: do not touch.
9. Keep `pages_done` accurate so later runs can update existing locales when the rest of the site moves forward.
10. After EN/ES design or catalog changes: prefer **updating** active locales over inventing new thin pages.

## Definition of done — new or updated locale (added 2026-11-06, Tarea 24; lessons from the /pt fix 7fd39fea)

Mandatory before marking a locale `active` **or** closing a `seo-locales` project. If any item fails, the locale stays `in-progress` and the project stays open.

**(A) Checklist**
1. Header and footer COMPLETE, with the same nav as EN (`SiteHeader`/`SiteFooter`). **Forbidden:** `*MinimalHeader` / `*MinimalFooter` or any header without `<nav>` (pt shipped with 0 nav links until 7fd39fea).
2. Language picker includes the new locale on EN, on ES and on the new locale; each option uses that page's hreflang target.
3. Every visible string translated, including strings that come from catalogs (games, simulators, playgrounds, kits, studios, featured tools), category/tag labels, buttons, FAQ, meta title/description, og:title/og:description, img alt, aria-label and PNG/share texts. Catalog strings live in small modules `src/lib/i18n/<locale>-*.ts` with fallback to EN (pattern: pt-games.ts, pt-simulators.ts, pt-featured.ts, pt-site-chrome.ts).
4. hreflang reciprocal EN ↔ ES ↔ new + `x-default`, only to routes that exist (verify the real route file, e.g. es.acerca.tsx, never guess slugs like /es/sobre or /es/contato).
5. Internal links on locale pages point to locale routes that exist, or to EN when there is no locale version (no invented /<code>/categoria/*, /<code>/ferramentas/<slug>).
6. sitemap: every `<loc>` and every `xhtml:link` alternate returns 200 (scripts/check-sitemap-links.mjs, postbuild).
7. JSON-LD with the correct `inLanguage` (BCP-47) on every locale page; `<html lang>` and `dir` correct.

**(B) Work order:** 1) shared chrome (header, footer, language picker, catalog strings in `src/lib/i18n/<locale>-*.ts`) → 2) hubs (home, tools, games, simulators, playgrounds, kits, journeys) → 3) product pages. Do not ship product pages while the chrome or hubs still fail (A).

**(C) Gate every run:** `node scripts/check-locale.mjs --locale=<code>` (generic version of check-pt-locale.mjs) **and** `node scripts/check-sitemap-links.mjs` (also runs as postbuild). If either fails: no product push; fix it in the same run or record the run as FIX with the failing output.

**(D) No restores from memory:** never "restore" sitemap, state files or catalogs (`src/routes/sitemap[.]xml.tsx`, `.agent/*-state.md`, `src/lib/games/catalog*.ts`) from model memory. Restore ONLY from the immediately previous commit (`git show <sha>^:<path>`), re-apply the minimal change, and write the SHA used in the run summary. (Past damage: 97c20838/abeea9e2/151b3a9c broke pt alternates; 424da00b, f1342c63, 4f7b89e8 emptied the games catalog.)

**(E) Copy into the run summary (one [x]/[ ] per item of (A)):**
```
[ ] header+footer full nav (no Minimal*)   [ ] picker EN/ES/<code> on all three
[ ] all visible + catalog strings translated (meta, og, alt, FAQ, buttons, share)
[ ] hreflang reciprocal + x-default to existing routes   [ ] internal links 200
[ ] sitemap loc+alternates 200   [ ] JSON-LD inLanguage + html lang/dir
[ ] check-locale --locale=<code> PASS (paste last 2 lines)   [ ] check-sitemap-links PASS
```

<!-- end:seo-locales-registry.md -->
