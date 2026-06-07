# Wayne G. Implementation Plan

**Project:** LYHA Admin Chat Assistant  
**Agent Name:** Wayne G.  
**Powered by:** NXTLVL-Digital AI  
**Current decision:** Keep Wayne G. inside the LYHA repo for the first client implementation, but design clean boundaries so the reusable core can be extracted into a future private `NXTLVL-Digital/wayne-g` repo.

## Goal

Replace the traditional CMS requirement with a friendly, gated AI chat interface that lets authorized board members request copy changes in natural language. Changes must be previewable, brand-voice compliant by default, support Verbatim mode, require explicit approval, commit to GitHub, and preserve a 30-day restore path.

## Key constraints

- Email allowlist for LYHA board addresses, with optional approved domain support.
- $3/day and $5/week usage caps for budget discipline.
- Copy-only edits on day one.
- Must work with the existing plain HTML + Vercel static site.
- Strict LYHA brand voice adherence.
- Staging/preview-first before production.
- No secrets committed to git.
- Build as extractable client-product code, not LYHA-only spaghetti.

---

## Architecture direction

See `docs/WAYNE_G_REUSABLE_ARCHITECTURE.md` for the reusable product boundary.

For LYHA, Wayne G. should be built in layers:

1. **Auth and usage worker** under `cloudflare/wayne-g-auth/`
2. **Wayne G. system prompt and client rules** under `docs/` and `brand-voice.md`
3. **Future admin UI** under `/admin/`
4. **Future shared core/adapters** under `wayne-g/core/` and `wayne-g/adapters/lyha/` if the implementation grows beyond the worker

Do not create the separate Wayne G. GitHub repo until the LYHA flow works end to end.

---

## Phased execution plan

### Phase 0: Foundation and context preservation

Status: mostly complete.

- [x] Create this implementation plan
- [x] Create `docs/WAYNE_G_SYSTEM_PROMPT.md`
- [x] Update `CLAUDE.md` to reflect Wayne G. instead of Sveltia as the day-one admin direction
- [x] Add `docs/WAYNE_G_REUSABLE_ARCHITECTURE.md`
- [ ] Add `docs/wayne-g-brand-voice-floater.md` if still needed for the UI hover helper

Deliverable: Clean handoff docs and system prompt ready for implementation.

### Phase 1: Authentication and usage tracking layer

Status: in progress.

Current scaffold lives in `cloudflare/wayne-g-auth/`.

Build/verify Cloudflare Worker support for:

- Email allowlist validation
- Optional allowed domain validation for approved domains
- Magic-link or one-time-code login
- Session management
- Daily and weekly usage tracking
- Clear client-specific environment variables

Deliverable: Working auth + usage worker that can be tested independently before the full chat UI exists.

### Phase 2: Wayne G. backend and system prompt

Build a thin backend/proxy layer that:

- Injects the Wayne G. system prompt on every model call
- Reads LYHA brand voice and editable content rules
- Supports Adhere to Brand Voice mode and Verbatim mode
- Exposes safe internal actions only: read editable content, propose diff, create backup, commit approved change
- Never commits without explicit approval

Deliverable: Functional backend that can chat and generate safe copy diffs.

### Phase 3: Split-screen UI and preview

Create `/admin/` interface with:

- Left pane: live site/page preview
- Right pane: Wayne G. chat
- Mode toggle
- Budget/usage meter
- Persistent onboarding message
- Preview update flow before approval

Deliverable: Working LYHA admin UI connected to auth and backend.

### Phase 4: Approval, Git commit, and backup system

Implement approved publishing flow:

- Show final proposed change
- Require explicit approval
- Commit with board member identity metadata when possible
- Push to the review branch first
- Preserve Git history as audit trail
- Add or document 30-day backup/snapshot path

Deliverable: End-to-end chat to preview to approved Git change with restore capability.

### Phase 5: Testing, docs, and future extraction prep

- Simulate each authorized board role
- Test blocked/unauthorized email flow
- Test usage-cap behavior
- Test brand-voice vs Verbatim mode
- Test bad edit restore path
- Document how to add a future client adapter
- Decide whether to extract to `NXTLVL-Digital/wayne-g`

Deliverable: Production-ready LYHA admin experience plus a clear reusable pattern for future clients.

---

## Immediate next steps

1. Commit this consolidated Wayne G. foundation branch.
2. Verify the Cloudflare worker syntax and Wrangler dry run.
3. Fix Cloudflare auth/deploy access.
4. Deploy the auth worker.
5. Continue Phase 1 usage tracking before starting the full chat UI.
