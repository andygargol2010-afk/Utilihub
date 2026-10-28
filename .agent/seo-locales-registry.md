# SEO Locales Registry

**Purpose:** languages beyond EN/ES as **full product surfaces** under `/{lang}/...`, not thin keyword shells.

**Maintainer:** Ideas Lab domain `seo-locales`.

**RESET 2026-10-28:** previous thin shells for `pt` / `fr` / `de` were removed. Domain starts from zero. Do not re-ship minimal homes with only 3–4 games.

When this domain runs: update this file **and** `src/lib/i18n/seo-locales.ts` in the same commit.

When EN/ES ship new high-traffic experiences later: check **Active locales** and extend `pages_done` for each active code (or queue work under seo-locales).

---

## Priority queue (not yet active)

Order = preferred pick when domain rolls:

1. `pt` — Portuguese (pt-BR bias for copy)
2. `fr` — French
3. `de` — German
4. `ar` — Arabic (`dir=rtl` required)
5. `hi` — Hindi
6. `id` — Indonesian
7. `ja` — Japanese
8. `ko` — Korean
9. `it` — Italian
10. `nl` — Dutch

Do **not** add EN or ES here — those are first-class product locales with nav.

---

## Active locales

| code | BCP-47 | dir | status | prefix | pages_done (paths) | notes |
| --- | --- | --- | --- | --- | --- | --- |
| *(none — reset 2026-10-28)* | | | | | | |

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

<!-- end:seo-locales-registry.md -->
