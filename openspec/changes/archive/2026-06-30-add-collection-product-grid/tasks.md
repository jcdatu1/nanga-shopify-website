## 1. Section scaffold

- [x] 1.1 Create `sections/c-main-collection.liquid` with a top-level `{% paginate collection.products by section.settings.coll_num_per_page_int %}` block and a root `<div class="cmc">` wrapper (no title/heading/description/related-collections markup).
- [x] 1.2 Add the `{% schema %}` with name (e.g. "C Collection grid"), and an empty `presets`/no-preset as appropriate for a `main-` style template section.
- [x] 1.3 Load the section-scoped stylesheet `assets/c-main-collection.css` via `<link rel="stylesheet" ...>` using the theme's lazy-stylesheet attrs pattern.

## 2. Settings schema

- [x] 2.1 Add visibility toggles: `enable_filtering` (Display Filter, default true), `show_sort` (Display Sort, default true), `show_total` (Display page count, default true).
- [x] 2.2 Add grid settings: `grid` (products per row desktop, range 2–5, default 3), `mobile_grid` (products per row mobile, range 1–2, default 2), `coll_num_per_page_int` (products per page, range, default 24).
- [x] 2.3 Copy the card-controlling settings from `featured-collection-carousel.liquid` schema: `tag_style`, `tag_position` (overlay/inside), `show_border`.

## 3. Filters + AJAX wiring (reuse engine, no new JS)

- [x] 3.1 Wrap filters + grid + pager in `<filter-container class="filter-container filter-container--side filter-container--show-filters-desktop" data-ajax-filtering="{{ settings.ajax_products }}" data-filter-section-id="{{ section.id }}">`.
- [x] 3.2 Compute `show_filters` (enable_filtering AND `collection.filters != empty`) and `current_sort = collection.sort_by | default: collection.default_sort_by`.
- [x] 3.3 Render `{% render 'faceted-filters', filter_context: collection, clear_url: collection.url, current_sort: current_sort %}` when filters are shown (this emits `#CollectionFilterForm`).
- [x] 3.4 Add `data-ajax-scroll-to` to the scroll anchor and confirm `.section-header` exists in layout for the engine's post-fetch scroll offset.

## 4. Grid (reuse product-card)

- [x] 4.1 Render the product column with `<div class="product-grid product-grid--per-row-{{ section.settings.grid }} product-grid--per-row-mob-{{ section.settings.mobile_grid }}" data-ajax-container>`.
- [x] 4.2 Map `tag_style` to `badge_bg`/`badge_text` and loop `collection.products`, rendering `{% render 'product-card', product: product, badge_position: section.settings.tag_position, show_border: section.settings.show_border, badge_bg: badge_bg, badge_text: badge_text %}`.
- [x] 4.3 Render the theme's empty-collection message when `collection.products.size == 0` (keep the `data-ajax-container` wrapper present and count/order stable on fetch).
- [x] 4.4 Render `<div class="cmc__pagination" data-ajax-container>{% render 'pagination-control', paginate: paginate %}</div>`.

## 5. Desktop layout (Figma-faithful)

- [x] 5.1 Build the count + sort row inside the product column (above the grid): product total ("N Products", gated on `show_total` and `paginate.items > 0`) on the left, sort `<link-dropdown>` on the right.
- [x] 5.2 In `c-main-collection.css`, scope a `.cmc` layout: left sidebar (fixed width) + flex product column; ensure the count+sort row does not span the sidebar.
- [x] 5.3 Hide the Filter toggle button on desktop (mobile-only); ensure the desktop sidebar is permanently visible via `filter-container--show-filters-desktop`.
- [x] 5.4 Verify `product-card` renders correctly inside `.product-grid` (spacing/aspect); add minimal `.cmc`-scoped CSS only if needed.

## 6. Mobile layout (native drawer + button row)

- [x] 6.1 Add a `mobile-only` two-button row above the grid: a Filter button (`data-toggle-filters`, opens the native drawer) and a Sort `<link-dropdown>` (second, distinct `id`/`aria-controls` from the desktop one).
- [x] 6.2 Style the button row in `c-main-collection.css` to match the Figma (equal-width bordered buttons).
- [x] 6.3 Confirm the native filter drawer (`.filter-shade`, `faceted-filters`) opens/closes and applies filters via AJAX unchanged.

## 7. Template wiring

- [x] 7.1 Repoint `templates/collection.json` `main` section `type` to `c-main-collection`.

## 8. Verification

- [x] 8.1 Run theme-check; resolve any new errors (ignore the known pre-existing default-theme capture/div noise).
- [ ] 8.2 In the theme editor, toggle each setting (filter/sort/count, desktop/mobile columns, per-page) and confirm correct rendering.
- [ ] 8.3 Verify dynamic behavior with no full reload: apply/remove a filter, change sort (desktop and mobile), paginate, and use the browser back button.
- [ ] 8.4 Verify edge cases: collection with filters, collection without filters, and empty/over-filtered result.
- [x] 8.5 Confirm no edits were made to `product-card.liquid`, `faceted-filters.liquid`, `pagination-control.liquid`, or `main.js`, and that `main-collection` still renders if reselected.
