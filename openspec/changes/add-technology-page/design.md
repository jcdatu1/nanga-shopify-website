# Design — add-technology-page

## Context

The design's Technology page (`context/NANGAv1/src/app/pages/Technology.tsx`) is six stacked bands:

1. **Hero** — full-bleed cover image, `bg-black/40` tint, centered white H1 + subtitle, 60–70vh.
2. **UDD split** — constrained (`max-w-6xl`) two-column: heading + three paragraphs left, 4:3 image on `bg-gray-100` right.
3. **Features grid** — 4 columns (2 on small screens), each centered: icon inside a 64px `bg-gray-100` square, title, small gray text. Icons: Droplets, Thermometer, Feather, Mountain.
4. **Fill Power panel** — `bg-gray-50` padded panel: heading, two paragraphs, then 3 columns of stats, each `border-l-2 border-black pl-4` with a label line and gray description.
5. **Responsible Sourcing** — full-width black band, white heading + paragraphs (`text-white/80`), arrow link with `gap-2 → gap-3` hover.
6. **CTA** — centered heading, gray text, black button.

Investigation of the theme found:

- `templates/page.story.json` establishes the page-composition convention: disabled `main-page` + a section stack, with the hero done by `image-with-text-overlay` (`height: fixed`, `height_desktop: 720`, `height_mobile: 400`, `overlay_style: "full image-overlay--bg-shadow"`, centered blocks). Bands 1, 2, and 6 map to existing sections with zero code: `image-with-text-overlay`, `split-content` ("C Image with text", constrained mode, image right), and `rich-text` (centered, primary button).
- Bands 3 and 4/5 have no counterpart: `multi-column` supports image/video media but no icon-tile treatment; `rich-text`'s icon block is single-column; nothing renders border-left stat columns or a padded tinted panel.
- Both global color schemes are light (`scheme 1 = #f7f7f7`, `scheme 2 = #efefef`); neither can produce the black band, and schemes are global (scheme 2 is used by `product.alternative.json`), so repurposing one is off the table.
- `snippets/icon.liquid` has `feather` and `arrow-right` but no droplet/thermometer/mountain.
- The icon-tile grid and border-left stats appear **only** on the Technology page across the whole Figma; the hero/CTA patterns repeat on About, Journal, and Knowledge.

## Goals / Non-Goals

**Goals:**
- Reproduce the Technology page as a section-composed template with all copy editable in the theme editor (Figma text as hardcoded defaults).
- Reuse `image-with-text-overlay`, `split-content`, and `rich-text` untouched, configured only via the template JSON.
- New sections follow house conventions exactly: `"C ..."` schema names, `c-` filenames, heading/text/button block model, `full_width` + color settings, scoped CSS, no JS, responsive images via `image_url`/`srcset`.

**Non-Goals:**
- No edits to any stock section, `split-content`, or existing templates.
- No About/Journal/Knowledge templates in this change (they benefit later from the same recipe).
- No global "dark" color scheme addition.
- No new JS, fonts, or dependencies.

## Decisions

### Compose the page from sections via `page.technology.json`, not a bespoke page section
Follows `page.story.json` exactly: `main-page` present but disabled, then the section stack. Every band stays independently reusable and editable.
- *Alternative considered:* one monolithic `c-main-technology.liquid`. Rejected — zero reuse, giant schema, contradicts the modular mandate.

### Two new sections, not one general "content columns" section
`c-icon-features` (band 3) and `c-content-panel` (bands 4 and 5) have different markup languages (centered icon tiles vs. left-aligned prose + bordered stat columns). Forcing them into one section means conditional markup and settings sprawl. Two focused sections match the theme's granularity (`multi-column`, `key-features`, `testimonials` are all separate).
- *Alternative considered:* single section with `icon-feature` and `stat` block types. Rejected — no shared markup, and the patterns don't recur elsewhere in the Figma to justify the generality.

### `c-content-panel` covers both the gray panel and the black band via per-section color pickers
One section, two template instances: Fill Power (background `#f9fafb`-equivalent, black text, stat blocks) and Responsible Sourcing (black background, white text, arrow-link button block). Color pickers (`background_color`, `text_color`) follow the `key-features` precedent of per-instance colors; global schemes stay untouched. Default background is the design's gray so a freshly added section looks right.
- *Alternative considered:* global scheme repurpose or a new "scheme 3: dark" — rejected (blast radius / theme-settings creep for a single band). Separate "C Text band" section for the black band — rejected (the panel's block model already covers it; a link is just a button block).

### Block models mirror `split-content`/`rich-text` exactly
`c-content-panel` blocks: `heading`, `text` (richtext), `stat` (label + text), `button` (label, link, style: primary/secondary/link). The `link` style renders `small-feature-link` + `{% render 'icon', icon: 'arrow-right' %}` with the same gap-hover idiom as `split-content__link`. `c-icon-features` blocks: `feature` (icon select + optional `image_picker` override, title, text). Consistent IDs (`title`, `text`, `button_label`, `button_link`, `button_style`) so editors see familiar controls.

### Icons: additive `when` branches + per-block image override
Add `droplet`, `thermometer`, `mountain` to `snippets/icon.liquid` (stroke style matched to the existing set, e.g. `feather`). The `feature` block's optional image override is the escape hatch for future icons without touching the snippet again. Purely additive — no existing caller can be affected.
- *Alternative considered:* image-only icons. Rejected — merchant-hostile for the default case and loses `currentColor` theming.

### Layout/CSS approach
Each new section gets its own small stylesheet (`assets/c-icon-features.css`, `assets/c-content-panel.css`) loaded with `lazy-stylesheet-attrs`, scoped under `.cif` / `.ccp` class prefixes — same pattern as `featured-collection-carousel.css` / `c-main-collection.css`. Grid columns via the section's own scoped rules (the icon grid is 4/2/1 col at desktop/tablet/mobile per the design's `sm:grid-cols-2 lg:grid-cols-4`; stats are 3/1). Reuse existing container utilities (`container`, `container--no-max`, `container--reading-width`) rather than new width systems. Design tokens used directly where design-pinned: tile/panel gray `#f3f4f6`/`#f9fafb`, text gray `#4b5563` — consistent with the values already pinned in the product-card work.

### Template content defaults
`page.technology.json` hardcodes the Figma copy (headings, paragraphs, stat labels, link targets) as instance settings — the `page.story.json` approach. Hero image and UDD image are left unset (placeholders render) for the merchant to upload; links point at `/pages/about` and the down-jackets collection URL.

## Risks / Trade-offs

- [Hardcoded design grays/blacks in per-section color defaults drift from future theme reskins] → Accepted; identical trade-off already made for the product-card work, and every color is a merchant-editable picker.
- [`image-with-text-overlay` hero tint is the theme's overlay system, not exactly `black/40`] → The overlay opacity comes from theme settings already used by `page.story`; visually equivalent. If the tint reads wrong, adjust the template's overlay style, not the section.
- [`split-content` renders the image at natural aspect ratio, not the Figma's 4:3 crop] → Accepted as minor drift; merchant can upload a 4:3 image. Adding an aspect setting to `split-content` is out of scope (shared section).
- [Arrow-link hover (`gap` animation) needs a small scoped rule in `c-content-panel.css`] → Mirror the existing `.fcc__view-all` 8px→12px gap idiom for consistency.
- [Sequencing on unarchived `add-split-content-section`] → The template references `split-content`, which is already implemented; archive that change before or alongside this one.

## Open Questions

- None blocking. Hero/UDD imagery must be supplied by the merchant (Figma uses Unsplash placeholders).
