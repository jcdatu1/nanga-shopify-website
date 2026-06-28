## Why

The NANGA home page design ends with a "CATEGORY" block — a row of circular collection tiles (image + uppercase label) linking into the store's collections. This section does not exist in the theme yet; the design was flattened into a static image in the Figma→React export. We need a real, editable Online Store 2.0 section so merchants can curate which collections appear, in what order, with what imagery.

## What Changes

- Add a new `collection-list-carousel` section (a lean sibling to the existing `featured-collection-carousel`), scoped under `.clc`, with its own stylesheet asset.
- Render each collection as a **block** so merchants add/reorder/remove tiles in the theme editor. Each block links to a collection, falling back to the collection's `featured_image` and `title`, with optional per-block image and label overrides.
- Present tiles as a horizontal **carousel** reusing the theme's native `<carousel-slider>` engine and shared `product-grid--per-row` grid classes — no new JS or dependencies.
- Expose `cards_desktop` and `cards_mobile` settings that control how many tiles show per row; scroll behavior and navigation arrows appear automatically only when block count exceeds the per-row value (native slider `[inactive]` behavior). On mobile, tiles edge-peek and scroll like the featured-product/featured-collection carousels.
- Each tile is a **circular** gray image well (`object-contain`) with an uppercase label beneath, matching the design.
- Add one instance to `templates/index.json` after the split-content section to reflect the home-page design.

## Capabilities

### New Capabilities
- `collection-list-carousel`: A blocks-based, carousel home-page section that displays curated collections as circular image tiles with labels, reusing the theme's native slider engine and responsive per-row settings to gate scroll/arrows.

### Modified Capabilities
<!-- None. This is a net-new section; it does not change requirements of existing capabilities. -->

## Impact

- **New files**: `sections/collection-list-carousel.liquid`, `assets/collection-list-carousel.css`.
- **Modified files**: `templates/index.json` (add one section instance to the home page order).
- **Reused, unchanged**: `<carousel-slider>` engine (`assets/slider.js`), shared `slider`/`product-grid--per-row-*` classes (`assets/main.css`), icon snippets (`icon-chevron-left/right`), `animation-attrs`, `lazy-stylesheet-attrs`, color-scheme utilities — consistent with `featured-collection-carousel`.
- **No new dependencies**, no new JS, no changes to shared snippets/classes (additive only; the circular-tile CSS is scoped to `.clc`).
