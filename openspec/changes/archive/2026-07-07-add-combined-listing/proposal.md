# add-combined-listing

## Why

The client sells sibling products (mostly colorways) as **separate products**, not variants of one product. Shopify's native Combined Listings feature — which this theme's variant picker already supports (`value.product_url` handling in `snippets/variant-picker.liquid`, cross-product fetch/swap in `assets/variant-picker.js`) — is Plus-only, so the store cannot use it. Shoppers on a PDP currently have no way to discover or jump to a product's siblings.

A metafield/metaobject-driven equivalent is needed: a merchant defines a "set" (metaobject) listing the sibling products, each product declares its membership and display name, and the PDP renders a variant-picker-style selector row that switches products seamlessly via the Section Rendering API.

## What Changes

- **Store configuration (admin, no code)** — documented in the section header comment:
  - Metaobject definition `c_combined_listings` with fields `product_list` (list of product references) and `variant_label` (single-line text, e.g. "Color").
  - Product metafields `custom.c_combined_listing_set` (**list** of `c_combined_listings` metaobject references) and `custom.c_combined_listing_name` (**list** of single-line text), **index-matched**: `name[i]` is the product's display name within `set[i]`.
- **`snippets/combined-listing.liquid`** (new) — renders one selector row per set the product belongs to: label line (`variant_label`, plus the current product's name for image rows), sibling entries as real `<a>` links reusing the theme's `.option-selector` / `.opt-label` look. Rows whose `variant_label` matches `settings.swatch_option_name` render image swatches (sibling featured image, 22px circle, listed style); other rows render text button pills. Current product = active state; sold-out siblings greyed but clickable; unpublished/empty references skipped; a row with fewer than two visible products is not rendered.
- **`assets/combined-listing.js`** (new) — `<combined-listing>` custom element: intercepts sibling link clicks, fetches the sibling product page via the Section Rendering API (`?sections=<section-id>`), swaps the whole `c-main-product` section content, `history.pushState`s the new product URL, hover-preloads via `theme.fetchCache` (250ms intent delay), reloads on `popstate`, and falls back to full navigation when the fetch cannot be used.
- **`sections/c-main-product.liquid`** — new `combined-listing` block (limit 1) rendering the snippet; block settings expose the two metafield keys (text settings, same idiom as the key-features/specifications blocks). Header comment documents the store configuration.
- **`assets/c-main-product.css`** — small `.cmp`-scoped additions only where the reused option-selector classes don't cover the block (active/sold-out states outside a `<variant-picker>` ancestor).
- **`templates/product.json`** — add the `combined-listing` block above the variant picker.

## Capabilities

### New Capabilities
- `combined-listing`: metaobject-driven sibling-product selector on the product page with seamless product switching.

### Modified Capabilities
<!-- None — no existing spec'd capability changes. The variant picker, product card, and other sections are untouched. -->

## Impact

- **Code:** one new snippet, one new JS asset, scoped CSS additions in `assets/c-main-product.css`, one new block in `sections/c-main-product.liquid`, one block entry in `templates/product.json`. No changes to `snippets/variant-picker.liquid`, `assets/variant-picker.js`, or any shared snippet/asset.
- **Shared behavior:** the block reuses global `.opt-label*` classes read-only; new state styling uses the existing standalone `.opt-label--is-unavailable` / active-border patterns without editing them. `theme.fetchCache` is consumed, not modified.
- **Performance:** no new frameworks; one small deferred script loaded only by the section; sibling thumbnails are 22px-rendered images with lazy loading; Liquid loops are bounded by set size (typically 2–6 products).
- **Dependencies:** none added. Feature is inert (renders nothing) until the metaobject/metafields exist and are populated.
