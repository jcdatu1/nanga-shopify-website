# add-product-card-hover-swap

## Why

The lean `product-card` snippet always applies a hover scale-zoom (1.05 / 500ms) to the product image. The merchant wants sections that use the card to choose the hover behavior per section: keep the zoom, or cross-fade to a lifestyle photo from the product's `custom.c_lifestyle_photo` metafield — a common PLP pattern the current card explicitly excludes ("does NOT render … hover image-swap"). The metafield is not referenced anywhere in the theme yet, so this change wires it up end to end.

## What Changes

- **`snippets/product-card.liquid`** — new optional `hover_effect` parameter: `'zoom'` (default, current behavior) or `'image'`. With `'image'`, when the product has a `custom.c_lifestyle_photo` image the card renders it as a second, lazy-loaded layer over the featured image and cross-fades to it on hover; products without the metafield fall back to the zoom so cards in one grid never feel dead on hover. The card gains a `product-card--hover-<effect>` modifier.
- **`assets/main.css`** — card-scoped rules in the existing product-card block: stack the swap layer absolutely over the primary image, opacity cross-fade using the card's existing 0.5s / `cubic-bezier(0.4, 0, 0.2, 1)` transition language; suppress the zoom on cards actually swapping. The swap layer always renders `cover` edge-to-edge (a lifestyle photo shouldn't sit on the contain-fit white padding).
- **`sections/featured-collection-carousel.liquid`** and **`sections/c-main-collection.liquid`** — new "Hover effect" select (Zoom / Change to lifestyle image, default Zoom) in each section's Cards settings group, threaded into every `product-card` render call like the existing `image_fit`/`show_type`/`show_value_props` parameters.
- **No new assets, no JS** — hover is pure CSS; touch devices simply don't trigger it, same as the current zoom.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `product-card`: the "no hover image-swap" exclusion becomes parameter-controlled; hover behavior is now a `hover_effect` contract with zoom as the unchanged default and a metafield-driven image swap as the opt-in.
- `featured-collection-carousel`: Cards settings gain the Hover effect select, threaded to the snippet.
- `collection-product-grid`: same setting and threading for `c-main-collection`.

## Impact

- **Modified files**: `snippets/product-card.liquid`, `assets/main.css`, `sections/featured-collection-carousel.liquid`, `sections/c-main-collection.liquid`.
- **Backwards compatibility**: `hover_effect` defaults to `'zoom'`, so existing installs and any other future caller render exactly as today until a merchant opts in.
- **Content dependency**: product metafield `custom.c_lifestyle_photo` (image/file reference, assumed in the default `custom` namespace like `c_product_badge` / `c_card_value_prop` — confirm in admin). Products missing it keep the zoom even in swap mode.
- **Performance**: the swap image is lazy-loaded through the theme's `image` snippet at the same responsive sizes as the primary image; sections not opting in render no extra markup at all.
