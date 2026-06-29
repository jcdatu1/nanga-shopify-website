## Why

The NANGA collection page (Figma `ProductCategory`) needs a clean products area — sidebar filters on desktop, a Filter/Sort button row on mobile, and a responsive grid of the lean `product-card` — with the page title living in its own separate section. The theme's stock `main-collection` section bundles title/heading/related-collections and renders the feature-rich `product-block`, so it doesn't match the design and can't be split. We need a title-less collection grid section that reuses the existing AJAX engine and the NANGA card.

## What Changes

- **New section `c-main-collection`** rendering only the filters + product grid (no title/heading/description/related-collections). The collection title becomes a separate section.
- **Reuse the lean `product-card` snippet** (currently only used by the carousel) for grid items, instead of `product-block`. Copy the card-controlling settings from the carousel section (`tag_style`, `tag_position`, `show_border`) into this section's schema and thread them into the render call.
- **New section settings**:
  - `enable_filtering` (Display Filter), `show_sort` (Display Sort), `show_total` (Display page count) — visibility toggles.
  - `grid` (products per row, desktop), `mobile_grid` (products per row, mobile), `coll_num_per_page_int` (products per page).
- **Dynamic filter / sort / pagination via fetch, no full reload** — reuse the theme's existing `<filter-container>` AJAX engine (`assets/main.js`) with `data-ajax-filtering` + `data-filter-section-id` + `[data-ajax-container]`. No new JavaScript.
- **Mobile**: reuse the theme's native off-canvas filter drawer as-is. Add a Figma-style two-button row (Filter + Sort) above the grid.
- **Desktop**: faithful to Figma — filters permanently visible as a left sidebar (no Filter toggle), a "N Products" + Sort row inside the product column (not a full-width utility bar), and a multi-column grid.
- **Section-scoped CSS** in a new asset (or scoped block) for the desktop sidebar layout, the count+sort row, and the mobile button row. No edits to shared snippets, `faceted-filters`, `pagination-control`, `product-card`, or `main.js`.
- Point `templates/collection.json`'s `main` section at the new section. The existing `main-collection.liquid` is left untouched as a fallback.

## Capabilities

### New Capabilities
- `collection-product-grid`: A title-less collection section that renders faceted filters and a responsive `product-card` grid with dynamic (AJAX) filter, sort, and pagination; desktop sidebar layout faithful to the NANGA Figma, mobile using the theme's native filter drawer plus a Filter/Sort button row; configurable filter/sort/count visibility and desktop/mobile/per-page counts.

### Modified Capabilities
<!-- None. product-card is reused via its existing contract; faceted-filters, pagination-control, and the AJAX engine are reused unchanged. -->

## Impact

- **New code:**
  - `sections/c-main-collection.liquid` — the section (markup + schema).
  - New section-scoped CSS (e.g. `assets/c-main-collection.css`) for desktop sidebar + count/sort row + mobile button row.
- **Edited code:**
  - `templates/collection.json` — repoint `main` to `c-main-collection`.
- **Reused unchanged (shared — must not break):** `snippets/product-card.liquid`, `snippets/faceted-filters.liquid`, `snippets/pagination-control.liquid`, the `<filter-container>` / AJAX engine in `assets/main.js`, and the `.product-grid--per-row-*` classes in `assets/main.css`.
- **Dependencies:** none added. No new JS/CSS frameworks.
- **Out of scope:** the separate collection-title section (tracked separately).
