# Design System: Financial Decisions Website

## 1. Visual Theme And Atmosphere

Financial Decisions should feel calm, established, editorial, and personal. The homepage now leads with real office photography, a soft glass content panel, restrained bronze accents, and generous white space. The overall impression should be a long-standing independent planning firm presented with clarity and confidence, not a fintech product or startup landing page.

Atmosphere settings:

- Density: Balanced editorial, with compact proof areas and open narrative bands
- Variance: Quietly asymmetric on image-and-copy sections, centered where the current homepage uses formal editorial pacing
- Motion: Restrained reveal and tactile interaction only
- Tone: Professional, steady, locally rooted, and trust-first

## 2. Color Palette And Roles

Use the existing global tokens and nearby neutral values as the source of truth.

- White (#ffffff): primary page background and most content sections
- Soft Warm Band (#f6f3ef / #faf6f0): alternate section backgrounds and subtle editorial panels
- Slate Ink (#0f172a): headings and primary text
- Slate Body (#475569): body copy
- Muted Slate (#64748b): metadata and secondary supporting text
- Heritage Bronze (`--accent`, #8a6b4d): primary accent for CTAs, links, rules, eyebrow text, and focus states
- Dark Bronze (`--accent-dark`, #73553c): stronger CTA borders and emphasized accent text
- Soft Bronze (`--accent-soft`, #efe6dd): subtle highlights and secondary surfaces
- Muted Bronze (`--accent-muted`): image borders, dividers, and low-contrast structure

Rules:

- Keep bronze as the only accent color.
- Use warm neutral section bands rather than colorful gradients.
- Avoid neon, purple, startup blue, and loud marketing color treatments.
- Avoid pure black; use slate/charcoal values already present in CSS.
- Do not introduce additional accent systems for individual sections.

## 3. Typography Rules

The current homepage is a clean sans-serif system with restrained weight, tight tracking, and editorial spacing. Preserve that typographic character unless the type stack is intentionally changed across the site.

- Use the existing inherited sans-serif stack from the Astro/Tailwind/global CSS setup.
- Headings are semibold, slate, tightly tracked, and balanced with `text-wrap: balance`.
- The homepage hero title is large but controlled, topping out around 3.1rem on desktop.
- Section headings generally use `clamp(1.95rem, 3.2vw, 2.55rem)` with `font-weight: 600`, `line-height: 1.1-1.12`, and negative letter spacing.
- Body copy sits around 1rem to 1.05rem with generous line-height from 1.75 to 1.86.
- Eyebrows are uppercase, small, bronze, semibold, and widely tracked.
- Buttons and navigation are sans-serif, medium/semibold, and compact.
- Do not add a decorative serif just because the brand is financial; the implemented homepage relies on restraint, not ornament.

## 4. Homepage Hero Direction

The homepage hero is full-bleed and image-led, not a traditional split hero.

Required pattern:

- Use a real office/environment image as the background.
- Anchor the content near the lower-left on desktop.
- Place copy inside a translucent warm-white glass panel with blur, soft border, and restrained shadow.
- Keep one primary CTA: "Contact Us".
- Keep the headline direct and firm-first.
- Use a gentle white/warm overlay to preserve legibility without obscuring the image.
- Avoid centered hero copy, secondary CTAs, floating stat cards, decorative overlays, and heavy gradient effects.

Current hero composition:

- Background image: `/images/Office%20Painted.png`
- Eyebrow: "FINANCIAL DECISIONS"
- H1: "Independent Financial Planning"
- Supporting copy: comprehensive guidance across investing, retirement, insurance, and long-term planning
- CTA: "Contact Us"

## 5. Layout Principles

The homepage uses formal editorial pacing: a strong hero, compact proof rail, alternating white and warm bands, then measured narrative sections.

- Use `page-shell`, `page-container`, and `page-container--content` for containment.
- Keep main content max width aligned to `--page-content-max-width` where possible.
- Prefer horizontal rules, numbered lists, and typography before adding cards.
- Use cards sparingly, mainly for featured insights and established shared patterns.
- Let some sections be centered when the current homepage uses a formal editorial block.
- Use asymmetric desktop image-and-copy layouts for Local Roots and Advisor Recognition.
- Collapse to a strict single column on mobile.
- Keep mobile buttons full-width where the current homepage does so.
- Preserve compact vertical rhythm on mobile; avoid oversized empty space.

## 6. Current Homepage Section Patterns

Follow the implemented homepage sequence and structure.

1. Hero

Full-bleed photographic hero with glass content panel, one CTA, and restrained overlay.

2. Credibility Rail

White editorial proof band with a left-side label, one dominant "25+ years" proof item, and quieter supporting statements. On desktop, the label column sits beside an anchored proof grid. On tablet, the anchor spans the top and the remaining proof points form a two-column grid. On mobile, all items stack in a single column.

Proof point style:

- "25+ years" is the visual anchor, with larger type and a soft warm surface
- Supporting proof points are compact, left-aligned, and separated by fine bronze-tinted rules
- The rail should read as evidence, not as a generic feature grid
- Avoid repeated decorative marks on every item

3. Planning Philosophy

Soft warm band with centered eyebrow, short heading, and calm body copy. No card shell, no heavy decoration.

4. Planning Areas

White section with centered introduction and a numbered editorial list. On desktop each row becomes a two-column label-and-description composition. Use dividers, numbering, and spacing rather than service cards.

5. Local Roots / Trust

Soft warm band with copy and supporting meeting image. Desktop uses a left copy / right image split. Mobile stacks to copy first, image second.

6. Advisor Recognition

White section with portrait and copy. Desktop uses portrait left and content right. Highlights are simple bordered list rows, followed by a secondary CTA to About.

7. Recognition Proof

Soft-to-white band with centered recognition eyebrow, three-part proof strip, and one short quote. No carousel.

8. Recent Insights

White section with centered intro, one featured insight card, secondary articles in a ruled stack, and a secondary CTA to Insights.

9. Closing CTA

Warm closing band with centered heading, short invitation copy, primary Contact CTA, and contact/location line.

## 7. Component Styling

Buttons:

- Primary buttons use solid bronze, dark bronze border, light text, subtle shadow, and a small hover lift.
- Secondary buttons use warm ivory/tan surfaces with bronze-tinted borders.
- Active states should compress slightly or remove the hover lift.
- No glow-heavy, neon, or oversized pill styling.

Header:

- Header begins as a white bar with a fine bronze-tinted bottom border.
- After scroll, the header surface becomes subtly floating with rounded corners, blur, and restrained shadow.
- Navigation links use an understated bronze underline on hover and active states.
- Keep "Client Access" secondary and "Contact Us" primary.

Images:

- Use real firm photography.
- Keep rounded corners, bronze-muted borders, and soft slate shadows.
- Avoid illustrations, icons-as-decoration, stock-fintech imagery, or sentimental lifestyle imagery.

Cards and panels:

- Use cards only when hierarchy benefits from contained elevation.
- Cards should have warm ivory gradients, bronze-tinted borders, and soft shadows.
- Avoid repeating beige cards as the default section structure.

Rules and dividers:

- Fine bronze-tinted rules are a core part of the current homepage.
- Prefer dividers for credibility, planning areas, proof strips, and secondary insight lists.

## 8. Motion And Interaction

Motion should reinforce polish without drawing attention.

- Use reveal behavior already defined in `Layout.astro` and `global.css`.
- Animate opacity and transform only.
- Keep reveal distances small, usually around 12-16px.
- Use short, calm durations around 520-620ms.
- Respect `prefers-reduced-motion` and keep content visible when motion is reduced.
- Button hover can lift by 1-2px with subtle shadow changes.
- Do not add parallax, scroll-jacking, bouncy easing, decorative motion, or animated counters.

## 9. Imagery Rules

- Lead with office/environment photography.
- Use meeting imagery for relationship/trust sections.
- Use Linda's portrait in the advisor recognition section, not as the opening hero.
- Keep crops calm, architectural, and professional.
- Use real brand photography before decorative assets.
- Preserve meaningful alt text.

## 10. Content Tone

The copy should sound clear, measured, and established.

Use language that is:

- Calm
- Precise
- Direct
- Professional
- Personal without being casual
- Local without being provincial
- Trustworthy without sounding corporate

Avoid:

- Marketing filler
- Startup/product language
- Overpromising
- Hype words such as "elevate", "seamless", "next-gen", "unleash", and "unlock"
- Trendy finance-tech positioning

## 11. Anti-Patterns

Do not introduce:

- Centered generic SaaS hero layouts
- Split hero stat cards replacing the current photo-led hero
- Multiple accent colors
- Loud gradients or glow effects
- Oversized display typography that overwhelms the firm tone
- Decorative serif typography disconnected from the current implementation
- Equal three-column service card rows on the homepage
- Testimonial carousels
- Biography-led homepage openings
- Icon-heavy feature grids
- Decorative motion for its own sake
- Emojis

## 12. Success Criteria

Changes are successful when the site:

- Matches the current homepage's photo-led, glass-panel, sans-serif editorial direction
- Communicates independence, continuity, and trust in the first screen
- Feels premium through spacing, typography, photography, and restraint
- Uses bronze as a single disciplined accent
- Preserves the current homepage section rhythm
- Creates clear paths into About, Contact, and Insights
- Remains accessible, responsive, lightweight, and calm
