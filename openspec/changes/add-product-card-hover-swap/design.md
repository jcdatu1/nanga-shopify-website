# add-product-card-hover-swap — Design

## Context

`snippets/product-card.liquid` is the shared lean card consumed by `sections/featured-collection-carousel.liquid` and `sections/c-main-collection.liquid`, both of which already thread per-section card settings (`image_fit`, `show_type`, `show_value_props`, badge params) through the render call. The card's hover zoom lives in the product-card block of `assets/main.css` (`.product-card:hover .product-card__image img { transform: scale(1.05) }`, 0.5s `cubic-bezier(0.4, 0, 0.2, 1)`); the image container `.product-card__image` already has `position` context via `.product-card__media` and `overflow: hidden`. The feature-rich `product-block` snippet has its own image-swap implementation, but the product-card spec deliberately keeps the lean card standalone. The `custom.c_lifestyle_photo` product metafield exists in the store's content model but is unused in the theme.

## Goals / Non-Goals

**Goals:**
- Per-section choice between hover zoom and hover lifestyle-image swap, defaulting to zoom (zero behavior change until opted in).
- Metafield-driven swap with a graceful fallback per product: no `c_lifestyle_photo` → that card keeps the zoom.
- Pure CSS hover, lazy-loaded swap layer, no new assets or JS, no impact on callers that don't pass the new parameter.

**Non-Goals:**
- No swap support in `product-block` (it already has its own), no swap on the product page gallery.
- No touch/tap swap behavior — like the existing zoom, the effect is hover-only.
- No new metafield definitions created by the theme; wiring assumes the store's existing definition.

## Decisions

- **Parameter name `hover_effect`, values `'zoom'` (default) / `'image'`.** Follows the snippet's existing `image_fit`-style string-parameter convention with `| default:` resolution. A boolean (`enable_swap`) was rejected: a select leaves room for a future `'none'` without another parameter.
- **Fallback is per-card, not per-section.** In swap mode the snippet checks `product.metafields.custom.c_lifestyle_photo != blank`; only then does it render the swap layer and the `product-card--hover-image` modifier — otherwise the card renders exactly as zoom mode. This keeps a mixed-content grid uniform in markup cost and guarantees every card still responds to hover. Rejected alternative: rendering the modifier from the setting alone would leave metafield-less cards with no hover feedback and dead CSS.
- **Swap layer markup: second `image` snippet render inside `.product-card__image`, absolutely positioned, `loading: 'lazy'`, same responsive size columns as the primary image, `aria-hidden` (decorative duplicate of the same link).** Reusing the `image` snippet keeps srcset/sizes behavior identical to every other theme image.
- **Swap layer is always `cover`, regardless of the card's `image_fit`.** A lifestyle photo on the contain-fit card's white 16px padding would look like a sticker; edge-to-edge cover matches how the design treats lifestyle imagery (gray-frame cover cards). The primary image keeps whatever fit the section chose.
- **CSS: opacity cross-fade, zoom suppressed on swapping cards.** `.product-card--hover-image` cards: swap layer `opacity: 0` → `1` on card hover with the card's existing 0.5s/easing tokens; primary image keeps `transform: none` there so the two effects don't compound (a zooming image behind a fading lifestyle shot causes a visible pop when the fade ends). Cards without the modifier are untouched by every new rule.
- **Both sections get an identical "Hover effect" select in their Cards settings group** (`zoom` → "Zoom", `image` → "Change to lifestyle image", default `zoom`), threaded like the existing card params. Info text names the metafield so merchants know what drives it.

## Risks / Trade-offs

- [Metafield namespace or type differs from `custom.c_lifestyle_photo` file/image reference] → The swap silently never triggers (blank check fails). Open question below; a one-line lookup fix if the definition differs.
- [Extra image requests on grids in swap mode] → Lazy loading means the swap images load with the same viewport-driven behavior as primary images; only sections that opt in pay the cost. Acceptable; noted in the setting's info text is not needed.
- [Hover-only effect invisible on touch devices] → Identical to the current zoom's behavior; the lifestyle photo is an enhancement, not information.
- [Lifestyle photo aspect ratio differs from the card's 0.75 frame] → `cover` crops it like every other cover-fit card image; merchants already curate these photos for the grid's lifestyle mode.

## Migration Plan

Additive parameter and settings with safe defaults; deploy with the theme. Existing sections keep `hover_effect` unset → zoom. Rollback = revert; no content or settings migrations.

## Open Questions

- Confirm the metafield definition is `custom.c_lifestyle_photo` and its type is a file/image reference (single). If it's a list, the card should take `.value | first`.
