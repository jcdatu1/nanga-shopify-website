# add-product-card-combined-listing

## Why

`snippets/combined-listing.liquid` lets a shopper on the PDP discover and jump to a product's sibling listings (separate products, mostly colorways, grouped by a `c_combined_listings` metaobject). That discovery only happens once a shopper has already opened a product page — on the collection grid and featured-collection carousel, sibling colorways look like unrelated single-SKU products with no indication they belong to a set. The `add-combined-listing` design explicitly anticipated this as a follow-up ("if the client later wants sibling swatches on product cards, the name-resolution Liquid should be extracted... at that point"). That point is now.

## What Changes

- **`snippets/combined-listing.liquid`** — gains an optional `card_mode` parameter. In card mode the row renders with no label line (no "Color: Navy" text), caps visible entries to a small limit with a non-interactive `+N` overflow marker (reusing `product-block`'s existing more-label pattern), and skips the `<combined-listing>` custom element / `data-section-id` wrapper entirely — entries are plain `<a href="{{ member.url }}">` links with no click interception. All existing resolution logic (set lookup, visible-member filtering, image-vs-text-row detection, current/sold-out state) is shared unchanged between PDP and card rendering.
- **`snippets/product-card.liquid`** — new `show_combined_listings` parameter (boolean, default `true`). When enabled, a fixed-height row is rendered between the image and the detail block (title/price), always present so grid rows stay level whether or not a given product belongs to a set. Renders `combined-listing` in `card_mode` with the same default metafield keys the PDP block uses (`custom.c_combined_listing_set` / `custom.c_combined_listing_name`, not configurable per section — one store-wide convention).
- **`sections/c-main-collection.liquid`** and **`sections/featured-collection-carousel.liquid`** — new "Show combined listings" checkbox (default on) in each section's Cards settings group, threaded into every `product-card` call.
- **`assets/main.css`** — card-scoped additions in the existing `.product-card` block: the fixed-height row wrapper, the capped-entry overflow marker, and a black-border "current listing" highlight on the matching entry — reusing the PDP's own literal black-border/black-pill treatment (`assets/c-main-product.css`'s `.cl-entry--current` rules), re-scoped for the card context. Global `.opt-label*` / `.option-selector` classes are consumed, not modified.
- **No new JS.** Clicking a sibling entry on a card is a normal navigation to that sibling's product page — no Section Rendering API swap, no `combined-listing.js` on the card path.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `combined-listing`: gains a `card_mode` rendering path (no label, capped entries, plain-link navigation, no custom element) alongside the existing PDP row.
- `product-card`: gains a combined-listing row, in order, between the image and the detail block, gated by `show_combined_listings` (default on).
- `collection-product-grid`: `c-main-collection` gains the "Show combined listings" setting, threaded to `product-card`.
- `featured-collection-carousel`: same setting and threading.

## Impact

- **Modified files:** `snippets/combined-listing.liquid`, `snippets/product-card.liquid`, `assets/main.css`, `sections/c-main-collection.liquid`, `sections/featured-collection-carousel.liquid`.
- **No changes** to `assets/combined-listing.js`, `sections/c-main-product.liquid`, `assets/c-main-product.css`, or `snippets/product-block.liquid` — the PDP block's markup/behavior and the legacy card are untouched.
- **Content dependency:** same metaobject/metafields the PDP block already expects (`c_combined_listings`, `custom.c_combined_listing_set`, `custom.c_combined_listing_name`). Cards for products with no set membership render the reserved-height row empty; no visual regression for stores that don't use combined listings at all.
- **Performance:** no new JS, no new network requests beyond the sibling thumbnails already loaded lazily via the theme's `image` snippet, capped to a small number of entries per card.
