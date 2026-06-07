# Wayne G. Auth Worker

Cloudflare Worker foundation for Wayne G. client access control. For LYHA, this gates the future `/admin/` Wayne G. experience behind approved board/editor emails.

## Current role

This is Phase 1 infrastructure only:

- Email allowlist and approved-domain checks
- Magic-link token creation and verification
- 24-hour session cookie
- `/auth/check` session verification endpoint
- Client-specific config via `wrangler.toml` vars

It does **not** send the magic-link email yet and it does **not** implement the AI chat UI/backend yet.

## Why this is inside LYHA for now

Jeff chose to keep Wayne G. inside the LYHA repo for the first implementation, while designing it so the shared pieces can later move into a private reusable repo like `NXTLVL-Digital/wayne-g`.

See:

- `../../docs/WAYNE_G_IMPLEMENTATION_PLAN.md`
- `../../docs/WAYNE_G_REUSABLE_ARCHITECTURE.md`

## Config vars

Set these in `wrangler.toml` or Cloudflare dashboard vars:

```toml
CLIENT_ID = "lyha"
CLIENT_NAME = "Lynchburg Youth Hockey Association"
ADMIN_REDIRECT_PATH = "/admin/"
SESSION_COOKIE_NAME = "wayne_g_lyha_session"
ALLOWED_EMAILS = "president@lynchburgyouthhockey.com,..."
ALLOWED_DOMAINS = "liberty.edu"
```

## KV binding

Create or verify the KV namespace, then set the ID in `wrangler.toml`:

```bash
npx wrangler kv namespace create AUTH_KV
```

Binding expected by the worker:

```toml
[[kv_namespaces]]
binding = "AUTH_KV"
id = "..."
```

## Local/syntax verification

From this directory:

```bash
node --check src/index.js
npx wrangler deploy --dry-run --outdir /tmp/wayne-g-auth-dry-run
```

## Deploy

Requires Cloudflare Wrangler auth:

```bash
npx wrangler whoami
npx wrangler deploy
```

Current known blocker: Wrangler is not authenticated on this Mac yet.

## Endpoints

- `GET /` returns worker status JSON
- `POST /auth/request` with `{ "email": "..." }` returns a temporary magic link for internal testing
- `GET /auth/verify?token=...` consumes the token, sets a session cookie, and redirects to `/admin/`
- `GET /auth/check` returns session status JSON

## Production gaps before board testing

- Wire transactional email delivery instead of returning magic links in JSON.
- Add usage tracking counters for daily and weekly budget limits.
- Connect `/admin/` to the Wayne G. UI instead of the older Sveltia admin flow.
- Keep all secrets in Cloudflare, not in git.
