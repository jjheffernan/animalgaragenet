# GitHub Wiki export

Nine developer wiki pages derived from `docs/`. Kept in-repo as the source of truth for wiki content.

**Live wiki:** https://github.com/jjheffernan/animalgaragenet/wiki (published 2026-06-30)

## Pages

| File | Wiki title |
|------|------------|
| `Home.md` | Home |
| `Getting-Started.md` | Getting Started |
| `Environment-Variables.md` | Environment Variables |
| `Authentication.md` | Authentication |
| `Editing-the-Site.md` | Editing the Site |
| `Saleor-Integration.md` | Saleor Integration |
| `Supabase.md` | Supabase |
| `Deployment-and-CI.md` | Deployment and CI |
| `Testing.md` | Testing |

## Re-sync after doc changes

```bash
git clone https://github.com/jjheffernan/animalgaragenet.wiki.git /tmp/animalgaragenet-wiki
cp docs/wiki-export/*.md /tmp/animalgaragenet-wiki/
# Exclude this README from wiki pages
rm -f /tmp/animalgaragenet-wiki/README.md
cd /tmp/animalgaragenet-wiki
git add -A
git commit -m "Sync wiki from docs/wiki-export"
git push origin master
```

GitHub wiki page titles come from filenames (hyphens become spaces). `Home.md` is the wiki landing page.
