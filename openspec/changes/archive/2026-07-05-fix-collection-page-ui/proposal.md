# fix-collection-page-ui

## Why

Three issues on the live collection page (`/collections/*`, section `c-main-collection`): the sort dropdown's label overlaps its chevron (our `.cmc__sort` override clobbers the global `link-dropdown`'s 40px icon padding); pagination renders below the entire filter layout — under the sidebar's full height — instead of under the product grid, so it's effectively invisible; and the page has no title/description band at all (the grid section is deliberately title-less, but the "separate title section" it defers to was never added). The design's category header is pixel-identical to the existing `c-page-header` section — it only lacks dynamic collection content.

## What Changes

- **`assets/c-main-collection.css`** — restore `padding-inline-end: 40px` on `.cmc__sort .link-dropdown__button` so the absolutely-positioned chevron never sits under the label. Scoped, one rule.
- **`sections/c-main-collection.liquid`** — move the `pagination-control` render from its standalone `[data-ajax-container]` after `</filter-container>` to inside the `.filters-adjacent[data-ajax-container]`, directly after the grid, dropping its own `data-ajax-container` attribute (the AJAX engine index-matches containers; nesting or dangling containers breaks refresh).
- **`sections/c-page-header.liquid`** — additive contextual fallback: when the `title` setting is blank, use the template context's title (`collection.title`, else `page.title`); when the subtitle is blank on a collection, use `collection.description`. Existing static uses are unaffected (their settings are non-blank).
- **`templates/collection.json`** — add a `c-page-header` instance above the grid (blank title → dynamic, gray `#f9fafb` background, border on) so the default collection template always shows the header, per the design's category page.
- **`templates/collection.new-arrival.json`** — add a `c-page-header` instance with transparent background and border off, matching the design's plain New Arrival header. Per-template instances give "gray on some, none on others" via the existing color picker.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `collection-product-grid`: sort control reserves icon space; pagination lives in the product column below the grid within the grid's AJAX container; collection templates gain a dynamic title header instance.
- `page-header-section`: blank title/subtitle settings fall back to the template context (collection title/description, page title).

## Impact

- **Code**: `assets/c-main-collection.css` (one scoped rule), `sections/c-main-collection.liquid` (markup relocation), `sections/c-page-header.liquid` (additive fallback), two collection templates (new header instances).
- **Shared behavior**: no JS changes; the AJAX engine, `pagination-control`, `link-dropdown`, and all global CSS untouched. `c-page-header`'s other consumer (`page.knowledge.json`) sets a non-blank title, so the fallback is inert there.
- **Dependencies**: none added.
