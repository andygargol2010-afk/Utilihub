# UtiliHub Ideas Lab — Ops

Procedures, definition of done, and run checklist. Load after `ideas-lab.md` and state.

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## ONE COMMIT PER RUN

- Code + state in a **single** `push_files` / commit.
- **Never** a state-only commit (except CLOSE, if applicable).
- If nothing user-visible changed: **no push** — keep the run log in the final reply.

## NO DEPLOYS

- Never `create_deployment`, deploy hooks, or Vercel deploy APIs.
- Post-ship smoke is replaced by **PRE-PUSH SELF-REVIEW**.

## PRE-PUSH SELF-REVIEW (mandatory — report in Spanish summary)

Before finishing the run, complete and report:

**a. Origin re-fetch + integrity**  
Never write a whole file you did not fully read in this run. For every file written: re-fetch from origin after the single push; compare bytes/lines to the intended payload.  
If it lost more than **10%** of its lines vs the previous commit, or contains `PLACEHOLDER` / `$(cat` / stub text, **revert it in the same run**.  
To restore an old version, **reuse its blob SHA via the Git Data API** instead of retyping it.

**b. File size**  
Never write a file **> 40 KB** in full via the API. For larger files: targeted edits only, or split modules.

**c. Catalog / registry hygiene**  
Do **not** rewrite `registry.tsx` or `registry-entries-*.ts`.  
If touching catalog at all: search `GENERAL_TOOLS` / `src/lib/general/index.ts` for the slug first — **no duplicate slugs**. Prefer non-catalog surfaces (routes under playgrounds/games/guides).

**d. TypeScript sanity**  
Every import path exists; every exported symbol used exists. No dangling imports.

**f. JSX text**  
In JSX text never write a raw `<` or `>`; use "más de" / "menos de" (or "more than" / "less than" in EN).

Report a short **PRE-PUSH SELF-REVIEW** block in the Spanish summary (pass/fail per a–d + f).

---

## IDEATE — IDEA QUALITY RUBRIC

Generate **3 candidate ideas**. Score each **1–5** on:

1. **User value / fun**
2. **Shareability** (screenshot-worthy moment)
3. **Search demand** (real query people type; GSC or keyword logic)
4. **Distinctiveness** vs existing UtiliHub surfaces (**list the 3 closest**)
5. **Feasibility** in the run budget (default 4 / max 6)
6. **Performance cost** (bundle, main-thread, mobile)

Pick the best **total**. Write scores in state.  
**Reject** any idea scoring **<3** on value or distinctiveness.

---

## PROJECT SIZE

- Default **4** runs, max **6**.
- If a project cannot show a working, playable/useful **core by run 2**, cut it down or abandon.
- Polish-only runs (colors, particle tweaks): **at most 1 per project**.

---

## QUALITY-LIFT

- Prefer the surface with the **weakest engagement / oldest update** (not uniform random).
- Before run 1 of a lift: write **3 concrete measurable improvements** in state ("elevated bar").

---

## SEARCH-MAGNET GUIDES

- Must target a **real query** (GSC or keyword logic).
- Include original examples/visuals and a **link to the tool/playground**.
- No thin text.

---

## DEFINITION OF DONE (EXECUTE)

1. One **user-visible** outcome as an acceptance test: "user does X, sees Y".
2. **EN + ES** strings.
3. **Mobile** considered (390px).
4. No new console errors expected.
5. Interactive UI **lazy-loaded** where appropriate.
6. **Single commit** (code + state) after PRE-PUSH SELF-REVIEW.
7. Adsterra / ads kill switch **untouched**.
8. **HouseModeler3D.tsx** not modified.

---

## EXECUTE CHECKLIST

```
[ ] State loaded; project within size limits
[ ] Acceptance test written (user does X, sees Y)
[ ] EN + ES strings
[ ] Mobile 390px considered
[ ] Lazy-load interactive / heavy UI
[ ] PRE-PUSH SELF-REVIEW a–d + f passed
[ ] Single commit (code + state) OR no push
[ ] Spanish summary with scores / acceptance / PRE-PUSH block
```

---

## Spanish summary template

```
Modo: IDEATE|EXECUTE|CLOSE
Idea / aceptación: …
Scores (si IDEATE): …
Cambios: …
PRE-PUSH SELF-REVIEW: a=… b=… c=… d=… f=…
Commit: <SHA>|ninguno
Ads / HouseModeler3D / registry: intactos
```

<!-- end:ideas-lab-ops.md -->
