# UI Improvement Plan — Financial Decisions

> **Scope:** Visual and structural cleanup only. Copy stays the same on every route. This plan assumes `DESIGN.md` is the visual source of truth and that `CLAUDE.md` conventions are respected.

## Goal

Bring the whole site up to the standard the homepage already sets: calm, editorial, photo-led, single bronze accent, trust-first. Reduce the card-heavy feel of inner pages, consolidate the design system into real tokens, retire dead code, and tighten accessibility and performance — without touching content.

## Guardrails

- No copy changes. If a text edit seems required, flag it; do not ship it.
- Respect `DESIGN.md` verbatim. Where the current implementation contradicts the brief, the brief wins.
- Prefer surgical edits over broad rewrites. Reuse existing classes before introducing new ones.
- `prefers-reduced-motion` must stay honored everywhere.
- `npm run build` must pass after each phase. There is no automated test suite; visual spot-checks + build are the acceptance gate.

## Non-goals

- No rebrand, no new palette, no new type family.
- No CMS migration, no framework upgrade, no routing changes.
- No new pages, no new content collections.
- No analytics or marketing integrations beyond the existing GA tag.

---

## Phase 0 — Design token foundation

**Why first:** every later phase leans on these tokens. Doing them second would mean editing the same files twice.

**File:** `src/styles/global.css`

Add the following to `:root` alongside the existing accent/page variables. Use them to replace hardcoded values as you touch each file in later phases — do not do a mass find-and-replace in this phase.

```css
:root {
  /* Slate / ink scale */
  --ink-900: #0f172a;   /* headings */
  --ink-700: #334155;   /* strong body */
  --ink-600: #475569;   /* body */
  --ink-500: #64748b;   /* secondary / metadata */
  --ink-400: #94a3b8;   /* captions / disabled */

  /* Warm neutral surfaces — converge to two values */
  --surface-0: #ffffff;
  --surface-1: #faf6f0; /* soft warm band */
  --surface-2: #f6f3ef; /* stronger warm band */

  /* Hairline rules — single canonical value */
  --hairline: rgba(138, 107, 77, 0.18);
  --hairline-strong: rgba(138, 107, 77, 0.32);

  /* Elevation */
  --shadow-1: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-2: 0 8px 20px rgba(15, 23, 42, 0.06);
  --shadow-3: 0 18px 34px rgba(15, 23, 42, 0.08);

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Type scale — single source for clamps */
  --font-display-xl: clamp(2.35rem, 4.2vw, 3.1rem);
  --font-display-lg: clamp(1.95rem, 3.2vw, 2.55rem);
  --font-display-md: clamp(1.55rem, 2.4vw, 1.95rem);
  --font-body-lg: 1.0625rem;
  --font-body: 1rem;
  --font-meta: 0.875rem;
  --font-eyebrow: 0.78rem;

  /* Header/anchor math (kept in sync by header script) */
  --header-height: 4.5rem;
  --anchor-offset: calc(var(--header-height) + 1.25rem);

  /* Motion */
  --ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-reveal: 560ms;
  --reveal-distance: 14px;
}
```

**Acceptance criteria**

- `global.css` builds and the site renders unchanged.
- No existing selector is broken by the additions.
- The token names above exist and are reachable via `var(--…)` from any `.astro` file.

---

## Phase 1 — Dead code removal

**Why:** shrink the surface area before refactoring it.

**Delete outright:**

- `src/components/HeaderV2.astro`
- `src/components/FooterV2.astro`
- `src/layouts/LayoutV2.astro`
- `src/styles/home-v2.css`

Before deleting each file, grep the repo to confirm no importers:

```bash
grep -R "HeaderV2\|FooterV2\|LayoutV2\|home-v2" src/
```

**Remove from `src/pages/index.astro` (page-local `<style>` block):**

- `.home-info-section` and descendants
- `.home-mission-shell` and descendants
- `.home-community-layout` and descendants
- `.home-community-trust` and descendants
- `.home-mission-proof-list` and descendants

These CSS blocks have no matching markup. Verify with a repo-wide search for each class name before removing.

**Acceptance criteria**

- `npm run build` passes.
- Homepage renders identically before/after (diff screenshots).
- No unused CSS warnings for the removed classes.

---

## Phase 2 — Motion consolidation

**Why:** today the homepage runs both the global `IntersectionObserver` reveal (from `Layout.astro`) and a per-section `@keyframes` animation chain (from `index.astro`). The two compete on timing.

**Actions**

- In `src/pages/index.astro`, remove the local `@keyframes` declarations and any `animation:` / `animation-delay:` on section containers.
- Replace with the existing `.reveal` / `.reveal-image` classes already consumed by `Layout.astro`.
- Use `--duration-reveal`, `--ease-reveal`, and `--reveal-distance` (Phase 0) as the single source of motion timing inside `global.css`.
- Confirm `prefers-reduced-motion` still yields fully visible content (no `opacity: 0` stuck state).

**Acceptance criteria**

- Homepage reveals on scroll with the same visual feel but a single system driving it.
- With OS setting "Reduce motion" on, all content is visible immediately with no animation.
- No duplicate `@keyframes` or inline animation declarations remain in `index.astro`.

---

## Phase 3 — Button and primitive cleanup

**File:** `src/styles/global.css`

**Actions**

- Remove the bronze glow on `.btn-primary:hover`. The current `box-shadow: 0 14px 36px var(--accent-glow)` contradicts `DESIGN.md` §11 "no glow effects." Replace with a 1–2px `translateY(-1px)` + `var(--shadow-2)`.
- Active state: compress to `translateY(0)` with `var(--shadow-1)`.
- Secondary button (`.btn-secondary`): keep warm ivory surface, `var(--hairline-strong)` border, no glow.
- Strengthen focus-visible rings globally: `outline: 2px solid var(--accent); outline-offset: 2px;` on all interactive elements. Do not rely on a translucent fill.

**Acceptance criteria**

- Tabbing through the header, hero CTA, footer links, and contact page shows a clearly visible bronze focus ring.
- No bronze halo / glow appears on any button at any state.
- Lighthouse "a11y" score for the homepage is ≥ 95.

---

## Phase 4 — Homepage section refinement

**File:** `src/pages/index.astro`

### 4a. Recognition Proof (testimonials)

Current: three testimonial cards with initials-avatars and star-rating glyphs.

Target: an editorial quote strip. Same quotes, no avatars, no stars. Use `var(--hairline)` dividers between quotes, a small bronze eyebrow above each attribution, and the existing `--font-body-lg` for the quote body.

Structure outline:

```html
<section class="home-recognition-proof">
  <div class="page-container page-container--content">
    <p class="eyebrow">Recognition</p>
    <h2>…existing heading…</h2>
    <ul class="recognition-quote-list">
      <li class="recognition-quote">
        <blockquote>…existing quote…</blockquote>
        <p class="recognition-quote__attribution">…existing attribution…</p>
      </li>
      <!-- repeat, separated by hairlines -->
    </ul>
  </div>
</section>
```

Styles live in `global.css` under a `.recognition-quote-list` / `.recognition-quote` block and use tokens from Phase 0.

### 4b. Recent Insights

Current: a heavy feature card with "In this issue" sub-list overpowers the ruled stack below.

Target: the feature issue becomes a calm two-column composition (image left, copy right on desktop; stacked on mobile) with no card shell, sitting flush against a hairline rule. The secondary issues remain a ruled stack.

- Remove the `ui-card` wrapper on the featured issue.
- Keep the image, title, reading time, and summary. Drop the beige gradient and card shadow.
- The "In this issue" itemized list stays — render it as an unstyled `<ul>` with `•` separators or a bronze en-dash.
- The secondary stack below keeps its `border-top: 1px solid var(--hairline)` per-row rhythm.

**Acceptance criteria**

- No round avatars or star glyphs anywhere on the homepage.
- No beige gradient-backed feature card in Recent Insights.
- All copy strings on the homepage match `git diff` before/after: zero content deltas.
- Mobile collapses to a strict single column; image sits above copy for the featured insight.

---

## Phase 5 — PageHeader component unification

**Why:** every inner page rolls its own page title, producing drift. A shared component locks this in without touching copy.

**Create:** `src/components/PageHeader.astro`

Props:

- `eyebrow?: string`
- `title: string`
- `subtitle?: string`
- `image?: string`
- `imageAlt?: string`
- `align?: "left" | "center"` (default `"left"`)

The component renders inside the page shell, uses `--font-display-lg` for the title, `--font-body-lg` for the subtitle, and the existing `eyebrow` class.

**Wire up (one PR each to keep reviews small):**

- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/insights/index.astro`
- `src/pages/resources.astro`
- `src/pages/careers.astro`
- `src/pages/client-access.astro`

Each file replaces its local page-title markup with a `<PageHeader …>` call. Existing copy is moved in verbatim — no rewording.

**Acceptance criteria**

- All six inner pages render a visually consistent page title (same scale, same spacing, same eyebrow treatment).
- No content changed; `git diff` on each page shows markup movement only, not copy.
- Mobile spacing between header and first content section matches the homepage hero-to-next-section gap within 8px.

---

## Phase 6 — Inner page normalization

With `PageHeader` in place, reshape the bodies of the most off-brand inner pages. **All copy remains identical.**

### 6a. Resources (`src/pages/resources.astro`)

- Videos block keeps its thumbnail grid but loses the hover lift; replace with a `transform: translateY(-1px)` + `var(--shadow-2)` on the thumbnail only, not the whole card.
- Partner Research and Trusted Links: convert from cards to a ruled list with bronze eyebrows per group. Each link is an inline-styled anchor, not a card tile.

### 6b. Careers (`src/pages/careers.astro`)

- Collapse the two nested `job-card ui-card` panels into a single editorial block: eyebrow, short heading, paragraph, single CTA. No boxed shell when there are no postings.

### 6c. Client Access (`src/pages/client-access.astro`)

- Keep the three stacked sections, but remove the panel fill. Replace with top-and-bottom hairlines to give an editorial rhythm.
- The login embed stays inside a subtle warm band (`var(--surface-1)`) to signal it is the primary interaction point.

**Acceptance criteria**

- Resources, Careers, and Client Access each feel like the same product as the homepage.
- No copy change; visual only.
- Card count across the inner pages drops meaningfully (count cards before/after; target ≥ 50% reduction on Resources).

---

## Phase 7 — BlogPostLayout prose refactor

**File:** `src/layouts/BlogPostLayout.astro` + `src/styles/global.css`

**Actions**

- Move the `[&_h2]:mt-10 [&_h2]:text-[1.75rem] …` arbitrary-variant string out of the wrapper.
- Add a `.prose-newsletter` class to `global.css` that encodes the same typographic rules using real selectors (`.prose-newsletter h2`, `.prose-newsletter p + p`, etc.), using tokens from Phase 0.
- Wrap the rendered content with `<div class="prose-newsletter">`.

**Preserve the existing mobile-table overrides.** Older newsletters use inline HTML tables; `BlogPostLayout` has special rules to stack them. Do not break those.

**Acceptance criteria**

- A spot check of the three most recent newsletter entries renders identically before/after.
- The wrapper markup no longer contains a long Tailwind arbitrary-selector string.
- Mobile table stacking still works on the older newsletter entries that use HTML tables.

---

## Phase 8 — Header and anchor behavior

**Files:** `src/components/Header.astro`, `src/styles/global.css`

**Actions**

- Expose the live header height as a CSS custom property written by the header script. Extend the existing scroll handler to call `document.documentElement.style.setProperty('--header-height', ${header.getBoundingClientRect().height}px)` on init and on resize.
- In `global.css`, set `html { scroll-padding-top: var(--anchor-offset); }` (uses Phase 0 token). Apply `scroll-margin-top: var(--anchor-offset)` to `h2, h3, [id]` inside main content.
- Add a non-visible "Home" entry to the header nav array, or — preferred — add a logic check so `pathname === "/"` gets `aria-current="page"` on the brand mark. Do not add a visible "Home" link.

**Acceptance criteria**

- Clicking an in-page anchor lands the target ~1.25rem below the floating header, never clipped.
- On `/`, the brand lockup carries `aria-current="page"`.
- Resizing the window updates the anchor offset in real time (verifiable via devtools inspecting `--header-height`).

---

## Phase 9 — Accessibility pass

**Actions**

- Global focus-visible ring is already addressed in Phase 3; re-audit after all phases to confirm it survives.
- Add `-webkit-backdrop-filter` alongside `backdrop-filter` on the hero glass panel and anywhere else blur is used. Without it, Safari < 18 falls back to a transparent panel.
- Confirm every inline `<svg aria-hidden="true">` really is decorative; if it carries meaning, swap to `role="img"` with an accessible name.
- Ensure `main`, `header`, `footer`, `nav` landmarks are each used exactly once per page. Current header nav is fine; verify inner pages have a real `<main>` wrapping their content.
- Run axe or Lighthouse on all routes. Target 0 critical issues.

**Acceptance criteria**

- Safari desktop renders the hero glass panel with blur.
- Lighthouse a11y ≥ 95 on `/`, `/about`, `/insights`, `/resources`, `/contact`, `/careers`, `/client-access`, and one representative newsletter page.
- Zero axe critical issues on the pages above.

---

## Phase 10 — Asset and performance

**Actions**

- Commission or export an SVG version of the firm logo and place it at `public/images/logo.svg`. Reference from `Header.astro` and `Footer.astro`. Keep the raster as a fallback for legacy browsers if desired.
- Generate WebP versions of `public/images/Office Painted.png`, `Meeting.jpg`, `Linda.jpg`, and `Award.jpg`. Serve via `<picture>` with `<source type="image/webp">` and the existing raster as fallback.
- Add `<link rel="preload" as="image" href="/images/Office%20Painted.webp" imagesrcset="…" />` for the hero to cut LCP.
- Ensure every `<img>` sets `width` and `height`. Missing dimensions cause CLS.
- Add `loading="lazy"` to all below-the-fold imagery. Keep the hero `eager`.
- Replace the JPG favicon with an SVG favicon (`public/favicon.svg`) plus a PNG fallback.

**Acceptance criteria**

- Lighthouse performance on the homepage ≥ 90 on mobile (Moto G Power simulation).
- CLS on the homepage ≤ 0.05.
- Network panel shows WebP served on supporting browsers.

---

## Phase 11 — Meta and SEO

**File:** `src/layouts/Layout.astro`

**Actions**

- Add Open Graph tags: `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image`, `og:locale=en_CA`.
- Add Twitter card: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- Add `<link rel="canonical" href="…" />` derived from `Astro.url`.
- Add a `LocalBusiness` JSON-LD block with firm name, phone, email, address, URL, and logo. This is a real business with a real address and is a strong, low-risk SEO add for an independent planning firm.
- Do not duplicate the existing Google Analytics tag.

**Acceptance criteria**

- `view-source` on every route shows OG, Twitter, canonical, and JSON-LD tags.
- Google Rich Results Test validates the `LocalBusiness` JSON-LD without errors.
- Sharing `/` to iMessage/Slack produces a rich preview with the hero image.

---

## Phase 12 — Polish

Small, surgical items. One commit each.

- **Footer typo:** `src/components/Footer.astro` line 37 — change `Independant` to `Independent`. (This is a typo fix, not a copy change.)
- **Footer weight:** lighten the footer's top edge from `2px` solid bronze to `1px solid var(--hairline-strong)` to match the rest of the site's hairline language.
- **Hairline consolidation:** replace all ad-hoc `rgba(138, 107, 77, 0.14|0.18|0.22)` values across `.astro` and CSS files with `var(--hairline)` or `var(--hairline-strong)`.
- **Warm tone convergence:** consolidate the three beige values currently floating around homepage sections into `var(--surface-1)` and `var(--surface-2)` from Phase 0.
- **Eyebrow unification:** ensure every eyebrow uses the shared `.eyebrow` class. Remove per-page re-declarations.

**Acceptance criteria**

- Repo grep for `rgba(138, 107, 77` returns matches only inside `global.css` token definitions.
- Footer typo is corrected.
- Homepage beige surfaces render with exactly two warm values, not three.

---

## Execution order and dependencies

The phases are ordered by dependency. Safe to parallelize only where noted.

| # | Phase | Depends on | Notes |
|---|-------|------------|-------|
| 0 | Tokens | — | Must ship first. |
| 1 | Dead code | — | Parallelizable with Phase 0. |
| 2 | Motion consolidation | 0 | — |
| 3 | Buttons & focus | 0 | — |
| 4 | Homepage sections | 0, 3 | — |
| 5 | PageHeader component | 0 | — |
| 6 | Inner page normalization | 0, 5 | One PR per page ideally. |
| 7 | BlogPostLayout prose | 0 | Independent of Phases 4–6. |
| 8 | Header & anchors | 0 | — |
| 9 | Accessibility | 0, 3, 8 | Global audit last. |
| 10 | Assets & perf | — | Parallelizable with anything. |
| 11 | Meta & SEO | — | Parallelizable with anything. |
| 12 | Polish | 0 | Last. |

## Verification at each phase

- `npm run build` must pass.
- Visual spot-check of `/`, `/about`, `/insights`, `/resources`, `/contact`, `/careers`, `/client-access`, and one newsletter page at 1440px, 768px, and 390px.
- `git diff` on any `.astro` page must show zero copy changes unless the phase is explicitly a typo fix (Phase 12, Footer only).
- `prefers-reduced-motion` on: content still visible immediately, no animation.
- Lighthouse scores on `/` at the end of each phase to catch regressions.

## Final verification (before merging the full series)

- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on `/`.
- Axe clean on all routes listed above.
- Rich Results Test passes on the JSON-LD block.
- CLS ≤ 0.05 on the homepage.
- Safari, Chrome, and Firefox desktop + mobile render the hero glass panel correctly.
- Keyboard tab order through the homepage is sensible and the focus ring is always visible.
- Repo is free of V2 dead code and orphan CSS.

## Out of scope (flag for a future phase)

- Adding a sitemap.xml and robots.txt audit.
- Introducing a proper image pipeline (e.g., `@astrojs/image` or `astro:assets`). If the WebP hand-conversion in Phase 10 is painful, revisit.
- Newsletter authoring UX. Stays markdown-driven per `CLAUDE.md`.
- Any content strategy work — out of scope by user directive.
