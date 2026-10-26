#!/usr/bin/env bash
# Vercel ignoreCommand helper.
# Exit 0 → skip this deployment (no production-impacting changes).
# Exit 1 → run the build.
set -euo pipefail

# Compare against the last successful deployment when Vercel provides it.
# Do NOT fall back to HEAD^ — that skips builds when the tip is docs-only.
PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"

if [[ -z "$PREV" ]] || ! git cat-file -e "${PREV}^{commit}" 2>/dev/null; then
  # Empty var or sha not in local history (shallow clone / first deploy) → build.
  exit 1
fi

# If anything outside the excluded paths changed since last deploy → build.
# Exclusions: docs, agent state, GitHub workflows, markdown, audit-only scripts.
# IMPORTANT: do NOT exclude this file or scripts used by `npm run build`
# (write-og-png.mjs, validate-catalog.mjs).
if git diff --quiet "$PREV" HEAD -- . \
  ':(exclude)docs' \
  ':(exclude).agent' \
  ':(exclude).github' \
  ':(exclude)**/*.md' \
  ':(exclude)scripts/check-sitemap-urls.mjs' \
  ':(exclude)scripts/agent-system.mjs' \
  ':(exclude)scripts/innovator-cycle.mjs' \
  ':(exclude)scripts/self-improvement.mjs' \
  ':(exclude)scripts/validate-education-banks.mjs'
then
  # Only excluded paths changed since last deploy → skip.
  exit 0
fi

exit 1
