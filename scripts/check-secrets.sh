#!/usr/bin/env bash
# Fail if tracked files match secret/credential patterns (run before push).
#
# Env:
#   CHECK_CLIENT_BUNDLE=1  — require built client output and run scan-client-bundle.sh
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

# Hardcoded secret assignments (skip docs, examples, tests, e2e/playwright config)
if git grep -n -E \
	'SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^y#\s]|SUPABASE_ANON_KEY\s*=\s*[^y#\s]|SUPABASE_DATABASE_URL\s*=\s*postgresql://[^y]|AWS_SECRET_ACCESS_KEY\s*=\s*[^[:space:]#]|GHOST_CONTENT_API_KEY\s*=\s*[^y#\s]|YOUTUBE_SYNC_SECRET\s*=\s*[^y#\s]|ORG_REPO_DEPLOY_KEY\s*=\s*[^y#\s]' \
	-- ':!*.md' ':!docs/' ':!*.example' ':!.env.test' ':!package-lock.json' ':!scripts/github-secrets.manifest.json' \
	':!playwright.config.ts' \
	2>/dev/null; then
	echo "ERROR: possible hardcoded secret assignment in tracked files (see above)" >&2
	fail=1
fi

# High-entropy credential shapes in source (not docs)
if git grep -n -E 'sk_live_[A-Za-z0-9]+|sk_test_[A-Za-z0-9]+|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+' \
	-- ':!*.md' ':!docs/' ':!*.example' ':!package-lock.json' \
	2>/dev/null; then
	echo "ERROR: possible API key or token in tracked source (see above)" >&2
	fail=1
fi

# Server-only env names must not leak into client/shared code paths
SERVER_ONLY_VARS=(
	SUPABASE_SERVICE_ROLE_KEY
	SUPABASE_ANON_KEY
	SUPABASE_DATABASE_URL
	GHOST_CONTENT_API_KEY
	AWS_SECRET_ACCESS_KEY
	YOUTUBE_SYNC_SECRET
	SALEOR_WEBHOOK_SECRET
	ORG_REPO_DEPLOY_KEY
	SUPABASE_JWT_SECRET
)

for var in "${SERVER_ONLY_VARS[@]}"; do
	if git grep -n -F "$var" -- \
		':!src/lib/server/**' \
		':!scripts/**' \
		':!supabase/migrations/**' \
		':!.github/workflows/**' \
		':!src/routes/api/**' \
		':!tests/**' \
		':!playwright.config.ts' \
		':!*.md' ':!docs/' ':!*.example' ':!.env.test' \
		':!scripts/github-secrets.manifest.json' \
		':!src/routes/auth/sign-in/+page.svelte' \
		':!src/routes/admin/runtime/+page.svelte' \
		':!src/routes/admin/media/+page.svelte' \
		':!src/lib/config/env.ts' \
		2>/dev/null; then
		echo "ERROR: $var referenced outside server-only paths" >&2
		fail=1
	fi
done

# Private env must not be imported from client-visible modules
if git grep -n "from '\$env/dynamic/private'" -- 'src/lib/config/**' 'src/lib/stores/**' 'src/lib/components/**' \
	2>/dev/null; then
	echo "ERROR: \$env/dynamic/private imported in client-shared module" >&2
	fail=1
fi

# DEV_ADMIN must not be enabled in tracked deploy config
if git grep -n -E 'DEV_ADMIN\s*=\s*true' -- \
	'netlify.toml' 'netlify.json' '.netlify/**' 'vercel.json' \
	2>/dev/null; then
	echo "ERROR: DEV_ADMIN=true in tracked deploy config" >&2
	fail=1
fi

# Client bundle scan — required when CHECK_CLIENT_BUNDLE=1 (CI post-build)
if [ "${CHECK_CLIENT_BUNDLE:-0}" = "1" ]; then
	if [ ! -d .svelte-kit/output/client ]; then
		echo "ERROR: CHECK_CLIENT_BUNDLE=1 but .svelte-kit/output/client missing — run npm run build" >&2
		fail=1
	else
		if ! bash "$ROOT/scripts/scan-client-bundle.sh"; then
			fail=1
		fi
	fi
elif [ -d .svelte-kit/output/client ]; then
	if ! bash "$ROOT/scripts/scan-client-bundle.sh"; then
		fail=1
	fi
fi

if [ "$fail" -ne 0 ]; then
	echo "Secret/credential check failed. Fix before pushing." >&2
	exit 1
fi

echo "OK: no tracked secrets or forbidden paths"
