#!/usr/bin/env bash
# Fail if the SvelteKit client bundle contains credential values or dangerous secret markers.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CLIENT_DIR="${1:-.svelte-kit/output/client}"

if [ ! -d "$CLIENT_DIR" ]; then
	echo "SKIP: client bundle not found at $CLIENT_DIR (run npm run build first)" >&2
	exit 0
fi

fail=0

# Dangerous substrings — service role and live credential prefixes (not env var names)
PATTERNS=(
	'SERVICE_ROLE'
	'postgresql://'
	'sk_live_'
	'sk_test_'
	'ghp_'
	'github_pat_'
)

for pattern in "${PATTERNS[@]}"; do
	if grep -r -l -F "$pattern" "$CLIENT_DIR" 2>/dev/null; then
		echo "ERROR: client bundle contains forbidden pattern: $pattern" >&2
		fail=1
	fi
done

# Assignment-shaped secrets in minified output (key=value), not bare env names in UI copy
if grep -r -E -l 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^"\s]+|AWS_SECRET_ACCESS_KEY\s*=\s*[^"\s]+|GHOST_CONTENT_API_KEY\s*=\s*[^"\s]+' \
	"$CLIENT_DIR" 2>/dev/null; then
	echo "ERROR: client bundle may contain hardcoded secret assignment" >&2
	fail=1
fi

# JWT-shaped credential strings
if grep -r -E -l 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.' "$CLIENT_DIR" 2>/dev/null; then
	echo "ERROR: client bundle may contain a JWT credential" >&2
	fail=1
fi

if [ "$fail" -ne 0 ]; then
	echo "Client bundle secret scan failed." >&2
	exit 1
fi

echo "OK: client bundle has no forbidden secret patterns"
