# add-about-page-template — Design

## Context

The About page design (`context/NANGAv1/src/app/pages/About.tsx`) is five bands: a 60/70vh hero with tint and centered white H1/tagline; a reading-width story block (h2 + two paragraphs); a 16:9 YouTube embed (`1TCP8EZ1gAU`); a long-form "JAPAN QUALITY" block (h2, an h3 lead subsection with two paragraphs, three more h3+paragraph subsections, and an arrow link to the Technology page); and a centered gray CTA band with a primary button.

The Technology and Knowledge pages established the pattern this change follows: a `page.<name>.json` template composed of section instances with design copy as editable defaults, `main-page` present but disabled, and stable human-readable section/block keys (`tech_*`, `kn_*`). The section vocabulary already covers everything here except h3 subheadings inside `c-content-panel` — its heading block renders only `<h2>` ([sections/c-content-panel.liquid:22](../../..//sections/c-content-panel.liquid)), and Shopify `richtext` settings do not allow heading tags, so h3s cannot be carried in text blocks.

`page.technology.json`'s `tech_sourcing` band already links to `/pages/about`; this template makes that link live.

## Goals / Non-Goals

**Goals:**
- `templates/page.about.json` reproducing the design's five bands from existing sections, copy hardcoded as editable defaults.
- A `subheading` (h3) block for `c-content-panel`, additive and unused by any existing instance.
- No new sections, no JS, no stock-section edits.

**Non-Goals:**
- Replacing or removing the theme-demo `page.story.json`.
- Autoplaying or inlining the YouTube iframe at page load (deliberate: deferred click-to-play instead).
- Nav/menu wiring and page creation in admin (merchant setup).

## Decisions

1. **Compose from existing sections; extend `c-content-panel` rather than add a section.** Every band maps to a proven instance shape from `page.technology.json` / `page.story.json`. The only gap is h3 subheadings. Alternatives rejected: smuggling `<h3>` into richtext (Shopify strips heading tags from `richtext` settings); splitting each subsection into its own section (renders h2s — wrong document outline — and adds section-level vertical rhythm the design doesn't have); a new long-form section (duplicates `c-content-panel`). An additive `subheading` block keeps the panel the single long-form primitive, per the repo rule "add a variant instead of mutating the shared path".

2. **Subheading block renders `<h3 class="ccp__subheading">`, plain text setting.** Styled in `assets/c-content-panel.css` only: panel text color (`--ccp-text`), sized between `ccp__heading` and body (design: `text-xl sm:text-2xl`, `mb-4`). No schema changes to existing blocks; Technology's instances render byte-identical.

3. **Story and Japan Quality are two `c-content-panel` full-width bands with white background** (`background_color: #ffffff`, text `#000000`, body `#4b5563`). Band mode constrains content to reading width (`container--reading-width`), matching the design's `max-w-4xl`. Two bands, not one, because the video sits between them. Japan Quality uses 10 blocks (1 heading + 4 subheadings + 4 texts + 1 link button) against the panel's `max_blocks: 12`.

4. **Video uses the stock `video` section with the external YouTube URL, click-to-play.** The design embeds a raw iframe; the theme's `video` section defers the third-party iframe behind a play button and cover image — a page-weight win consistent with the performance-first rule. Configuration: external video `https://www.youtube.com/watch?v=1TCP8EZ1gAU`, `full_width: false`, no heading/text blocks (play button only), video description set for screen readers. Trade-off: merchant must set a cover image (placeholder SVG shows until then).

5. **Hero mirrors `tech_hero`**: `image-with-text-overlay`, fixed height 720/480, `full image-overlay--bg-shadow` overlay, center/center, H1 "ABOUT NANGA" (`use_h1: true`, sizes 60/40) + enlarged tagline text. Image assigned in the editor like every other hero in this theme.

6. **CTA reuses the `tech_cta` recipe with color scheme 1.** `rich-text`, centered, heading + text + primary button ("Shop Collection" → `/collections/down-jackets`). Scheme 1 (`#f7f7f7`, black buttons) stands in for the design's `bg-gray-50` (`#f9fafb`) — an existing theme token beats a one-off color, and `page.story.json` already uses scheme 1 on `rich-text`.

7. **Keys and order follow the sibling templates**: section keys `about_hero`, `about_story`, `about_video`, `about_quality`, `about_cta`; block keys `about_<section>_<slug>`; `main` (`main-page`) first and disabled.

## Risks / Trade-offs

- [Shared section: `c-content-panel` is live on the Technology page] → change is a new block `case` + schema entry + one new scoped CSS class; no existing markup, settings, or CSS rules are touched. Verify Technology renders unchanged.
- [CTA gray is `#f7f7f7`, design says `#f9fafb`] → imperceptible 2-point difference; consistency with the theme's scheme tokens wins. Merchant can override via scheme settings if ever needed.
- [Click-to-play video diverges from the design's inline embed] → intentional performance decision (no render-blocking/eager third-party iframe); the play affordance is a standard theme pattern. Cover image required for the intended look.
- [Japan Quality at 10 of 12 max blocks] → fits; if the page ever grows another subsection pair it still fits (12). Beyond that, split into a second adjacent white band — visually seamless.
