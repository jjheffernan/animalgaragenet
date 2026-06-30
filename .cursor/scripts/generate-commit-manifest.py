#!/usr/bin/env python3
"""Regenerate .cursor/commit-manifest.json from current git status."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

RULES: list[tuple[str, str, callable]] = [
    (
        "01-mock-data-layout",
        "Restructure mock data into mock/ subdirectory.",
        lambda p: p.startswith("src/lib/data/mock/") and not p.endswith(".test.ts"),
    ),
    (
        "02-deps-and-tooling",
        "Add Supabase, Vitest, Playwright, and test scripts.",
        lambda p: p
        in (
            "package.json",
            "package-lock.json",
            "vite.config.ts",
            "playwright.config.ts",
            "skills-lock.json",
        ),
    ),
    (
        "05-types-and-i18n",
        "Extend domain types and currency formatting tests.",
        lambda p: p.startswith("src/lib/types/")
        or p.startswith("src/lib/i18n/")
        or p == "src/lib/data/garage-levels.ts",
    ),
    (
        "09-cookies-consent",
        "Add cookie helpers, consent bar, and promo persistence.",
        lambda p: any(
            p.startswith(x)
            for x in [
                "src/lib/cookies",
                "src/lib/server/cookies",
                "src/lib/components/CookieConsent",
                "docs/commerce/cookies.md",
            ]
        )
        or p.endswith("promo.svelte.ts"),
    ),
    (
        "04-catalog-lib",
        "Add catalog helpers, ribbon tokens, and server catalog layer.",
        lambda p: any(
            p.startswith(x)
            for x in ["src/lib/data/catalog-helpers", "src/lib/ui/", "src/lib/server/catalog/"]
        ),
    ),
    (
        "03-pagination-and-filters",
        "Add pagination, list controls, and parts filter helpers.",
        lambda p: any(
            p.startswith(x)
            for x in ["src/lib/pagination", "src/lib/data/parts-filters", "src/lib/components/ListControls"]
        ),
    ),
    (
        "06-supabase-auth",
        "Wire Supabase SSR auth, OAuth providers, and session hooks.",
        lambda p: any(
            p.startswith(x)
            for x in [
                "src/lib/auth/",
                "src/lib/supabase/",
                "src/lib/server/supabase/",
                "src/hooks.server.ts",
                "src/app.d.ts",
                "src/lib/components/OAuthButton",
                "docs/auth/",
                "docs/integrations/supabase.md",
            ]
        ),
    ),
    (
        "07-saleor-integration",
        "Add Saleor checkout, channels, mappers, and metadata.",
        lambda p: p.startswith("src/lib/server/saleor/")
        or p in ("docs/commerce/saleor.md", "docs/audits/saleor-audit.md"),
    ),
    (
        "08-ghost-cms",
        "Add Ghost CMS client and blog/guide mappers.",
        lambda p: p.startswith("src/lib/server/ghost/") or p.startswith("docs/content/ghost"),
    ),
    (
        "13-shared-components",
        "Add catalog ribbons, nav sections, drawers, and media components.",
        lambda p: p.startswith("src/lib/components/")
        and not any(
            x in p
            for x in [
                "OAuthButton",
                "CookieConsent",
                "Testimonial",
                "AuthGateDialog",
                "BuildLogForm",
                "ListControls",
                "CartActions",
            ]
        ),
    ),
    (
        "10-testimonials-loyalty",
        "Add testimonials repository, loyalty gate, and Supabase migration.",
        lambda p: any(
            p.startswith(x)
            for x in [
                "src/lib/server/testimonials/",
                "src/lib/components/Testimonial",
                "src/lib/components/AuthGateDialog",
                "src/routes/loyalty/+page.server.ts",
                "src/routes/admin/testimonials/",
                "supabase/",
            ]
        ),
    ),
    (
        "11-build-logs",
        "Add build log submissions and admin moderation.",
        lambda p: any(
            p.startswith(x)
            for x in [
                "src/lib/server/build-logs/",
                "src/lib/types/build-log",
                "src/lib/components/BuildLogForm",
                "src/routes/builds/submit/+page.server.ts",
                "src/routes/admin/builds/",
                "src/routes/account/builds/",
                "docs/content/build-submissions.md",
            ]
        ),
    ),
    (
        "14-admin-shell",
        "Expand admin nav, sidebar, and topbar.",
        lambda p: p.startswith("src/lib/admin/")
        or p.startswith("src/lib/components/admin/")
        or (p.startswith("src/routes/admin/") and "testimonials" not in p and "builds" not in p),
    ),
    (
        "15-parts-experience",
        "Add parts layout, ribbon, mega-menu sections, and PDP routes.",
        lambda p: p.startswith("src/routes/parts/")
        or any(
            x in p
            for x in [
                "PartsShoppingRibbon",
                "PartsNavSections",
                "PartCategoryNav",
                "CatalogRibbonShell",
                "CategoryPill",
                "catalog-ribbons.md",
            ]
        ),
    ),
    (
        "12-checkout-cart",
        "Add Saleor checkout flow and cart server actions.",
        lambda p: any(p.startswith(x) for x in ["src/lib/types/checkout", "src/routes/cart/", "src/lib/components/CartActions"])
        or p.endswith("cart.test.ts")
        or p.endswith("cart.svelte.ts"),
    ),
    (
        "16-routes-core",
        "Update shop, watch, media, builds, and homepage routes.",
        lambda p: p.startswith("src/routes/")
        and not any(
            p.startswith(x)
            for x in [
                "src/routes/parts/",
                "src/routes/cart/",
                "src/routes/loyalty/+page.server",
                "src/routes/admin/",
                "src/routes/account/builds/",
                "src/routes/builds/submit/+page.server",
                "src/routes/api/",
            ]
        ),
    ),
    (
        "17-api-routes",
        "Add API routes for webhooks and sync.",
        lambda p: p.startswith("src/routes/api/"),
    ),
    (
        "18-layout-stores",
        "Update root layout, header, footer, stores, and config.",
        lambda p: any(
            p.startswith(x)
            for x in [
                "src/routes/+layout",
                "src/routes/+page",
                "src/lib/stores/",
                "src/lib/config/",
                "src/lib/index.ts",
                "src/lib/server/forms/",
                "src/lib/server/youtube/",
                ".env.example",
                ".gitignore",
                ".github/",
            ]
        ),
    ),
    (
        "19-unit-tests",
        "Add Vitest coverage for lib and server modules.",
        lambda p: p.endswith(".test.ts") or p.startswith("tests/"),
    ),
    (
        "20-e2e-ci",
        "Add Playwright smoke tests and CI workflow.",
        lambda p: p.startswith("e2e/"),
    ),
    (
        "21-docs",
        "Add integration audits, style guide, and planning docs.",
        lambda p: p.startswith("docs/"),
    ),
    (
        "22-agent-tooling",
        "Add Cursor agents, skills, and commit orchestration.",
        lambda p: any(p.startswith(x) for x in [".cursor/", ".agents/", "agents/"])
        or p.endswith("settings.json"),
    ),
]

DEPENDS: dict[str, list[str]] = {
    "01-mock-data-layout": [],
    "02-deps-and-tooling": [],
    "05-types-and-i18n": [],
    "09-cookies-consent": [],
    "04-catalog-lib": ["01-mock-data-layout"],
    "03-pagination-and-filters": ["01-mock-data-layout", "02-deps-and-tooling"],
    "06-supabase-auth": ["02-deps-and-tooling"],
    "07-saleor-integration": ["02-deps-and-tooling", "05-types-and-i18n"],
    "08-ghost-cms": ["02-deps-and-tooling"],
    "13-shared-components": ["04-catalog-lib"],
    "10-testimonials-loyalty": ["06-supabase-auth"],
    "11-build-logs": ["06-supabase-auth"],
    "14-admin-shell": ["06-supabase-auth"],
    "15-parts-experience": ["04-catalog-lib", "13-shared-components"],
    "12-checkout-cart": ["07-saleor-integration", "13-shared-components"],
    "16-routes-core": ["13-shared-components"],
    "17-api-routes": ["06-supabase-auth"],
    "18-layout-stores": ["09-cookies-consent", "13-shared-components"],
    "19-unit-tests": ["16-routes-core"],
    "20-e2e-ci": ["02-deps-and-tooling"],
    "21-docs": [],
    "22-agent-tooling": [],
}


def git_paths() -> list[str]:
    out = subprocess.check_output(["git", "status", "--short"], cwd=ROOT, text=True).strip().split("\n")
    paths: list[str] = []
    for line in out:
        if not line.strip():
            continue
        p = line[2:].strip()
        if " -> " in p:
            p = p.split(" -> ")[1]
        paths.append(p)
    return paths


def main() -> None:
    paths = git_paths()
    batches_map = {bid: [] for bid, _, _ in RULES}
    assigned: dict[str, str] = {}

    for p in sorted(paths):
        for bid, _, fn in RULES:
            if fn(p):
                batches_map[bid].append(p)
                assigned[p] = bid
                break

    unassigned = [p for p in paths if p not in assigned]
    if unassigned:
        raise SystemExit(f"Unassigned paths: {unassigned}")

    manifest = {
        "baseBranch": "dev",
        "strategy": "sequential-commits",
        "totalPaths": len(paths),
        "batches": [],
    }

    for bid, msg, _ in RULES:
        batch_paths = batches_map[bid]
        if not batch_paths:
            continue
        manifest["batches"].append(
            {
                "id": bid,
                "status": "pending",
                "message": msg,
                "dependsOn": DEPENDS.get(bid, []),
                "paths": batch_paths,
            }
        )

    extras = [
        ".cursor/commit-manifest.json",
        ".cursor/commit-progress.json",
        ".cursor/agents/git-commit-orchestrator.md",
        ".cursor/scripts/generate-commit-manifest.py",
    ]
    if manifest["batches"]:
        for extra in extras:
            if extra not in manifest["batches"][-1]["paths"]:
                manifest["batches"][-1]["paths"].append(extra)

    out = ROOT / ".cursor" / "commit-manifest.json"
    out.write_text(json.dumps(manifest, indent="\t") + "\n", encoding="utf-8")
    print(f"Wrote {out} — {len(manifest['batches'])} batches, {len(paths)} paths")


if __name__ == "__main__":
    main()
