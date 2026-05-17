# LYHA CMS Setup

The LYHA CMS is part of Phase 1 so board members can make launch-critical updates before the public site goes live.

## What is included

- `/admin/index.html` loads Sveltia CMS from the official CDN.
- `admin/config.yml` uses `publish_mode: editorial_workflow` so edits can be reviewed before they are published into `staging`.
- `data/*.json` holds the first board-editable content areas:
  - site settings
  - board members
  - FAQ items
  - calendar metadata
  - bylaws metadata
- `assets/uploads/` is the upload target for images and PDFs.

## Auth status

The repo-side CMS shell is ready. Remote sign-in for non-technical board members still needs the Cloudflare Worker OAuth service.

Target auth stack:

- Cloudflare Worker deployed from `sveltia/sveltia-cms-auth`
- GitHub OAuth app callback: `<WORKER_URL>/callback`
- Worker environment variables:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `ALLOWED_DOMAINS`

Suggested `ALLOWED_DOMAINS` while testing:

```text
lyha-website.vercel.app, lynchburg.hockey, www.lynchburg.hockey
```

After the Worker is deployed, update `/admin/config.yml`:

```yaml
backend:
  name: github
  repo: NXTLVL-Digital/lyha-website
  branch: staging
  base_url: https://sveltia-cms-auth.<your-subdomain>.workers.dev
```

## Board access checklist

1. Confirm which board members need access first.
2. Confirm they have GitHub accounts or create the simplest acceptable invite path.
3. Give those users access to the private repo, ideally through a limited GitHub team.
4. Deploy the Cloudflare Worker auth service.
5. Register the GitHub OAuth app with callback `<WORKER_URL>/callback`.
6. Set Worker environment variables.
7. Add `base_url` to `/admin/config.yml`.
8. Visit `/admin/` on the Vercel staging deployment.
9. Sign in with GitHub.
10. Edit a test value in `data/site.json`.
11. Confirm the CMS commit appears in GitHub and Vercel redeploys.

## Important limitation of this first pass

The CMS editor and data files are in place. Public pages still need to be wired to read the JSON data where board-edited content should appear. Keep that wiring small and targeted so Phase 1 stays static and simple.
