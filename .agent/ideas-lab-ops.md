# UtiliHub Ideas Lab — Ops (2/3)

**Part 2 of 3.** Procedures, quality bars, EXECUTE checklist. End marker required.

Load after ideas-lab.md. Files win over automation prompt.

---

## MODE

**IDEATE** — generate options, no code changes.
**EXECUTE** — implement one concrete step from state.
**REVIEW** — audit recent commits / Vercel / integrity.

---

## PRE-PUSH SELF-REVIEW

**a. Origin re-fetch + integrity**  
Never write a whole file you did not fully read in this run. For every file written: re-fetch from origin after the single push; compare bytes/lines to the intended payload.  
If it lost more than **10%** of its lines vs the previous commit, or contains `PLACEHOLDER` / `$(cat` / stub text, **revert it in the same run** (restore the previous blob exactly; never retype it).  
Never condense, summarize or "clean up" an existing file while adding to it: edits must be additive or targeted.

**b. File size**  
Report lines/bytes of every changed file before and after.

**c. Build**  
Confirm no raw `<`/`>` in JSX text and that critical paths still typecheck conceptually.

**d. Scope**  
Only the files required for the step. No drive-by refactors.

**f. JSX text**  
In JSX text never write a raw `<` or `>`; use "más de" / "menos de" (or "more than" / "less than" in EN).

Report a short **PRE-PUSH SELF-REVIEW** block in the Spanish summary (pass/fail per a–d + f).

[ ] PRE-PUSH SELF-REVIEW a–d + f passed

---

## EXECUTE checklist (abbreviated)

1. Read state + these files fully.
2. Implement the single next step.
3. Local hash-object the changed files.
4. Push once.
5. get_file_contents + compare sha.
6. Report.

---

END OF OPS
