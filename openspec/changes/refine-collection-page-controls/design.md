# Design — refine-collection-page-controls

## Context

- **Header spacing**: `assets/c-page-header.css:4-13` hard-codes `.cph { padding: 48px 0; }` with a `64px 0` override at `min-width: 640px`. The section already sets one CSS custom property inline (`--cph-bg`) per instance (`sections/c-page-header.liquid:16`), so the pattern for adding more per-instance custom properties is established.
- **Filter order**: `snippets/cmc-filters.liquid` was written from scratch for Figma fidelity (per its own header comment) and hard-coded Price as the first block (lines 84-153), then loops `filter_context.filters` a second time for `list`/`boolean` types only (lines 156-174), explicitly skipping `price_range` in that pass. The theme's own native snippet, `snippets/faceted-filters.liquid:116-206`, does not do this — it loops `filter_context.filters` once, in whatever order Search & Discovery returns, and renders `price_range` inline via `{% render 'price-range' %}` at that position. `cmc-filters.liquid`'s deviation is the bug: Search & Discovery's admin-configured filter order (e.g. Gender above Price) is silently discarded.
- **Mobile sort**: two separate sort UIs currently exist. `sections/c-main-collection.liquid:52-57` renders a mobile-bar button with `data-toggle-filters`, which opens the shared native drawer; inside that drawer, `snippets/cmc-filters.liquid:176-216` renders a "mobile-only" block of sort radios. Separately, `sections/c-main-collection.liquid:68-118` renders a fully self-contained `<link-dropdown>` sort control in the desktop toolbar — a genuine theme-native custom element (`assets/main.js:1882+`, `window.customElements.define('link-dropdown', ...)`), already used identically in the native `main-collection.liquid:226-276`. `assets/c-main-collection.css:97-102` explicitly hides that dropdown below 1000px with the comment "Sort dropdown is desktop-only; on mobile, sort lives in the native drawer" — this is the exact behavior the user wants removed. The `.cmc__toolbar` wrapper around it has no such media query — it already renders at every breakpoint (it's only the sort `<link-dropdown>` inside it that's suppressed).

## Goals / Non-Goals

**Goals:**
- Header top/bottom spacing configurable per instance, defaulting to the current fixed values so existing sections are visually unchanged until edited.
- `cmc-filters.liquid` renders filters (including price) in the exact order `filter_context.filters` provides, matching Search & Discovery's admin configuration.
- Sort is available and identical in mechanism (self-contained dropdown, immediate fetch on selection) at every breakpoint; the shared filter drawer no longer carries any sort UI.

**Non-Goals:**
- No changes to `snippets/faceted-filters.liquid`, `snippets/product-card.liquid`, `snippets/pagination-control.liquid`, or the `<filter-container>` / `link-dropdown` engines in `assets/main.js` (per the existing `collection-product-grid` spec's "No regressions to shared collection assets" requirement).
- No redesign of the price-bracket UI itself (still radio-style brackets built from `price_brackets` thresholds) — only its position in the render order changes.
- `main-collection.liquid` / `faceted-filters.liquid` (the native, non-NANGA collection path) are out of scope; they already order filters correctly and already use `link-dropdown` for sort.

## Decisions

### Header spacing: four range settings, custom properties, same defaults
Add `padding_top_mobile` (default 48), `padding_top_desktop` (default 64), `padding_bottom_mobile` (default 48), `padding_bottom_desktop` (default 64) range settings (px, e.g. 0-120 step 4). Pipe them into new inline custom properties (`--cph-pad-top-mobile`, `--cph-pad-bottom-mobile`, `--cph-pad-top-desktop`, `--cph-pad-bottom-desktop`) alongside the existing `--cph-bg`, and switch the CSS to consume them:
```css
.cph {
  padding-top: var(--cph-pad-top-mobile, 48px);
  padding-bottom: var(--cph-pad-bottom-mobile, 48px);
}
@media (min-width: 640px) {
  .cph {
    padding-top: var(--cph-pad-top-desktop, 64px);
    padding-bottom: var(--cph-pad-bottom-desktop, 64px);
  }
}
```
Chosen over a single shared top/bottom value (per the earlier discussion) because the existing CSS already differentiates mobile/desktop, and collapsing that distinction would change current visual output for the default preset.
- *Alternative considered:* a single "Vertical padding" setting applied everywhere. Rejected — loses the current 48/64 breakpoint split for every instance unless re-derived via `clamp()`, which is harder for merchants to reason about than four plain range inputs with honest defaults.

### Filter order: one loop, price rendered inline at its natural position
Restructure `cmc-filters.liquid`'s two render passes into a single loop over `filter_context.filters`, branching on `filter.type` inside the loop (skip `filter.v.availability` as today; render the existing bracket-radio markup when `type == 'price_range'`; render the existing checkbox-list markup when `type == 'list'` or `'boolean'`). The pre-loop `{%- liquid ... %}` block that scans for `price_filter` (for the hidden min/max inputs and `has_active`) and the `preserved_q` capture are unaffected — they don't depend on render order, only on finding the price filter object wherever it is.
- *Alternative considered:* keep two passes but reorder them based on `forloop.index` of the price filter. Rejected — needlessly complex (would require a second lookup for "everything before price" and "everything after") when a single loop with a type branch is simpler and matches `faceted-filters.liquid`'s existing approach.

### Mobile sort: reuse the existing toolbar dropdown at all breakpoints; remove the mobile-bar Sort button and the drawer's sort radios
Delete the `@media (max-width: 999.98px) { .cmc__sort { display: none; } }` rule in `assets/c-main-collection.css` so the toolbar's `<link-dropdown>` sort control (already fully AJAX-wired, already styled to spec) renders on mobile exactly as it does on desktop — no new markup, no new JS. Remove the now-redundant mobile-bar Sort button (`sections/c-main-collection.liquid:52-57`) — having two sort triggers on the same page would be confusing and one (the drawer radios) is being removed anyway. Remove the "mobile-only Sort radios" block from `cmc-filters.liquid:176-216` since sort no longer has any presence in the drawer. The mobile-bar Filter button, alone in its row, keeps its current `flex: 1 1 0` styling and naturally fills the row width — no CSS change needed there.
- *Alternative considered:* duplicate the `<link-dropdown>` markup into a second instance styled to sit inside `.cmc__mobile-bar` next to Filter. Rejected — two separate DOM instances of the same sort control (with duplicate `id="sort-dropdown-options"` etc.) is exactly the kind of divergence that caused this bug category in the first place; reusing the single existing instance is simpler and keeps one source of truth for sort markup, matching the "just unhide it" approach already confirmed.

## Risks / Trade-offs

- [Toolbar layout at narrow widths] → `.cmc__toolbar` already renders product count + sort at all breakpoints (only `.cmc__sort` was previously hidden); removing that one rule should just make the row wrap or sit comfortably, but needs a manual mobile-viewport check since it was never exercised at that width before.
- [Removing the mobile-bar Sort button changes the visible button row from two buttons to one] → Intentional per this change; Filter alone fills the row via existing `flex: 1 1 0`. Flagged for merchant/design sign-off during verification, not a code risk.
- [Filter order change is visually different from today for any collection where Price isn't first in Search & Discovery] → Intentional; this is the bug being fixed. Collections where Price is already configured first are visually unchanged.
- [`price_filter` variable name reused inside the new single loop] → The pre-loop scan still assigns `price_filter` for the hidden-input logic; the loop-local branch should read `filter` (the loop variable), not silently shadow-rely on the outer `price_filter` var, to avoid confusion — call this out explicitly in tasks.

## Open Questions

- None blocking.
