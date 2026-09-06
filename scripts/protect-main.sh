#!/usr/bin/env bash
set -euo pipefail

OWNER="andygargol2010-afk"
REPO="Utilihub"
BRANCH="main"
REQUIRED_CHECKS=("build" "Audit and validate")
APPLY=false

usage() {
  cat <<'USAGE'
Usage: scripts/protect-main.sh [--apply]

Default: print the protection payload without changing GitHub.
--apply: apply protection to andygargol2010-afk/Utilihub:main.

Requires: gh authenticated with repository administration permission.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=true ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage >&2; exit 2 ;;
  esac
done

command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 1; }
gh auth status >/dev/null

contexts_json="$(printf '%s\n' "${REQUIRED_CHECKS[@]}" | jq -R -s 'split("\n") | map(select(length > 0))')"
payload="$(jq -n --argjson contexts "$contexts_json" '{
  required_status_checks: {
    strict: true,
    contexts: $contexts
  },
  enforce_admins: true,
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    required_approving_review_count: 1,
    require_last_push_approval: true
  },
  restrictions: null,
  required_linear_history: false,
  allow_force_pushes: false,
  allow_deletions: false,
  block_creations: false,
  required_conversation_resolution: true
}')"

if ! $APPLY; then
  echo "DRY RUN: no GitHub changes made." >&2
  echo "$payload" | jq .
  exit 0
fi

echo "Applying protection to ${OWNER}/${REPO}:${BRANCH}..." >&2
gh api --method PUT "repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  --input <(printf '%s' "$payload") \
  --header 'Accept: application/vnd.github+json' \
  --header 'X-GitHub-Api-Version: 2022-11-28' \
  --silent | jq '{url, required_status_checks, enforce_admins, required_pull_request_reviews, allow_force_pushes, allow_deletions, required_conversation_resolution}'
