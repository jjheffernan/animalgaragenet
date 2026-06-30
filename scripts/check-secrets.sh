#!/usr/bin/env bash
# Fail if tracked files match secret/credential patterns (run before push).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

check_tracked() {
	local label="$1"
	shift
	local matches
	matches=$(git ls-files "$@" 2>/dev/null || true)
	if [ -n "$matches" ]; then
		echo "ERROR: tracked $label:" >&2
		echo "$matches" >&2
		fail=1
	fi
}

# Env files (templates and .env.test fixture are allowed)
while IFS= read -r f; do
	case "$f" in
		.env.example | .env.test) continue ;;
		.env | .env.*) echo "ERROR: tracked env file: $f" >&2; fail=1 ;;
	esac
done < <(git ls-files '.env*' 2>/dev/null || true)

check_tracked "Supabase local state" \
	'supabase/.branches' 'supabase/.temp' 'supabase/.env' 'supabase/.env.*'

check_tracked "credential files" \
	'*.pem' '*.p12' '*.pfx' '*.key' 'credentials.json' 'service-account*.json' 'secrets.json'

check_tracked "database dumps" '*.dump' '*.sql.gz' '*.sqlite' '*.sqlite3'

# Obvious secret patterns in tracked source (skip docs and lockfiles)
if git grep -n -E 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^y\s]|AWS_SECRET_ACCESS_KEY\s*=\s*[^[:space:]]|GHOST_CONTENT_API_KEY\s*=\s*[^y\s]' \
	-- ':!*.md' ':!docs/' ':!*.example' ':!.env.test' ':!package-lock.json' 2>/dev/null; then
	echo "ERROR: possible hardcoded secret assignment in tracked files (see above)" >&2
	fail=1
fi

# Service role must not appear outside server-only paths
if git grep -n 'SUPABASE_SERVICE_ROLE_KEY' -- \
	':!src/lib/server/**' \
	':!scripts/**' \
	':!supabase/migrations/**' \
	':!*.md' ':!docs/' ':!*.example' ':!.env.test' \
	2>/dev/null; then
	echo "ERROR: SUPABASE_SERVICE_ROLE_KEY referenced outside server-only paths" >&2
	fail=1
fi

# DEV_ADMIN must not be enabled in tracked deploy config
if git grep -n -E 'DEV_ADMIN\s*=\s*true' -- \
	'netlify.toml' 'netlify.json' '.netlify/**' 'vercel.json' \
	2>/dev/null; then
	echo "ERROR: DEV_ADMIN=true in tracked deploy config" >&2
	fail=1
fi

# Scan client bundle for service role leakage when build output exists
if [ -d .svelte-kit/output/client ]; then
	if grep -r -l 'SERVICE_ROLE' .svelte-kit/output/client 2>/dev/null; then
		echo "ERROR: SERVICE_ROLE string found in client bundle" >&2
		fail=1
	fi
fi

if [ "$fail" -ne 0 ]; then
	echo "Secret/credential check failed. Fix before pushing." >&2
	exit 1
fi

echo "OK: no tracked secrets or forbidden paths"
