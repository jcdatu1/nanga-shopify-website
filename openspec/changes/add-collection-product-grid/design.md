## Context

The collection page in the NANGA Figma (`context/NANGAv1/src/app/pages/ProductCategory.tsx`) is: a left filter sidebar (Price Range radios, Size checkboxes, Clear All) on desktop, a count + sort row above the grid inside the product column, and a 2-up (mobile) / 3-up (desktop) grid of lean product cards. On mobile the design collapses to a Filter / Sort button row.

The theme already ships a full collection section, `sections/main-collection.liquid` (Clean Canvas / Symmetry lineage). It carries title, heading image, description, and related-collections markup, and renders the feature-rich `product-block`. Crucially, it also already wires up the theme's **AJAX filtering engine**: the `<filter-container>` custom element in `assets/main.js` intercepts filter-form `change`/`submit`, sort `.link-dropdown__link` clicks, `.pagination a` clicks, applied-filter removals, and `popstate`; it fetches `?…&section_id=<id>`, then swaps the `innerHTML` of every `[data-ajax-container]` in the section. This is gated on `data-ajax-filtering="{{ settings.ajax_products }}"`.

So the dynamic-fetch requirement is already satisfied by existing, shared theme code. The lean card, `snippets/product-card.liquid`, exists and is currently consumed only by `sections/featured-collection-carousel.liquid`, which also defines the card-controlling settings (`tag_style`, `tag_position`, `show_border`).

## Goals / Non-Goals

**Goals:**
- A title-less collection section, `c-main-collection`, rendering filters + a `product-card` grid.
- Dynamic filter/sort/pagination with **zero new JavaScript**, by reusing `<filter-container>`.
- Desktop layout faithful to the Figma; mobile reusing the theme's native filter drawer plus a Figma-style Filter/Sort button row.
- New section settings: Display Filter / Sort / page count toggles; desktop, mobile, and per-page counts.
- No edits to shared snippets or `assets/main.js`; existing `main-collection` left intact as fallback.

**Non-Goals:**
- The collection title section (separate work).
- Reworking the mobile filter UI into a Figma-style inline accordion — we deliberately keep the native off-canvas drawer.
- Any change to `product-card`, `faceted-filters`, `pagination-control`, or the AJAX engine.
- Adding swatches/quick-buy/hover-swap (those live in `product-block`, intentionally not used here).

## Decisions

### D1: New section file, not an edit to `main-collection`
Create `sections/c-main-collection.liquid` and repoint `templates/collection.json`'s `main` to it. **Why:** minimally invasive and fully reversible; `main-collection` stays as a working fallback; avoids regressing the many behaviors bundled into the stock section. *Alternative considered:* gutting `main-collection` in place — rejected, mutates a working shared section and loses the original layout.

### D2: Reuse the `<filter-container>` AJAX engine verbatim
Wrap the filters + grid + pager in `<filter-container data-ajax-filtering="{{ settings.ajax_products }}" data-filter-section-id="{{ section.id }}">`, render `faceted-filters` (which emits `#CollectionFilterForm`), mark the grid and pager wrappers with `data-ajax-container`, and add `data-ajax-scroll-to` on the scroll anchor. The engine keys entirely off these attributes and selectors, so the section gets dynamic filter/sort/pagination + back-button support for free. **Why:** satisfies "dynamic, not reload" with no new JS, honoring CLAUDE.md's no-new-dependencies rule. *Alternative considered:* hand-written `fetch` — rejected as redundant and a maintenance/bloat liability.

### D3: Sort uses the existing `<link-dropdown>` component on both breakpoints
Desktop renders the sort `<link-dropdown>` in the count+sort row; mobile renders the same component as the second button in the Filter/Sort row. The engine already AJAX-intercepts `.link-dropdown__link` anchors, so the mobile "Sort button" needs **no new JS** — only markup + CSS to position it. **Why:** matches Figma's two-button mobile row while staying on the supported AJAX path. *Alternative considered:* a native `<select>` for mobile sort (as in the Figma source) — rejected because the engine doesn't listen to a standalone select's change for sort, which would force new JS.

### D4: Column counts are section settings; mobile count overrides the global
Use `.product-grid--per-row-{{ grid }}` (desktop, 2–5) and `.product-grid--per-row-mob-{{ mobile_grid }}` (mobile, 1–2) — classes that already exist in `assets/main.css`. The stock section pulls mobile columns from the global `settings.prod_thumb_mob_per_row`; here we read a section setting instead so the section is self-contained and Figma-accurate (3 desktop / 2 mobile defaults). **Why:** independent, per-section control as requested. *Alternative considered:* keep the global — rejected, not configurable per the request.

### D5: Desktop count+sort row lives inside the product column
Unlike the stock full-width `utility-bar` that spans above both sidebar and grid, the Figma places "N Products" + Sort in a row at the top of the product column, right of the sidebar. Implement via a section-scoped flex/grid layout: sidebar (fixed width) + product column (flex), with the count+sort row as the first child of the product column. **Why:** desktop fidelity. This is the main structural deviation from stock and the primary new CSS.

### D6: Mobile keeps the native drawer; no Filter toggle on desktop
Reuse `faceted-filters`' native off-canvas drawer (`.filter-shade`, `data-toggle-filters`) unchanged for mobile. On desktop, render filters as a permanently-visible sidebar (`filter-container--side filter-container--show-filters-desktop`) with the Filter toggle button hidden (mobile-only). **Why:** the drawer is robust, accessible, and already AJAX-wired; the Figma shows desktop filters always open with no toggle.

### D7: Section-scoped CSS in a dedicated asset
Put the new sidebar/count-row/mobile-button-row styles in `assets/c-main-collection.css`, loaded by the section, scoped under a section class (e.g. `.cmc`). **Why:** avoids touching `main.css` shared rules and keeps the new layout isolated. Reuse existing `.product-grid--per-row-*`, `product-card`, filter, and pagination styles rather than duplicating them.

## Risks / Trade-offs

- **`product-card` was built for the carousel slider, not a CSS grid** → Verify it sits correctly as a child of `.product-grid`; add only minimal scoped CSS if spacing/aspect needs adjustment. Don't alter the shared card.
- **Two sort `<link-dropdown>` instances (desktop + mobile) on one page** → ensure unique `id`s / `aria-controls` so the component and accessibility wiring don't collide; one is `desktop-only`, the other `mobile-only`.
- **AJAX container count/order must match between initial and re-rendered HTML** → the engine swaps `[data-ajax-container]` by index, so the set and order of those wrappers must be identical on first render and on fetch response (same section template guarantees this, but keep conditionals from changing the container count).
- **Repointing `collection.json`** changes every collection page at once → low risk since it's a template default; `main-collection` remains available to revert. Verify on a collection with filters, one without filters, and an empty/over-filtered result.
- **`data-ajax-scroll-to` offset uses `.section-header`** → confirm that element exists in the NANGA layout so the post-fetch scroll doesn't throw.

## Migration Plan

1. Add `sections/c-main-collection.liquid` and `assets/c-main-collection.css`.
2. Repoint `templates/collection.json` `main` → `c-main-collection`.
3. Validate with theme-check and in the editor: filters on/off, sort on/off, count on/off, desktop vs mobile, AJAX filter/sort/pagination, back button, empty collection.
4. **Rollback:** repoint `templates/collection.json` `main` back to `main-collection`; the stock section is untouched.

## Open Questions

- Should the desktop sidebar be sticky (Figma uses `sticky top-24`)? The theme has `sticky-scroll` via `enable_sticky_filter` in `faceted-filters` — reuse it or keep static for v1.
- Does `product.type` (the card's category line) populate for NANGA's catalog, or should the value-prop metafield line be relied on instead? Affects card visual parity but not this section's structure.
