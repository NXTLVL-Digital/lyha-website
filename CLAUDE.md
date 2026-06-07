# Lynchburg Youth Hockey Association — Project Context

This is the canonical project memory file. Claude Code loads it automatically when opened in this repo. Read it fully before making any changes.

## What this project is

A static-site rebuild of the Lynchburg Youth Hockey Association (LYHA) website. The org is a 501(c)(3) nonprofit operating in Lynchburg, Virginia, branded as the Hill City Coyotes. The current production site is `lynchburg.hockey`, hosted on GoDaddy. This rebuild will replace it when phase 1 is complete.

## Audience and framing

Most visitors are parents in Central Virginia who don't know hockey. Lynchburg sits in a region where ice hockey is rare. The site's primary job is to help confused, hockey-curious parents figure out whether and how to sign their child up for hockey.

Framing throughout: this site is a journey for parents. The homepage emotionally connects on values. The deeper pages route the visitor by age, by readiness, and by question to the right next step.

Two journey scales the site has to serve:
- *Immediate / this-season*: how to sign up, when does it start, where to skate, what gear, who to ask.
- *Long-arc / 6 to 16*: what's the path forward, what does each year look like, is hockey a real future for our kid.

Phase 1 delivers the immediate journey fully, includes board-editable CMS access before public launch, and plants seeds for the long-arc journey, which phase 2 fulfills.

## Stack and architecture

- **Source**: this GitHub repo (`pumpkinsfan/lyha-website`, private).
- **Hosting**: Vercel. Project name `lyha-website`. Auto-deploys on every push to `main`. Live at `https://lyha-website.vercel.app`.
- **Domain**: `lynchburg.hockey` is registered at GoDaddy. DNS will repoint to Vercel when phase 1 launches. The old GoDaddy hosting will be cancelled at the same time.
- **Build**: no build step. Plain HTML, CSS, vanilla JS. Vercel serves the repo root as static.
- **Phase 1 CMS**: Sveltia CMS at `/admin`, git-backed (free, no editor cap). Editor auth via a Cloudflare Worker running `sveltia-cms-auth` (free tier). This must be available to board members before the public site launch so they can make updates during review. Repo-side CMS files now live in `/admin/`, with first editable content data in `/data/*.json`; Cloudflare Worker auth still needs deployment and `base_url` wiring.
- **Phase 2 shop**: Fourthwall print-on-demand, embedded at `/shop`.

## Files in this repo

- `index.html` — homepage. Copy is approved and considered final. Do not change copy or layout without explicit ask from Jeff. Small additive changes (e.g., new program rows, footer additions) are OK once approved.
- `mites/index.html` — Mites division page. Designed as the prototype for the four remaining division pages.
- `brand-voice.md` — canonical voice and tone rules, including the AI-tell exclusion list. Anyone (or any AI) writing for LYHA reads this first.
- `CLAUDE.md` — this file.
- `README.md`, `.gitignore` — standard.

## Design system

Tokens live in the `<style>` block of `index.html` (and are duplicated into `mites/index.html`). The first refactor priority is extracting these to a shared `styles.css`.

### Color tokens

```
--ink:           #0a1610   /* page background, deepest dark */
--forest:        #132D1C   /* primary brand dark */
--forest-2:      #1a3825   /* slightly lighter forest */
--green:         #067B3F   /* accent */
--green-bright:  #0a9c50   /* italic accent / hover */
--black:         #231F20
--bone:          #f4f1ea   /* warm off-white */
--bone-dim:      rgba(244, 241, 234, 0.7)
--bone-mute:     rgba(244, 241, 234, 0.45)
--rule:          rgba(244, 241, 234, 0.12)   /* borders */
```

### Typography

```
--display:   'Fraunces', Georgia, serif       /* large editorial headlines */
--athletic:  'Barlow Condensed', sans-serif    /* eyebrows, all-caps labels */
--body:      'IBM Plex Sans', system-ui, sans-serif
```

### Established components (reused across pages)

- `.nav` + `.nav-toggle` — sitewide navigation with mobile hamburger
- `.hero` — homepage hero with mascot
- `.div-hero` — text-led hero for sub-pages (no mascot, large display H1, lead, CTA row, stat strip)
- `.stat-strip` — horizontal stat grid (used in hero + commitment sections)
- `.criteria-grid` — 3-column card grid (used in fit checks + gear)
- `.steps` — numbered step list (used in sign-up)
- `.cost-card` — gradient card for cost section
- `.coaches-pending` — dashed placeholder when staff TBD
- `.div-faq` — vertical FAQ list
- `.next-card` — green gradient card for "what comes next"
- `.final-cta` — centered call-to-action
- Standard `footer` with 4-column grid

When designing a new page, prefer reusing these. New components should use existing color and font tokens.

## Voice and copy rules

**Always defer to `brand-voice.md`. Non-negotiables:**

- No em dashes (—) in user-visible copy. Use periods, commas, or rephrase.
- No AI buzzwords (delve, tapestry, leverage, navigate, ensure, facilitate, transformative, holistic, elevate, empower, harness, unleash, vibrant, pivotal, intricate, showcase, etc.). Full list in `brand-voice.md`.
- No "It's not about X, it's about Y" formula.
- No marketing register ("thrilled to," "honored to," "passionate about," "delighted to").
- No empty-warm closes ("we'd love to," "we can't wait to," "looking forward to seeing you").
- Use "child" or "kid" when speaking to parents. Never "skater" unless the context is a specific skating skill.
- Read every new section out loud. If it sounds like a brochure, rewrite.

**Before every commit:** run `grep -c "—" <file>` and `grep -ci "\bskater\b" <file>` on any new copy and confirm both return 0 for user-visible content (CSS comments don't count).

## Phase 1 — status

**Done:**
- Homepage (`/`)
- Mites page (`/mites/`)
- Learn to Play page (`/learn-to-play/`)
- Squirts page (`/squirts/`) — house development, ages 9-10, jamborees only, no tryouts. Done 2026-05-12.
- Peewee page (`/peewee/`) — travel hockey, ages 11-12, tryout flow, 10-15 games, overnight possible. Done 2026-05-12.
- Bantams page (`/bantams/`) — travel hockey, ages 13-14, tryout flow, 15-20 games, overnight expected. Done 2026-05-12.
- U15 page (`/u15/`) — travel hockey, ages 14-15, tryout flow, 20+ games, overnight expected. Done 2026-05-12.
- FAQ page (`/faq/`) — general/sitewide FAQ. Done 2026-05-13.
- Brand voice doc
- Shared `styles.css` (extracted from inline CSS — all new pages use this)
- `/assets/coyote-mark.webp` — single logo file used everywhere (46 KB WebP; replaces 447 KB+ base64 per page)
- `/assets/favicon.ico` + `/assets/apple-touch-icon.png`
- OG + Twitter card meta on all pages

**Remaining phase 1 work:**

1. **About** (`/about/`) — org mission, story, USA Hockey/PVAHA affiliations. Includes the mission statement (a List 2 priority-1 item to bring into phase 1).
2. **Our Board** (`/board/`) — board member names, photos, roles.
3. **Bylaws** (`/bylaws/`) — long-form governance doc with download link.
4. **Calendar** (`/calendar/`) — season events. Probably embeds a SportsEngine calendar; confirm with Jeff.
5. **CMS editor access** (`/admin/`) — Replaced with Wayne G., an NXTLVL-Digital AI chat assistant. Board members describe copy changes in natural language. Wayne G. must show a preview, require explicit approval before GitHub commits, keep 30-day restore support, enforce usage caps, and remain extractable for future client projects. See `docs/WAYNE_G_IMPLEMENTATION_PLAN.md` and `docs/WAYNE_G_REUSABLE_ARCHITECTURE.md`.
6. **Homepage Programs restructure** — 6 individual program rows plus age finder, after Jeff approval.

**Registration link policy (decided 2026-05-12):** Do NOT link to SportsEngine directly on any page. Links change every season and old links have caused misdirected payments. Flow: parent contacts LYHA via email → board sends current link. All pages use this flow. Mites sign-up section rewritten 2026-05-12 to contact-first, 3-step flow (CTA: mailto:info@lynchburg.hockey).

**Phase 1 sitewide enhancements (List 2 priority-1 items folded in):**
- USA Hockey + PVAHA affiliation badges in footer sitewide. Currently shown as text in the Mites page footer; expand to badge images sitewide once we have logos.
- Mission statement section on About page.
- Long-arc journey placeholder callouts on each division page (already wired on the Mites page — the "What Comes Next" section pointing at the future Player Path).

**Homepage Programs section restructure (do AFTER all 5 division pages exist):**

The homepage's Programs section currently has the wrong structure. It needs to be split from 4 rows to 6:
- "Learn to Play" → keep
- "House Select" → replace with explicit "Squirts" row
- "Travel Hockey" (which lumps Mites/Squirts/Peewee/Bantams) → split into individual rows for Mites, Peewee, Bantams
- "Ages 16+" → replace with "U15"

Target: 6 rows, each linking to a real division page. Also add a small "find your division by age" mini-table just before or after the rows so a confused parent can locate the right program by their child's age. This single homepage change is the largest information-architecture improvement to phase 1.

## Phase 2 — outlook (don't build, but don't preclude)

- **New to Hockey page** — comprehensive first-timer onboarding. Phase 1's "New to Hockey? Start Here" hero CTA currently points at Learn to Play; in phase 2 it swaps to this. No phase 1 design change needed.
- **Player Progression page** — visual 6-to-16 pathway. Phase 1 has placeholder "What Comes Next" callouts on division pages that will resolve to this page.
- **Season Info / tuition transparency** — phase 1 cost slot on division pages has placeholder copy; phase 2 drops the real tuition table into the same slot.
- **Staff Directory** — expansion of Our Board page with full bios, coaching backgrounds, photos.
- **Shop** — Fourthwall embedded at `/shop`.
- **Additional CMS content models** after the phase 1 editor launch. Phase 1 must provide board-editable content for launch-critical updates; phase 2 can expand the editor surface.
- **Org structure / hierarchy page** — nice-to-have visual chart.
- **Alumni page** — nice-to-have.

## Refactor priorities

1. ~~**Extract inline CSS to `/styles.css`.**~~ **DONE (2026-05-12).** `styles.css` is live. All new pages link to it. The page-specific `<style>` block (division page components) lives in each division page.
2. ~~**Extract base64 logos to image files in `/assets/`.**~~ **DONE (2026-05-12).** All images in all pages now use `/assets/coyote-mark.webp` (46 KB). Original source PNG is at `/assets/coyote-mark.png` (429 KB) for reference. It was one file all along — the same coyote mark resized via CSS.
3. ~~**Add favicon + Open Graph meta.**~~ **DONE (2026-05-12).** `favicon.ico`, `apple-touch-icon.png`, and full OG + Twitter card meta are live on all pages.
4. **Update brand-voice.md** if you discover additional AI-tells worth codifying as you write.

**Homepage "skater" copy (resolved 2026-05-12):** Two uses of "skater" on the homepage are Jeff-approved and intentional: "builds skaters, teammates..." (hero lede, line ~56) and "Whether your skater is lacing up..." (Programs header, line ~136). The final CTA h2 was updated from "Your skater's first stride" to "Your child's first stride." No further changes needed.

## What to do next, in suggested order

1. **Jeff reviews all four division pages** (Squirts, Peewee, Bantams, U15) for accuracy. Content is best-guess placeholder. Corrections go into the HTML directly.
2. **Homepage Programs section restructure** — all 5 division pages now exist. The Programs section should be restructured from 4 rows to 6: Learn to Play, Mites, Squirts, Peewee, Bantams, U15. Add a mini "find your division by age" table. This is the largest information-architecture improvement remaining in phase 1. Confirm with Jeff before executing.
3. **Author the remaining phase 1 pages**: About, Our Board, Bylaws, Calendar. Each needs content from Jeff first.
4. **Add phase 1 CMS editor access**: create `/admin/` with Sveltia CMS, define the first editable content collections, and deploy Cloudflare Worker auth so board members can log in before launch.
5. **Verify after every deploy**: hit the new URL, check HTTP 200, grep for em dashes and "skater" in the file.

## What NOT to do

- Don't change homepage copy or layout without explicit permission. Jeff considers the homepage "just about perfect." Small additive changes (program rows, footer items) are OK with approval.
- Don't introduce a build step, framework (React/Next/Svelte/etc.), or `package.json` unless Jeff asks. The simplicity of plain HTML/CSS/JS is intentional and matches the phase 2 CMS plan.
- Don't break or override the established design tokens. New components must use existing colors and fonts from CSS variables.
- Don't deploy to Surge or anywhere else. Vercel + GitHub is the canonical path.
- Don't put confidential info in commit messages or in the repo.

## Stakeholder info

- **Primary contact**: Jeff Walker, jeff@nxtlvl-digital.com
- **Org**: Lynchburg Youth Hockey Association (LYHA)
- **Brand**: Hill City Coyotes
- **Home rink**: LaHaye Ice Center (Liberty University), 1971 University Blvd, Lynchburg, VA 24502 — link to https://libertyclubsports.com/facilities/lahaye-ice-center/5
- **Affiliations**: USA Hockey, PVAHA (Potomac Valley Amateur Hockey Association)
- **Status**: 501(c)(3) nonprofit

## Outside resources we link to

- LaHaye Ice Center: https://libertyclubsports.com/facilities/lahaye-ice-center/5
- Play It Again Sports (Roanoke, used gear): https://playitagainsports.com/locations/roanoke-va/
- Pure Hockey (Morrisville NC, new gear, ~3 hours): https://www.purehockey.com/storelocator.aspx?mkt_id=27

**Division pages built with best-guess placeholder content (2026-05-12):** Squirts, Peewee, Bantams, U15 are all live. Content is placeholder based on reasonable assumptions. Jeff should review and correct any specifics: exact game counts per season, exact practice cadence, whether Squirts has tryouts, actual overnight trip counts, etc.

## Open questions to confirm with Jeff

For division pages (Squirts, Peewee, Bantams, U15) — pages are live, Jeff should review:
- Exact game / jamboree counts per season
- Whether Squirts has tryouts (currently written as open enrollment)
- Actual practice cadence (currently 2/wk for Squirts/Peewee, 2-3/wk for Bantams/U15)
- Overnight trip frequency for Peewee vs Bantams vs U15
- SportsEngine registration URL (all pages use contact-first flow — no direct link)
- Coaching staff (placeholder until July assignments)

For Learn to Play:
- Age range (Jeff said 4 to 8, overlapping with Mites; confirm)
- Format (drop-in, weekly, seasonal)
- Cost
- What's the bridge to Mites? (Most kids do one Learn to Play season then move up; confirm)

For About:
- Mission statement text — Jeff said sourced from bylaws. Get the actual text.
- Org history paragraph
- Photo of board / rink for visual

For Our Board:
- Names, roles, photos, short bios
- Photo style (formal, candid)

For Bylaws:
- Full bylaws PDF or text
- Display preference (long-form on page + PDF download, or just PDF link)

For FAQs:
- The 8 to 15 most-asked questions (separate from division-specific FAQs already on division pages)

For Calendar:
- SportsEngine calendar URL or embed code

## How to verify after a deploy

```bash
# Wait for Vercel deploy
sleep 30
# Verify URL returns 200
curl -sI https://lyha-website.vercel.app/<path>/ | head -1
# Brand voice grep
grep -c "—" <file>      # should be 0 in rendered content
grep -ci "\bskater\b" <file>  # should be 0 in parent-facing copy
# Title sanity
curl -s https://lyha-website.vercel.app/<path>/ | grep -o "<title>[^<]*</title>"
```

---

*This file was authored in a Cowork (Claude desktop) session on 2026-05-12 covering the initial homepage approval, Mites page rewrite, and migration off Surge to Vercel + GitHub. Updated 2026-05-13: CMS moved into phase 1 because board members need editor access before launch. Update this file when major decisions change.*
