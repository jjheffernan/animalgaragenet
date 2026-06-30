# GitHub Wiki export

Nine developer wiki pages derived from `docs/`. Kept in-repo as a backup when the GitHub wiki is not yet enabled.

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

## Publish to GitHub Wiki (manual)

GitHub wikis use a separate git repo (`<owner>/<repo>.wiki`). If `git push` fails with **Repository not found**, enable the wiki first:

1. Open **GitHub → jjheffernan/animalgaragenet → Settings → Features**
2. Check **Wikis** → Save
3. Clone the wiki repo and copy pages:

   ```bash
   git clone https://github.com/jjheffernan/animalgaragenet.wiki.git /tmp/animalgaragenet-wiki
   cp docs/wiki-export/*.md /tmp/animalgaragenet-wiki/
   cd /tmp/animalgaragenet-wiki
   git add -A
   git commit -m "Sync wiki from docs/wiki-export"
   git push origin master   # or main, depending on default branch
   ```

4. View at `https://github.com/jjheffernan/animalgaragenet/wiki`

**Note:** GitHub wiki page titles come from filenames (hyphens become spaces). `Home.md` is the wiki landing page.
