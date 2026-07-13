# refine-collection-page-controls

## Why

Three gaps between `c-page-header` / `c-main-collection` and what the merchant needs:

1. `c-page-header`'s vertical spacing (48px mobile / 64px desktop) is hard-coded in `assets/c-page-header.css`, so merchants can't adjust the band's height per instance (e.g. a tighter header on a dense collection template).
2. `snippets/cmc-filters.liquid` — the NANGA filter UI used only by `c-main-collection` — always renders the Price filter first, then the remaining list/boolean filters, regardless of the order Search & Discovery gives them. If a merchant orders Gender above Price in the Search & Discovery app, the storefront still shows Price on top, so admin ordering is silently ignored.
3. On mobile, the Sort button opens the shared native filter drawer, where a duplicate "mobile-only Sort radios" block lives inside `cmc-filters.liquid`. Desktop already sorts through a self-contained `<link-dropdown>` on the Sort button itself with no drawer involved — mobile should work the same way instead of routing through the filter drawer.

## What Changes

- **`sections/c-page-header.liquid` / `assets/c-page-header.css`** — add four range settings (padding top/bottom × mobile/desktop), defaulting to the current 48px/64px values, feeding new `--cph-pad-*` custom properties alongside the existing `--cph-bg`.
- **`snippets/cmc-filters.liquid`** — collapse the two-pass render (price first, then list/boolean loop) into a single loop over `filter_context.filters` in Search & Discovery's given order, rendering the existing price-bracket radio markup inline when `filter.type == 'price_range'` at whatever position it falls, matching the ordering behavior `snippets/faceted-filters.liquid` already has.
- **`snippets/cmc-filters.liquid`** — remove the "mobile-only Sort radios" block; sort no longer lives in the filter drawer.
- **`sections/c-main-collection.liquid` / `assets/c-main-collection.css`** — change the mobile Sort button (`.cmc__bar-btn` with `data-toggle-filters`) to host its own `<link-dropdown>` (the same component/markup pattern already used by the desktop toolbar sort control), and drop the `desktop-only` media rule hiding `.cmc__sort` below 1000px so the dropdown is available at all sizes.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `page-header-section`: gains configurable top/bottom vertical padding (mobile + desktop), defaulting to the current fixed values.
- `collection-product-grid`: filter order in the NANGA filter UI mirrors Search & Discovery's configured order (price included, not forced to the top); mobile sort uses the same self-contained dropdown pattern as desktop instead of the native filter drawer.

## Impact

- **Code**: `sections/c-page-header.liquid`, `assets/c-page-header.css`, `snippets/cmc-filters.liquid`, `sections/c-main-collection.liquid`, `assets/c-main-collection.css`.
- **Shared behavior**: no JS changes — reuses the existing `<link-dropdown>` custom element (`assets/main.js`) and the `<filter-container>` AJAX engine as-is. `snippets/faceted-filters.liquid` (used by the native `main-collection.liquid`) is not touched, so that section's behavior is unaffected.
- **Dependencies**: none added.
