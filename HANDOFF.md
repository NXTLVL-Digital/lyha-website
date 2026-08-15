# LYHA Website — Phase 1 Handoff

_Last updated: 2026-05-13. Read CLAUDE.md for full project context before starting work._

---

## State of the site right now

All 7 program pages are live on Vercel (`https://lyha-website.vercel.app`):

| Page | URL | Status |
|---|---|---|
| Homepage | `/` | Live, copy locked |
| Learn to Play | `/learn-to-play/` | Live |
| Mites (U8) | `/mites/` | Live |
| Squirts (U10) | `/squirts/` | Live, best-guess content |
| Peewee (U12) | `/peewee/` | Live, best-guess content |
| Bantams (U14) | `/bantams/` | Live, best-guess content |
| U15 | `/u15/` | Live, best-guess content |

Shared infrastructure: `styles.css`, `/assets/coyote-mark.webp`, favicon, OG meta. Stack is plain HTML/CSS/vanilla JS — no build step, no npm.

---

## Remaining phase 1 work

Main buckets:

**A. Content-gated pages (need Jeff input first, build shells now)**

1. `/about/` — needs mission text from bylaws, org history paragraph
2. `/board/` — needs board member names, roles, photos, bios
3. `/bylaws/` — needs bylaws PDF (or text)
4. `/calendar/` — needs SportsEngine embed code

**B. CMS editor access (phase 1 launch requirement)**

Sveltia CMS must be added at `/admin/` during phase 1, with Cloudflare Worker auth via `sveltia-cms-auth`, so LYHA board members can make updates before the public site launch. This is no longer phase 2. Repo-side CMS shell and first JSON content files have been added; next step is Cloudflare Worker auth deployment and wiring `base_url` in `admin/config.yml`.

**C. Homepage restructure (Jeff approval needed, then execute)**

The Programs section has wrong structure — 4 lumped rows instead of 6 individual division rows. Design spec is below. Do not touch homepage without Jeff sign-off first.

---

## Build rules — non-negotiables

Before writing a single line of copy, reread `brand-voice.md`. The short version:

- **No em dashes (—).** Use periods, commas, or rephrase.
- **No "skater" when speaking to parents.** Use "child" or "kid." Skater is only OK for skating-skill context.
- **No AI buzzwords.** Full exclusion list in `brand-voice.md`.
- **No SportsEngine links on any page.** Contact-first flow only. CTA: `mailto:info@lynchburg.hockey`.
- **Read new copy out loud.** If it sounds like a brochure, rewrite it.
- **Before every commit:** `grep -c "—" <file>` → 0. `grep -ci "\bskater\b" <file>` → 0.
- **Commit each page separately. Push after each commit.** Vercel deploys incrementally.
- **Update footer Program links** on all existing pages when each new page goes live.


---

## Phase 1 CMS requirement

**Decision date:** 2026-05-13

CMS is now part of phase 1. Board members need editor access before the site goes live so they can review and update launch-critical content themselves.

**Target stack:**
- Sveltia CMS served from `/admin/`
- Git-backed editing into the repo
- Cloudflare Worker auth using `sveltia-cms-auth`
- No paid editor-seat dependency

**Implementation notes:**
1. Add `/admin/index.html` that loads Sveltia CMS.
2. Add `/admin/config.yml` with the initial editable collections.
3. Start with launch-critical content only. Recommended first collections: homepage/global settings, programs/division pages, FAQ items, board members, bylaws/calendar metadata.
4. Keep the public site static. The CMS should generate/edit repository content, not introduce a runtime app server.
5. Configure Cloudflare Worker auth before inviting board members.
6. Verify board-editor flow before launch: login, edit draft/content, commit through CMS, Vercel deploys, public page updates.

**Open questions for Jeff before implementation:**
- Which board members need access first, and what email addresses should be authorized?
- Should board edits commit directly to `staging`, or open PRs for review before launch?
- Which content must be editable on day one versus safe to leave in HTML until after launch?

---

## Page designs

### 1. FAQ (`/faq/`) — build first, no dependencies

**Purpose:** Catch questions that don't belong on one division page. New parents, first-time hockey families, families comparing programs.

**Template:** Use `mites/index.html` as the shell. Swap division CSS for FAQ-specific layout.

**Components used:** All existing — `.div-hero`, `.div-section`, `.div-faq`, `.div-faq-item`, `.final-cta`. No new CSS needed.

**Section structure:**

```
Hero
  label:  "Common Questions"
  h1:     "FAQ. / Where to start."
  lede:   "For questions about a specific division, check that division's page. These cover
           the whole program."
  no CTA buttons

Section 01 — Getting Started        (background: alt)
  h2: "New to hockey. / Where do we start?"
  5 FAQ items

Section 02 — Programs & Placement   (background: ink)
  h2: "Finding / the right program."
  4 FAQ items

Section 03 — Costs & Financial Aid  (background: alt)
  h2: "What does / it cost?"
  4 FAQ items

Section 04 — Gear & Equipment       (background: ink)
  h2: "Getting / the right gear."
  4 FAQ items

Section 05 — Season & Scheduling    (background: alt)
  h2: "How the / season works."
  4 FAQ items

Final CTA — "Still have a question? Email us."
```

**Placeholder FAQ content** (write this now; Jeff can edit):

_Getting Started:_
- Q: We've never done hockey before. Where do we start?
  A: Point to Learn to Play if the child is 4–8 and brand new to skating. Mites if they can already skate unassisted. Link to each division page.
- Q: Does my child need to know how to skate?
  A: Depends on the program. Learn to Play teaches skating from scratch. Every other division assumes the child can move on ice without holding the wall.
- Q: How young can kids start?
  A: Learn to Play accepts children as young as four. Most kids who start that early spend one or two seasons there before moving into Mites.
- Q: Are the programs coed?
  A: Yes. All LYHA programs are open to all kids regardless of gender.
- Q: Do we have to live in Lynchburg?
  A: No. We have families from surrounding counties. If you can get to LaHaye Ice Center, you're in range.

_Programs & Placement:_
- Q: How do I know which division is right for my child?
  A: Age at the start of the season is the primary factor. LTP: 4–8. Mites: 6–8. Squirts: 9–10. Peewee: 11–12. Bantams: 13–14. U15: 14–15. Email us if you're on a border year.
- Q: What's the difference between house hockey and travel hockey?
  A: House hockey (Learn to Play, Mites, Squirts) stays local. Practices and jamborees are at or near LaHaye. Travel hockey (Peewee, Bantams, U15) plays real games against other clubs across the region, with some away weekends and occasional overnight trips.
- Q: My child played for a different club last year. Can they join LYHA?
  A: Yes. We welcome transfers. Bring your USA Hockey registration number. For travel divisions, the standard tryout process applies.
- Q: Can my child play two divisions at once?
  A: No. Players are rostered on one team per season.

_Costs & Financial Aid:_
- Q: How much does a season cost?
  A: Pricing varies by division. We publish current season fees with the registration link we send you. Email us and we'll tell you what this season looks like.
- Q: What does tuition cover?
  A: Ice time, coaching, and USA Hockey and PVAHA registration. It does not cover personal gear or travel costs for away games and overnight trips.
- Q: Is financial aid available?
  A: Yes. Cost should not be the reason a Lynchburg kid can't play. Ask any board member — the conversation is confidential.
- Q: Are there additional fees during the season?
  A: Jamboree fees for house divisions. Travel costs (gas, hotels) for travel divisions on away weekends. These are paid by families and vary by season schedule.

_Gear & Equipment:_
- Q: What gear does a child need?
  A: Helmet with cage, neck guard, shoulder pads, elbow pads, hockey pants, shin guards, skates, gloves, and a stick. The jersey is covered by registration. Full gear list comes with your welcome email.
- Q: Do we need gear before the first practice?
  A: Yes, full equipment is required from day one. We sometimes have donated used gear you can buy with a donation, but sizes and stock aren't guaranteed. Ask when you register before buying anything new.
- Q: Where do we buy gear near Lynchburg?
  A: Used gear: Play It Again Sports in Roanoke (~1 hour). New gear: Pure Hockey in Morrisville, NC (~3 hours, just outside Raleigh). Both are linked on each division page.
- Q: What size gear does my child need?
  A: The staff at Pure Hockey can fit your child properly. For used gear, bring the child to Play It Again so they can try on skates in person.

_Season & Scheduling:_
- Q: When does the season start and end?
  A: House divisions (LTP, Mites, Squirts): September through February. Travel divisions (Peewee, Bantams, U15): September through March.
- Q: Where do practices and home games happen?
  A: LaHaye Ice Center on the campus of Liberty University, 1971 University Blvd, Lynchburg, VA. Directions and parking are on the LaHaye website.
- Q: What is LaHaye Ice Center like?
  A: Full-size NHL rink, heated lobby, locker rooms. Liberty University operates it through Club Sports. Link to LaHaye site: https://libertyclubsports.com/facilities/lahaye-ice-center/5
- Q: How do I get the season schedule?
  A: Schedule is sent to families once it's finalized each August. Travel schedules are published before the season begins. Check `/calendar/` once it's live.

---

### 2. About (`/about/`) — build shell, Jeff fills content

**Purpose:** Establish trust. Parents who don't know hockey are evaluating whether this org is worth handing their child to. Show mission, history, structure, legitimacy.

**Template:** `mites/index.html` shell + new CSS (2 new components).

**Components used:** `.div-hero`, `.div-section`, `.criteria-grid` (reused for affiliations), `.stat-strip`, `.next-card` style card for board CTA, `.final-cta`.

**New CSS components needed:**

```css
/* Large mission statement pull-quote */
.mission-quote {
  font-family: var(--display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--bone);
  max-width: 900px;
  border-left: 3px solid var(--green);
  padding-left: 36px;
  margin: 40px 0;
}

/* Prose text block for org story */
.prose {
  max-width: 780px;
}
.prose p {
  color: var(--bone-dim);
  font-size: 17px;
  line-height: 1.75;
  margin-bottom: 1.5em;
}
.prose p:last-child { margin-bottom: 0; }
```

**Section structure:**

```
Hero
  label:  "Our Organization"
  h1:     "About LYHA. / Who we are."
  lede:   [Jeff provides: founding year, what the org is, 1-2 sentences]
  no CTA — or single "See our programs" → /#programs

Section 01 — Mission  (background: ink)
  label:  "Section 01 · Our Mission"
  h2:     "Why we're / here."
  .mission-quote:  [Jeff provides exact bylaws mission text]
  p below:  brief context paragraph

Section 02 — Our Story  (background: alt)
  label:  "Section 02 · Our Story"
  h2:     "From the beginning."  [or Jeff picks]
  .prose block with 2-3 paragraphs of org history
  [Jeff provides content]

Section 03 — Affiliations  (background: ink)
  label:  "Section 03 · How we're connected"
  h2:     "Part of something / bigger."
  p:      "LYHA competes under two governing bodies. Here's what that means for your family."
  .criteria-grid (3 columns):
    card 1: USA Hockey
      eyebrow: "National Governing Body"
      h3: "USA Hockey"
      p: "Every LYHA player is registered with USA Hockey. That covers insurance, coaching certification standards, and eligibility to compete in sanctioned events across the country."
    card 2: PVAHA
      eyebrow: "Regional Competition"
      h3: "Potomac Valley AHA"
      p: "LYHA competes in the Potomac Valley Amateur Hockey Association. PVAHA runs the game schedules, tournament structure, and standings for clubs across Virginia and neighboring states."
    card 3: 501(c)(3)
      eyebrow: "Nonprofit Status"
      h3: "Nonprofit. Parent-run."
      p: "LYHA is a 501(c)(3) nonprofit organization. The board is made up of parent volunteers. Tuition covers costs. Financial aid is available. The org doesn't exist to make money."

Section 04 — The Board  (background: alt)
  label:  "Section 04"
  h2:     "The people / who run it."
  p:      "LYHA is governed by a volunteer board of parents who have kids in the program.
           They set policy, manage the budget, and show up every Saturday."
  .next-card style card or simple CTA row:
    → "Meet the Board" button → /board/

Final CTA  (standard pattern)
  h2:  "Questions about the org? / Ask us directly."
  mailto:info@lynchburg.hockey
```

**Content Jeff must provide before this is final:**
- Mission statement text (from bylaws)
- Founding year / brief org history (2-3 paragraphs)

**Build now:** Full page with placeholder text blocks marked `[PLACEHOLDER — Jeff to fill]`. The affiliations section and board CTA can be written now.

---

### 3. Our Board (`/board/`)

**Purpose:** Show who is accountable. Parents doing due diligence want to know who runs this before handing over money.

**Template:** `mites/index.html` shell + new board-specific CSS.

**New CSS components needed:**

```css
.board-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--rule);
  gap: 0;
}
.board-card {
  padding: 48px 36px;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.board-card:nth-child(3n) { border-right: none; }
.board-photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--forest-2);
  border-radius: 2px;
  margin-bottom: 28px;
  overflow: hidden;
}
.board-photo img { width: 100%; height: 100%; object-fit: cover; }
.board-photo-placeholder {
  /* same size as .board-photo but no real image */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-style: italic;
  font-size: 56px;
  font-weight: 300;
  color: var(--bone-mute);
}
.board-role {
  font-family: var(--athletic);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--green-bright);
  margin-bottom: 12px;
}
.board-name {
  font-family: var(--display);
  font-weight: 500;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin-bottom: 14px;
}
.board-bio {
  color: var(--bone-dim);
  font-size: 15px;
  line-height: 1.65;
}

/* Mobile: 2-col → 1-col */
@media (max-width: 900px) {
  .board-grid { grid-template-columns: repeat(2, 1fr); }
  .board-card:nth-child(3n) { border-right: 1px solid var(--rule); }
  .board-card:nth-child(2n) { border-right: none; }
}
@media (max-width: 480px) {
  .board-grid { grid-template-columns: 1fr; }
  .board-card { border-right: none; }
}
```

**Section structure:**

```
Hero
  label:  "Leadership"
  h1:     "Our Board. / The people behind it."
  lede:   "The LYHA board is made up of parent volunteers. They set policy, manage the
           budget, run tryouts, and handle everything that happens off the ice."
  no CTA

Section 01 — Board Members  (background: alt)
  label:  "Section 01 · 2026-27 Board"
  h2:     "Meet / the board."
  p:      "Board terms run one year. Nominations open each spring."

  .board-grid with one card per member
  Each card: .board-photo (or .board-photo-placeholder with initials), .board-role, .board-name, .board-bio

  While waiting for Jeff's board data → use .coaches-pending placeholder:
  "2026-27 board roster will be published here. Reach out to meet the team."

Section 02 — Contact  (background: ink)  [optional, or use final-cta]
  Brief: how to reach the board, when meetings are (if open)

Final CTA
  h2:  "Want to get involved? / The board is always looking for good people."
  mailto:info@lynchburg.hockey
```

**Content Jeff must provide:**
- All board members: name, role/title, short bio (2-4 sentences), headshot photo

**Build now:** Full page structure. Use `.coaches-pending` placeholder for the board grid.

---

### 4. Bylaws (`/bylaws/`)

**Purpose:** Governance transparency. Families and prospective board members want access to this. Should be easy to find and download.

**Template:** `mites/index.html` shell. Very minimal page.

**New CSS (minimal):**

```css
.doc-download-card {
  /* reuse .cost-card structure */
  background: linear-gradient(135deg, var(--forest) 0%, var(--ink) 100%);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 64px;
  display: flex;
  align-items: center;
  gap: 48px;
  position: relative;
  overflow: hidden;
}
.doc-download-card::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(6, 123, 63, 0.18), transparent 65%);
  filter: blur(50px);
}
.doc-icon {
  font-family: var(--display);
  font-size: 72px;
  font-style: italic;
  font-weight: 300;
  color: var(--green-bright);
  line-height: 1;
  flex-shrink: 0;
}
.doc-meta { flex: 1; position: relative; }
.doc-meta h3 {
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.doc-meta p { color: var(--bone-dim); font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
```

**Section structure:**

```
Hero
  label:  "Governance"
  h1:     "Bylaws. / How we operate."
  lede:   "The governing document of the Lynchburg Youth Hockey Association. Available to
           all members."
  no CTA

Section 01 — Download  (background: ink)
  .doc-download-card
    .doc-icon: "PDF"  (or a simple SVG document icon)
    .doc-meta:
      h3: "LYHA Bylaws"
      p:  "Adopted [date]. Last amended [date]."
      btn-primary: "Download PDF" → href to /assets/lyha-bylaws.pdf (once Jeff provides)
      
  While waiting for PDF:
    .coaches-pending:
    "Bylaws PDF will be posted here. Email us at info@lynchburg.hockey for a current copy."

Section 02 — Inline text  (background: alt)  [OPTIONAL — only include if Jeff wants it rendered]
  Styled long-form text with .prose

Final CTA  (minimal)
  h2:  "Questions about our governance? / Ask the board."
  mailto:info@lynchburg.hockey
```

**Content Jeff must provide:**
- Bylaws PDF file → save to `/assets/lyha-bylaws.pdf`
- Adoption/amendment dates for the download card text

**Build now:** Full page with placeholder download card. Add real PDF path once Jeff provides file.

---

### 5. Calendar (`/calendar/`)

**Purpose:** Give families a current view of the season. Most useful in-season (September–March). Off-season: show tryout dates, season-start info.

**Template:** `mites/index.html` shell.

**New CSS:**

```css
.calendar-embed-wrap {
  width: 100%;
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
  background: var(--forest-2);
}
.calendar-embed-wrap iframe {
  width: 100%;
  min-height: 640px;
  border: none;
  display: block;
}
```

**Section structure:**

```
Hero
  label:  "Schedule"
  h1:     "Calendar. / What's happening."
  lede:   "The LYHA season schedule — practices, games, jamborees, and tryouts. Published
           in August before each season opens."
  no CTA

Section 01 — Embed  (background: ink)
  p above embed: "All LYHA events are published on SportsEngine. Games are on the
                  team-specific schedule pages. This calendar shows all club events."
  .calendar-embed-wrap
    <iframe src="[SportsEngine embed URL]" ...>
    
  While waiting for embed code from Jeff:
    .coaches-pending:
    "The 2026-27 schedule will be published here in August. Reach out to be added to the list."

Section 02 — Division quick-links  (background: alt)  [optional]
  Small stat-strip or criteria-grid linking to each division
  "Looking for a specific team's schedule? Find your division."

Final CTA  (minimal)
  h2:  "Questions about the schedule? / Email us."
  mailto:info@lynchburg.hockey
```

**Content Jeff must provide:**
- SportsEngine embed code (iframe URL or full embed snippet)

**Build now:** Full page with placeholder embed card.

---

## Homepage Programs section redesign

**Do not touch the homepage without Jeff's approval. This section documents the agreed-upon design so it can be executed in one go once Jeff signs off.**

**Current state (wrong):**
- 4 rows: Learn to Play, House Select, Travel Hockey (all lumped), Ages 16+
- "House Select" and "Ages 16+" rows link to `#`
- "Travel Hockey" lumps Mites/Squirts/Peewee/Bantams into one row pointing to `/mites/`

**Target state (6 rows, all live links):**

```
Row 01  Learn to Play     /learn-to-play/   Ages 4–8 · Beginner
Row 02  Mites (U8)        /mites/           Ages 6–8 · Development
Row 03  Squirts (U10)     /squirts/         Ages 9–10 · House Hockey
Row 04  Peewee (U12)      /peewee/          Ages 11–12 · Travel
Row 05  Bantams (U14)     /bantams/         Ages 13–14 · Travel
Row 06  U15               /u15/             Ages 14–15 · Travel
```

**Age finder table** — add just before the program rows (or just after the section header `<p>`):

```html
<div class="age-finder">
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 4–8</div>
    <div class="age-finder-prog"><a href="/learn-to-play/">Learn to Play</a></div>
  </div>
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 6–8</div>
    <div class="age-finder-prog"><a href="/mites/">Mites</a></div>
  </div>
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 9–10</div>
    <div class="age-finder-prog"><a href="/squirts/">Squirts</a></div>
  </div>
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 11–12</div>
    <div class="age-finder-prog"><a href="/peewee/">Peewee</a></div>
  </div>
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 13–14</div>
    <div class="age-finder-prog"><a href="/bantams/">Bantams</a></div>
  </div>
  <div class="age-finder-row">
    <div class="age-finder-age">Ages 14–15</div>
    <div class="age-finder-prog"><a href="/u15/">U15</a></div>
  </div>
</div>
```

**Age finder CSS (add to homepage `<style>` block):**

```css
.age-finder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 48px;
}
.age-finder-row {
  display: flex;
  gap: 0;
  border-right: 1px solid var(--rule);
  padding: 18px 20px;
}
.age-finder-row:last-child { border-right: none; }
.age-finder-age {
  font-family: var(--athletic);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-mute);
  min-width: 80px;
  padding-top: 3px;
}
.age-finder-prog a {
  font-family: var(--display);
  font-weight: 500;
  font-size: 18px;
  color: var(--bone);
  border-bottom: 1px solid var(--rule);
  transition: color 0.2s ease, border-color 0.2s ease;
}
.age-finder-prog a:hover {
  color: var(--green-bright);
  border-color: var(--green-bright);
}
@media (max-width: 600px) {
  .age-finder { grid-template-columns: 1fr 1fr; }
  .age-finder-row { border-bottom: 1px solid var(--rule); }
}
```

**Also update the homepage footer:** The footer's "Programs" column currently has `House Select`, `Travel Hockey`, and `Ages 16+` as stale entries. Once the Programs section is restructured, update the footer to match: six individual program links in a single column (or keep the two-column Travel Teams structure and just update the stale links).

---

## Suggested session start prompt

When opening a fresh context window to work on these pages, paste this:

```
Read CLAUDE.md and brand-voice.md first. Then read HANDOFF.md for the detailed design specs for the remaining phase 1 pages.

Repo: /Users/jeff/AI Projects/NXTLVL-Digital/Clients/LYHA/lyha-website
Live: https://lyha-website.vercel.app

Current priority: CMS is now phase 1. Add Sveltia CMS at /admin with Cloudflare Worker auth so board members can edit before public launch. If working on pages first, use HANDOFF.md specs and keep content CMS-ready.

Rules: no em dashes, no "skater" in parent-facing copy, no SportsEngine links, contact-first registration flow, one commit per page, push after each commit.
```

---

## Content checklist for Jeff

Before the remaining 4 content-gated pages can be finalized, Jeff needs to provide:

**About (`/about/`):**
- [ ] Mission statement (exact text from bylaws)
- [ ] Org founding year and brief history (2-3 paragraphs)

**Our Board (`/board/`):**
- [ ] Each board member: name, title/role, headshot photo, short bio (2-4 sentences)
- [ ] Any note about board meeting access for members

**Bylaws (`/bylaws/`):**
- [ ] Bylaws PDF file → goes to `/assets/lyha-bylaws.pdf`
- [ ] Adoption date and most recent amendment date

**Calendar (`/calendar/`):**
- [ ] SportsEngine iframe embed code for the LYHA org calendar

**Division page corrections (all 4 built with best-guess content):**
- [ ] Confirm Squirts has no tryouts (currently written as open enrollment)
- [ ] Confirm exact practice cadence (written as 2/wk Squirts/Peewee, 2-3/wk Bantams/U15)
- [ ] Confirm game counts: Peewee 10-15, Bantams 15-20, U15 20+
- [ ] Confirm overnight trip frequency per division
- [ ] Coaching staff (placeholder on all pages — confirm in July)

**CMS editor access (phase 1 launch requirement):**
- [ ] Confirm board member emails for CMS auth
- [ ] Confirm whether CMS edits should commit to staging directly or open PRs
- [ ] Confirm day-one editable content scope
- [ ] Add Sveltia CMS at `/admin/`
- [ ] Configure Cloudflare Worker auth with `sveltia-cms-auth`
- [ ] Verify board login/edit/deploy flow before launch

**Homepage Programs restructure (needs Jeff sign-off before executing):**
- [ ] Jeff approves the 6-row restructure + age finder table design
