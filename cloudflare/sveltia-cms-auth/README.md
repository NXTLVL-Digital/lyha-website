# Sveltia CMS Auth Worker Notes

LYHA uses Sveltia CMS with GitHub auth for non-technical board editors.

## Deployment source

Use the official Worker project:

```text
https://github.com/sveltia/sveltia-cms-auth
```

Do not commit OAuth secrets to this repository.

## Required GitHub OAuth app values

Create a GitHub OAuth app from the account/org Jeff wants to own the integration.

- Application name: `LYHA Website CMS Auth`
- Homepage URL: `https://lyha-website.vercel.app/admin/`
- Authorization callback URL: `<WORKER_URL>/callback`

## Required Cloudflare Worker variables

Set these in Cloudflare Worker settings, not in git:

```text
GITHUB_CLIENT_ID=<from GitHub OAuth app>
GITHUB_CLIENT_SECRET=<from GitHub OAuth app, encrypted>
ALLOWED_DOMAINS=lyha-website.vercel.app, lynchburg.hockey, www.lynchburg.hockey
```

## Repo config update after deployment

After Cloudflare provides the Worker URL, update `admin/config.yml`:

```yaml
backend:
  name: github
  repo: NXTLVL-Digital/lyha-website
  branch: staging
  base_url: https://sveltia-cms-auth.<your-subdomain>.workers.dev
```

## Access control note

The OAuth worker handles login, but GitHub repository permissions still control who can write edits. Board users need access to the private repo or a dedicated low-permission team before they can save CMS changes.
