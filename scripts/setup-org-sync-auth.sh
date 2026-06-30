#!/usr/bin/env bash
# Setup auth for mirroring jjheffernan/animalgaragenet main → heff-industries/animalgaragenet
#
# GitHub cannot create fine-grained PATs via API. Use pat-url, then store the token.
# Deploy keys cannot push .github/workflows changes — PAT is required for full sync.

set -euo pipefail

PERSONAL_REPO="jjheffernan/animalgaragenet"
ORG_REPO="heff-industries/animalgaragenet"

# Pre-filled fine-grained PAT: heff-industries → animalgaragenet only
PAT_URL="https://github.com/settings/personal-access-tokens/new?name=Org+main+sync&description=Mirror+main+to+heff-industries%2Fanimalgaragenet&target_name=heff-industries&expires_in=366&contents=write&actions=write&metadata=read"

usage() {
  cat <<EOF
Usage: $(basename "$0") [pat-url|store-token]

  pat-url      Print PAT creation URL (select repository: animalgaragenet only)
  store-token  Store token from stdin as ORG_REPO_SYNC_TOKEN on $PERSONAL_REPO

After creating the PAT in GitHub:
  gh secret set ORG_REPO_SYNC_TOKEN --repo $PERSONAL_REPO

EOF
}

print_pat_url() {
  echo "1. Open this URL and create the token (select only animalgaragenet):"
  echo "$PAT_URL"
  echo
  echo "2. Required permissions (pre-filled): Contents write, Actions write, Metadata read"
  echo
  echo "3. Store the token:"
  echo "   gh secret set ORG_REPO_SYNC_TOKEN --repo $PERSONAL_REPO"
  echo
  echo "4. Test sync:"
  echo "   gh workflow run sync-org-main.yml --repo $PERSONAL_REPO"
}

store_token() {
  command -v gh >/dev/null || { echo "gh CLI required"; exit 1; }
  echo "Paste PAT (hidden), then Enter:"
  read -rs TOKEN
  echo
  if [ -z "$TOKEN" ]; then
    echo "Empty token"; exit 1
  fi
  printf '%s' "$TOKEN" | gh secret set ORG_REPO_SYNC_TOKEN --repo "$PERSONAL_REPO"
  echo "Stored ORG_REPO_SYNC_TOKEN on $PERSONAL_REPO"
}

case "${1:-pat-url}" in
  pat-url) print_pat_url ;;
  store-token) store_token ;;
  -h|--help|help) usage ;;
  *) usage; exit 1 ;;
esac
