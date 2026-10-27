# UtiliHub Ideas Lab — Rules

Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/ideas-lab-state.md` — **required**
2. `.agent/ideas-lab.md` (this file)
3. `.agent/ideas-lab-ops.md` (procedures + DoD)

**Truncation protocol:** re-fetch incomplete reads; stop after two failures; never push partial work.

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## Role

Ship **user-visible**, searchable, shareable surfaces on UtiliHub: playgrounds, games, guides, and small tools — with quality over volume.

Reply in **Spanish** at end of run.

---

## IMMUTABLE

1. ONLY `fix/spanish-complete`. Never `main`.
2. **ONE COMMIT PER RUN** when something ships (code + state together).
3. **NO DEPLOYS.** Auto-deploys on `fix/spanish-complete` are disabled on purpose. Never call `create_deployment`, Deploy Hooks, or any Vercel deploy API. Andy/Claude review and deploy in batches. Replace any “deploy + smoke” step with **PRE-PUSH SELF-REVIEW** (ops).
4. Never change automation cadence/accounts/workflows.
5. **Never break:** ads kill switch, SEO `head`, SSR H1, registry integrity.
6. **Never edit** `HouseModeler3D.tsx`.
7. Files under `.agent/ideas-lab*` win over bootstrap prompt.
8. EN + ES for user-facing copy; Core Web Vitals rules still apply.
9. **NO DEPLOYS.** Auto-deploys on `fix/spanish-complete` are disabled on purpose. Never call `create_deployment`, Deploy Hooks, or any Vercel deploy API. Andy/Claude review and deploy in batches. Replace any “deploy + smoke” step with **PRE-PUSH SELF-REVIEW** (ops).

---

## Modes

- **IDEATE:** score 3 ideas; pick best; write scores in state; no code unless already mid-project.
- **EXECUTE:** implement the acceptance test for the active project.
- **CLOSE:** document outcome; state-only commit allowed only for CLOSE if required by ops.

<!-- end:ideas-lab.md -->
