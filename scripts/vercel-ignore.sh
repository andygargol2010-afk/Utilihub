#!/usr/bin/env bash
# Vercel ignoreCommand helper.
# Exit 0 → skip this deployment (no production-impacting changes).
# Exit 1 → run the build.
set -euo pipefail

# First commit / shallow clone without HEAD^ → always build.
if ! git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  exit 1
fi

# If anything outside the excluded paths changed → build (exit 1).
# Exclusions: docs, agent state, GitHub workflows, markdown, audit-only scripts.
# IMPORTANT: do NOT exclude this file or scripts used by `npm run build`
# (write-og-png.mjs, validate-catalog.mjs).
if git diff --quiet HEAD^ HEAD -- . \
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
  # Only excluded paths changed → skip deploy.
  exit 0
fi

exit 1
