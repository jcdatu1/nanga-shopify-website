## 1. Snippet: combined-listing rows

- [x] 1.1 Create `snippets/combined-listing.liquid` with a header comment documenting params (`product`, `section_id`, `set_metafield`, `name_metafield`), the expected metaobject/metafield definitions, and the index-matching convention.
- [x] 1.2 Resolve the two metafield keys via the `namespace.key` split idiom (as in the key-features block); read the product's set list and name list; output nothing when the set list is empty.
- [x] 1.3 For each set: read `variant_label` and `product_list`; build the visible member list skipping blank/inaccessible references; skip the row when fewer than two visible members remain.
- [x] 1.4 Resolve each member's display name: index of this set (compare `system.id`) in the member's own set list → member's name list at that index → fallback first name entry → fallback product title.
- [x] 1.5 Detect image rows via `settings.swatch_option_name contains variant_label`; render the label line (`.label`, with current product's name appended for image rows) and members as anchors: `.opt-label--image` with the sibling featured image (22px-target `image_url` + lazy `image_tag`) for image rows, `.opt-label--btn` pills otherwise.
- [x] 1.6 States: `aria-current="true"` + active class on the current product's entry; `.opt-label--is-unavailable` on members with `available == false`; entries carry `data-cl-url` for the JS. Wrap all rows in `<combined-listing data-section-id="...">` only when at least one row rendered.

## 2. JS: <combined-listing> element

- [x] 2.1 Create `assets/combined-listing.js` defining `<combined-listing>` (guarded by `customElements.get`), with delegated click handling on entry anchors; ignore the current-product entry.
- [x] 2.2 Build the fetch URL: sibling URL + `sections=` section ID plus any `.cc-variant-dependent-section [data-section-id]` IDs (mirroring `variant-picker.js`).
- [x] 2.3 On click: `preventDefault`, set `aria-busy`/`.is-loading`, request-counter guard (last click wins), `theme.fetchCache.fetch`; on success replace each `#shopify-section-<id>`'s content with the fetched HTML, `history.pushState({clSwap: true}, '', siblingUrl)`, restore focus to the matching entry in the new content.
- [x] 2.4 Fallback: on fetch error or empty/missing section HTML, `window.location = siblingUrl`.
- [x] 2.5 `popstate` handling: reload when the transition involves a `clSwap` state marker.
- [x] 2.6 Hover/touchstart preload with the 250ms intent-delay pattern (`theme.fetchCache.preload`), cancelled on mouseleave; skip current/preloaded entries.

## 3. CSS: scoped state styles

- [x] 3.1 In `assets/c-main-product.css` (`.cmp` scope only): row layout for the block (`.cmp__cl` wrapper spacing consistent with `.cmp__variants`), active-entry border reusing `--input-border-color-active` + `--input-active-shadow-width`, current entry `cursor: default`, and a subtle `.is-loading` busy affordance. Do not modify global `.opt-label*` rules.

## 4. Section block + template wiring

- [x] 4.1 In `sections/c-main-product.liquid`: add the `combined-listing` case rendering the snippet (with `block.shopify_attributes`), loading `combined-listing.js` deferred; add the block schema (limit 1, two metafield-key text settings defaulting to `custom.c_combined_listing_set` / `custom.c_combined_listing_name`).
- [x] 4.2 Extend the section header comment's "Store configuration" notes with the metaobject definition and the two index-matched product metafields.
- [x] 4.3 In `templates/product.json`: add the `combined-listing` block ordered above `variant-picker`.

## 5. Verify

- [x] 5.1 Liquid/JSON sanity: snippet and section render paths guard all blank metafield states; `templates/product.json` remains valid JSON; no shared file modified beyond `sections/c-main-product.liquid` + `assets/c-main-product.css`.
- [ ] 5.2 Theme editor (needs store config): product in one color set shows the image-swatch row above the variant picker; current entry active; sold-out sibling greyed but clickable; set-of-one and no-set products render nothing.
- [ ] 5.3 Switching: click swaps gallery/title/price/description/picker/buy buttons without reload; URL updates; back button restores the previous product; hover preload makes repeat switches instant; sibling on an alternate template falls back to full navigation.
- [ ] 5.4 Multi-set product renders two rows with per-set names (index-matching), non-color row as button pills.
