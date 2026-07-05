## Context

The home page design (`context/NANGAv1/src/app/pages/Home.tsx`) closes with a "CATEGORY" block — a row of circular collection tiles with uppercase labels — flattened into a static image (`image-4.png`) in the React export. The theme has no matching section.

The theme already ships a closely related, recently-built section: `sections/featured-collection-carousel.liquid` (scoped `.fcc`, asset `assets/featured-collection-carousel.css`). It renders a collection's products as a horizontal carousel using the theme's native `<carousel-slider>` element (`assets/slider.js` / `assets/main.js`) and the shared `slider` + `product-grid--per-row-{N}` / `product-grid--per-row-mob-{M}` grid classes. Navigation arrows auto-hide when items fit, via the engine's `[inactive]` state and the global `.carousel[inactive] .slider-nav { display:none }` rule.

The new section is mechanically the same carousel, with two differences: it is **blocks-based** (merchant curates collections) rather than collection-products-based, and each tile is a **circular** image well + label rather than a product card.

Constraints (per `CLAUDE.md`): minimally invasive, no new JS/CSS frameworks or dependencies, reuse existing engine/classes/snippets, scope new CSS, do not mutate shared paths, match surrounding Liquid idioms.

## Goals / Non-Goals

**Goals:**
- A merchant-editable, blocks-based collection-list section that matches the design's circular-tile look.
- Reuse the native `<carousel-slider>` engine and shared grid classes so responsive per-row, peek, scroll-snap, and arrow auto-hide behavior come "for free" and stay consistent with `.fcc`.
- Per-block collection link with sensible defaults (collection `featured_image` + `title`) and optional image/label overrides.
- `cards_desktop` / `cards_mobile` settings that gate when scroll + arrows appear.

**Non-Goals:**
- Not modifying or replacing the stock `sections/collection-list.liquid` (heavy rectangular-card section). The new section is a lean sibling.
- No paging (multi-card-per-click) — keep one-at-a-time advance to match `.fcc`.
- No "View All" in the default design (kept as an optional, default-off setting for parity).
- No new global/shared CSS or JS; no changes to `product-card` or other sections.

## Decisions

### Decision 1: New lean section `collection-list-carousel.liquid`, not the stock `collection-list.liquid`
The stock `sections/collection-list.liquid` (~11 KB) renders rectangular collection cards with its own layout settings and does not match the circular design or the `.fcc` conventions the team has standardized on. Building a lean sibling scoped to `.clc` mirrors `featured-collection-carousel` exactly (structure, header, nav, view-all, color-scheme hooks), keeping the "C" section family consistent.
- **Alternative considered:** Extend the stock section with an "image shape: circle" option. Rejected — it's a shared section used elsewhere; mutating it risks other pages and diverges from the team's `.fcc` pattern.

### Decision 2: Reuse the native `<carousel-slider>` + shared grid classes verbatim
Markup copies the `.fcc` carousel scaffold: `<carousel-slider class="carousel block ...">` → `.slider slider--edge-peek slider--mobile-container-pad slider--no-scrollbar` → `.product-grid product-grid--per-row-{cards_desktop} product-grid--per-row-mob-{cards_mobile} slider__grid product-grid--carousel`, with each tile in a `.slider__item`. Arrows reuse the `.slider-nav` block and `icon-chevron-left/right` snippets. Only the scoped class prefix changes (`fcc` → `clc`).
- **Why:** The "show scroll/arrows only past N" requirement is exactly the engine's `[inactive]` behavior driven by per-row count vs. item count. No custom JS needed.
- **Alternative considered:** A bespoke flex/scroll-snap carousel. Rejected — duplicates engine behavior, adds JS, breaks consistency.

### Decision 3: One `collection` block per tile; image/label resolve with overrides
Block settings: `collection` (collection picker), `image` (optional image_picker override), `label` (optional text override). Resolution in Liquid:
- link = `block.settings.collection.url`
- image = `block.settings.image` if present, else `collection.featured_image`
- label = `block.settings.label` if present, else `collection.title`, rendered uppercase via CSS (`text-transform: uppercase`) to preserve the source casing.
Use `{%- if forloop.index > visible_count -%}loading="lazy"{%- endif -%}`-style lazy loading (or simply lazy for all but the first row) with `image_url` + `srcset`/`sizes`.
- **Alternative considered:** Pull images only from the collection (no override). Rejected per design — the Figma uses specific curated product shots, not collection covers.

### Decision 4: Circular tile via scoped `.clc` CSS
`.clc__media` is a `aspect-ratio: 1 / 1; border-radius: 50%; background: <neutral gray>; overflow: hidden;` well containing an `object-fit: contain` image with internal padding; `.clc__label` sits beneath, centered, `text-transform: uppercase`. All rules scoped under `.clc` in `assets/collection-list-carousel.css`, loaded via `lazy-stylesheet-attrs` like `.fcc`.
- **Why scoped:** Per `CLAUDE.md`, avoid mutating shared classes; circular shape is unique to this section.

### Decision 5: Settings mirror `.fcc` for editor familiarity
`title` (default "CATEGORY"), `description` (optional), `cards_desktop` (range 2–6, default 6), `cards_mobile` (range 1–4, default 2), `full_width`, `show_view_all` (default false → `/collections` or a `link` setting), `color_scheme`. `max_blocks` ~12. Provide a `presets` entry under category "Collections" so it appears in the section picker.
- **Note:** Desktop default 6 matches the six tiles in the design; mobile default 2 gives a peek-and-scroll like the featured-product carousel.

## Risks / Trade-offs

- **Featured image missing on a collection** → If a collection has no `featured_image` and no override, the tile would be imageless. Mitigation: render a neutral gray circle (the `.clc__media` background) as a graceful empty state; optionally fall back to the first product image.
- **Per-row count vs. block count mismatch on mobile** → If `cards_mobile` ≥ block count, no scroll on mobile (by design). Acceptable; matches the "gate scroll past N" requirement.
- **`object-contain` with varying source aspect ratios** → Product shots vs. square crops may sit differently in the circle. Mitigation: internal padding + centered contain keeps subjects framed; merchants can use the per-block image override for tricky art.
- **`index.json` is auto-generated by the theme editor** → Adding the instance by hand could be overwritten later. Mitigation: the section + preset is the durable deliverable; the `index.json` instance is a convenience seed and can be re-added in the editor.
- **Color scheme parity** → Reuse the same `use-color-scheme--{n}` hook as `.fcc` so behavior matches; verify gray well contrasts acceptably under non-default schemes.

## Open Questions

- Should an imageless collection fall back to its first product's image, or just show the empty gray circle? (Leaning: empty gray circle for predictability; revisit if merchants report blanks.)
- Should the optional "View All" use a fixed `/collections` URL or a free `url`/`link` setting? (Leaning: a `url` setting for flexibility, default blank/off.)
