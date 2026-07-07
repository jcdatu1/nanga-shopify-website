# Design — add-combined-listing

## Context

Sibling colorways are separate products; the store is not on Plus, so Shopify's native Combined Listings is unavailable. Investigation of the theme found:

- The variant picker already implements the target UX for native combined listings: option values carrying `product_url` render the linked product's featured image as a listed swatch (`snippets/variant-picker.liquid:209-211`), and `assets/variant-picker.js` fetches the other product through the Section Rendering API with hover preloading (`theme.fetchCache.preload`, 250ms intent delay). That flow cannot be reused directly for a custom implementation: `constructVariantUrl` appends the current product's `option_values` IDs (meaningless on an unrelated product), and it replaces only `[data-dynamic-variant-content]` / `[data-dynamic-product-content]` elements — `sections/c-main-product.liquid` has **no** `data-dynamic-product-content` markers, so title, description, trust items, key features, and specifications would go stale.
- The listed-swatch look is provided by global classes: `.option-selector`, `.opt-label--image` (22px circular thumb, `assets/main.css:7463-7475`), `.opt-label--btn` text pills. The greyed sold-out and active-border treatments used inside the picker are scoped under a `variant-picker` ancestor (`assets/main.css:7358`), but standalone equivalents exist (`.opt-label--is-unavailable`, `assets/main.css:7424`; active border pattern `1px var(--input-border-color-active)` + `--input-active-shadow-width` shadow).
- The circle-thumb styling is scoped by the **body class** `swatch-style-listed` set from theme settings (`layout/theme.liquid:177-178`); the section already documents that it expects those swatch settings ("theme" source, option name containing "Color", listed/variant-images style).
- The theme decides "is this a color option?" via `settings.swatch_option_name contains option.name` (`snippets/variant-picker.liquid:58`) — a ready-made convention for label matching.
- `theme.fetchCache` (`assets/main.js:429`) provides cached/deduplicated fetch + preload. `c-main-product` is a JSON-template section, so its `section.id` (e.g. `template--…__main`) resolves through the Section Rendering API on any product URL using the same template.
- The section's blocks render in editor order inside `.cmp__info-inner`; a new block type slots in without touching existing block markup. Custom elements re-construct automatically when swapped-in HTML connects (`cmp-gallery`, `variant-picker`, `product-form` are all idempotent per-instance).

## Goals / Non-Goals

**Goals:**
- Sibling products of a set discoverable and switchable on the PDP with no full page load, matching the existing listed-swatch UI for color sets and the button-pill UI for other sets.
- Multi-set membership supported (e.g. a Color set and a Capacity set → two rows).
- Robust degradation: real links (no-JS / crawler safe), full navigation fallback when the section swap can't be trusted, back button works.
- Zero changes to shared theme files (`variant-picker.*`, `main.js`, global CSS rules).

**Non-Goals:**
- No product-card / collection-grid sibling swatches (PDP only, per client).
- No carrying variant selections across the product switch (sets are cross-product; option IDs don't correspond).
- No admin automation for creating metaobject/metafield definitions — documented expectations only.
- No support for `main-product.liquid` / `featured-product.liquid` / quick-buy contexts.

## Decisions

### Index-matched list metafields for set membership and display name
`custom.c_combined_listing_set` is a **list** of metaobject references and `custom.c_combined_listing_name` a **list** of single-line text; `name[i]` is the product's display name within `set[i]`. A single name field cannot express per-set names (a "Navy / 2-Person" tent is "Navy" in the Color row and "2-Person" in the Capacity row). Resolving a sibling's name for a given set = find the index of that set in the *sibling's* set list (compare `metaobject.system.id`), take the sibling's name at that index; fall back to the sibling's first name entry, then `product.title`.
- *Alternative considered:* single-value fields — breaks multi-set names. Membership metaobject carrying `(set, name)` pairs — cleanest model but doubles authoring and Liquid hops. Rejected for authoring weight; index-matching degrades to identical behavior for single-set products.

### Color detection reuses `settings.swatch_option_name`
A row renders image swatches when `settings.swatch_option_name contains set.variant_label` — identical to the variant picker's own test — and text pills otherwise. No hardcoded `"Color"` string, no new setting; merchant intent stays in one place and CL rows automatically agree with native option rows.

### Whole-section swap via a new self-contained `<combined-listing>` element
Clicking a sibling fetches `/products/<handle>?sections=<section.id>` and replaces the contents of `#shopify-section-<section.id>` with the fetched HTML, then `history.pushState(sibling URL)`. Whole-section replacement sidesteps the missing `data-dynamic-product-content` markers (title/description/etc. update for free) and keeps all logic in a new asset instead of mutating shared `variant-picker.js`.
- Entries are real `<a href="{{ sibling.url }}">` links; JS calls `preventDefault` only when it can handle the swap. No JS → normal navigation.
- **Fallback to full navigation** (`window.location = href`) when the fetch fails or the response has no non-empty HTML for the section ID (e.g. the sibling uses an alternate product template without this section).
- `popstate` → `location.reload()`. Simple and always correct; back/forward restore the right product. The pushed state carries a marker so unrelated popstates aren't affected (reload only when leaving/entering a pushed CL state).
- Hover/touchstart preload through `theme.fetchCache.preload` with the picker's 250ms intent-delay pattern; the click fetch goes through `theme.fetchCache.fetch` so a preloaded hover makes the swap instant.
- During fetch: `aria-busy="true"` on the element and a `.is-loading` class for a subtle busy affordance; concurrent clicks guarded by a request counter (last click wins), mirroring `variantRequestId`.
- *Alternative considered:* dispatching `detail.productUrl` into the existing variant-picker flow — rejected (garbage `option_values` cross-product, stale unmarked content, edits to a shared asset).

### Anchor-based markup with standalone state classes
The row reuses the fieldset-free equivalent of the picker's structure: `.option-selector`-styled wrapper, label line, and `.opt-label opt-label--image` / `.opt-label--btn` **anchors** (not radios — activation navigates, so links are the correct semantics; `aria-current="true"` marks the current product). Because the picker's `:checked` and `is-unavailable` rules are scoped under `variant-picker`, the block uses:
- current product → active-border treatment via a small `.cmp`-scoped rule reusing `--input-border-color-active` / `--input-active-shadow-width` (same variables as the picker's checked state);
- sold out (`sibling.available == false`) → existing standalone `.opt-label--is-unavailable` class, still clickable.
New CSS lives in `assets/c-main-product.css` under the `.cmp` scope; global `.opt-label*` rules are consumed, never edited.

### Block exposes metafield keys as text settings
The `combined-listing` block (limit 1) carries two text settings defaulting to `custom.c_combined_listing_set` and `custom.c_combined_listing_name`, resolved with the same `namespace.key` split idiom as the key-features/specifications blocks. Placement above the variant picker is editor block order (set in `templates/product.json`), not code.

### Visibility rules
- Skip blank/inaccessible product references (drafts/unpublished return empty drops).
- A row renders only when **≥ 2** visible products remain (a set of one says nothing).
- If the current product is missing from a set's `product_list` (authoring mismatch), the row still renders from the metaobject's list — no entry is marked current.
- A product with no set references renders nothing (block is inert; wrapper element only appears when at least one row renders).

## Risks / Trade-offs

- [Index-matched lists are merchant-maintained] → Mismatched indices show a wrong name, never break rendering (fallback chain name[0] → title). Documented in the section header comment.
- [Whole-section swap discards transient state (gallery preview, quantity, scroll-adjacent focus)] → Acceptable: switching products *should* reset product state; focus is restored onto the corresponding link in the new section after swap.
- [Sibling on an alternate template] → detected empty section render → full navigation fallback.
- [`swatch-style-listed` body class not set] → thumbs lose the 22px circle treatment but remain functional; the section already documents the expected swatch settings.
- [Other variant-dependent sections (`.cc-variant-dependent-section`, e.g. size guide) not refreshed by the swap] → included in the `sections=` request and swapped the same way when present, mirroring the picker's behavior.
- [SEO/analytics] → real anchors + pushState keep URLs canonical per product; no duplicate-content risk since siblings are distinct products.

## Migration Plan

Purely additive: new snippet/asset/block/template-entry. Nothing renders until the metaobject definition, product metafields, and block are configured. Rollback = remove the block from `templates/product.json` (instant, editor-level) or revert the commit. No data migration.

## Open Questions

- None blocking. (If the client later wants sibling swatches on product cards, the name-resolution Liquid should be extracted from the snippet into a shared helper at that point — deliberately not pre-built now.)
