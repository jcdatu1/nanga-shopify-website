## 1. Page header spacing settings

- [x] 1.1 In `sections/c-page-header.liquid` schema, add four `range` settings: `padding_top_mobile` (default 48), `padding_top_desktop` (default 64), `padding_bottom_mobile` (default 48), `padding_bottom_desktop` (default 64) — px units, sensible min/max/step (e.g. 0-120, step 4).
- [x] 1.2 In `sections/c-page-header.liquid`, extend the inline `style` attribute to set `--cph-pad-top-mobile`, `--cph-pad-bottom-mobile`, `--cph-pad-top-desktop`, `--cph-pad-bottom-desktop` from the new settings, alongside the existing `--cph-bg`.
- [x] 1.3 In `assets/c-page-header.css`, replace the hard-coded `padding: 48px 0` / `padding: 64px 0` rules with `padding-top`/`padding-bottom` reading the new custom properties (falling back to 48px/64px respectively so any instance missing the settings still renders correctly).

## 2. Filter order mirrors Search & Discovery

- [x] 2.1 In `snippets/cmc-filters.liquid`, remove the standalone "Price Range: radio brackets" block that renders unconditionally before the filter loop.
- [x] 2.2 Merge price-bracket rendering into the existing `{%- for filter in filter_context.filters -%}` loop: keep the `filter.v.availability` skip, add a branch for `filter.type == 'price_range'` (using the loop's `filter` variable, not the outer `price_filter` scan variable, for the label/values) that renders the same bracket-radio markup at that position, and keep the existing `list`/`boolean` branch as today.
- [x] 2.3 Confirm the pre-loop `price_filter` assignment, hidden min/max inputs, `has_active` flag, and `preserved_q` capture are untouched (they don't depend on render order).

## 3. Mobile sort uses the same self-contained dropdown as desktop

- [x] 3.1 In `assets/c-main-collection.css`, delete the `@media (max-width: 999.98px) { .cmc__sort { display: none; } }` rule (and its now-stale comment) so the toolbar `<link-dropdown>` sort control renders at every breakpoint.
- [x] 3.2 In `sections/c-main-collection.liquid`, remove the mobile-bar Sort button (`{% if section.settings.show_sort %}` block inside `.cmc__mobile-bar`) — sort is no longer triggered from that row.
- [x] 3.3 In `snippets/cmc-filters.liquid`, remove the "Mobile-only Sort" block (the `cmc-filter--sort mobile-only` radios) and its header comment reference.
- [x] 3.4 Update the header comment in `sections/c-main-collection.liquid` (currently says "mobile uses the theme's native filter drawer with a Filter / Sort button row") to reflect that only Filter uses the drawer; Sort is a standalone dropdown at all sizes.

## 4. Verify on the live theme

- [ ] 4.1 Page header: confirm default padding is visually unchanged (48px mobile / 64px desktop); adjust the new settings in the theme editor and confirm the band resizes accordingly at both breakpoints.
- [ ] 4.2 Collection filters: in Search & Discovery, order a non-price filter (e.g. Gender/Size) above Price; confirm the storefront filter sidebar/drawer shows them in that same order. Confirm price bracket links, checkbox filters, "Clear All Filters", and AJAX refresh still work.
- [ ] 4.3 Mobile sort: confirm the mobile-bar row now shows only Filter (filling the row); confirm the toolbar sort dropdown appears and works identically to desktop (opens, selects, triggers an AJAX reorder, closes) at mobile widths; confirm the filter drawer no longer contains any sort control.
- [ ] 4.4 Desktop: confirm no regression — sidebar filter order, sort dropdown, and toolbar layout behave as before aside from the intentional order fix.
