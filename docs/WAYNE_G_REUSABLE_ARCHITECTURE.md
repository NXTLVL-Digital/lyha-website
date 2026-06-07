# Wayne G. Reusable Architecture

## Decision

Keep Wayne G. inside the LYHA website repo for the first implementation, but draw the boundaries as if it will become its own reusable NXTLVL-Digital product later.

This avoids slowing down LYHA while still preventing us from hard-coding Wayne G. so tightly that he cannot be reused for future clients.

## Why not create a separate repo today?

A standalone repo is the right long-term destination, but not the best first move today because:

- LYHA still needs the fastest path to a working board-editing flow.
- We need to prove the full loop first: auth, chat, preview, approval, Git commit, rollback.
- Extracting too early creates package/version/deploy overhead before the API shape is proven.
- Client-specific rules like LYHA copy scope, board email allowlist, brand voice, and staging-first publishing should stay near the client site until the pattern is stable.

## Extraction-ready shape

Build Wayne G. as three layers:

1. **Reusable core**
   - Auth/session utilities
   - Usage tracking
   - Chat orchestration
   - Diff proposal helpers
   - Backup/restore helpers
   - GitHub commit helpers

2. **Client adapter**
   - Client name and site URL
   - Allowed emails/domains
   - Brand voice file paths
   - Editable content paths
   - Preview branch and publish branch
   - Budget caps

3. **Client UI skin**
   - Logo/name/colors
   - Admin welcome copy
   - Preview iframe target
   - Mode labels and helper text

## In-repo layout for LYHA

For the LYHA implementation, keep reusable code and client config clearly separated:

```text
cloudflare/wayne-g-auth/          # Phase 1 auth/session/usage worker
admin/                            # Future Wayne G. UI shell for LYHA
wayne-g/                          # Future shared Wayne G. app/backend code if needed
  core/                           # Extractable shared code
  adapters/lyha/                  # LYHA-specific config and rules
docs/WAYNE_G_*.md                 # Planning, system prompt, and handoff docs
brand-voice.md                    # LYHA-specific voice rules
```

Do not create a new GitHub repo until the first LYHA flow works end to end.

## Future extraction target

When LYHA is working, extract the shared pieces into a private repo such as:

```text
NXTLVL-Digital/wayne-g
```

Likely future install patterns:

- Git submodule for static/client repos that do not use a package manager.
- Private npm package if Wayne G. becomes a Node app shared across several projects.
- Template repo if each client gets a copied, customized instance.

The first extraction should happen after we have at least one complete client flow and can name the stable interface.

## Client adapter contract

Each future client should provide a small config like:

```json
{
  "clientId": "lyha",
  "clientName": "Lynchburg Youth Hockey Association",
  "adminPath": "/admin/",
  "siteUrl": "https://lyha-website.vercel.app",
  "allowedEmails": [
    "president@lynchburgyouthhockey.com",
    "vicepresident@lynchburgyouthhockey.com",
    "secretary@lynchburgyouthhockey.com",
    "treasurer@lynchburgyouthhockey.com",
    "headofcoaches@lynchburgyouthhockey.com",
    "marketing@lynchburgyouthhockey.com"
  ],
  "allowedDomains": ["liberty.edu"],
  "dailyBudgetUsd": 3,
  "weeklyBudgetUsd": 5,
  "editablePaths": ["data/**/*.json", "content/**/*.md"],
  "previewBranch": "staging",
  "publishBranch": "main"
}
```

## Guardrails

- Keep LYHA public site staging/preview-first.
- Do not let Wayne G. directly publish to production without explicit approval.
- Keep client brand voice and allowed editors out of shared core code.
- Keep secrets in Cloudflare/GitHub settings, never in git.
- Treat Git commits as the audit/restore source of truth.
