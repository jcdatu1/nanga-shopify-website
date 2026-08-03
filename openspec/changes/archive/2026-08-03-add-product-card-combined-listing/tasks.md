## 1. Snippet: card-mode rendering

- [x] 1.1 In `snippets/combined-listing.liquid`, add `card_mode` (boolean, default `false`) parameter (originally paired with an `entry_limit` param too — superseded, see §6.1); document in the header comment alongside the existing params.
- [x] 1.2 When `card_mode` is true: skip the `.label` line entirely (no row label, no current-name text, for either row type).
- [x] 1.3 When `card_mode` is true: wrap the row in a plain `<div class="cl-card-row">` instead of `<combined-listing data-section-id="...">`; do not require/consume a `section_id` param in this mode.
- [x] 1.4 ~~When `card_mode` is true: cap the member loop at `entry_limit` visible entries; render any remainder as `<span class="cl-entry--more">+N</span>`~~ — superseded by §6.1 (scroll instead of cap; every visible member renders).
- [x] 1.5 Verify PDP call site (`sections/c-main-product.liquid`) is unaffected — `card_mode` omitted there, defaults to `false`, output byte-identical to before.

## 2. Product card: row + setting

- [x] 2.1 In `snippets/product-card.liquid`, add `show_combined_listings` (boolean, default `true` via the existing `| default: true, allow_false: true` idiom used by `show_type`/`show_value_props`).
- [x] 2.2 When true, render `<div class="product-card__combined-listing">{% render 'combined-listing', product: product, card_mode: true, set_metafield: 'custom.c_combined_listing_set', name_metafield: 'custom.c_combined_listing_name' %}</div>` between `.product-card__media` and `.product-card__detail`. Render the wrapper unconditionally (even when the product has no set) so the row's height is always reserved.
- [x] 2.3 Update the snippet's header comment: document `show_combined_listings` and the two metafields it reads.

## 3. Section settings

- [x] 3.1 In `sections/c-main-collection.liquid`, add a "Show combined listings" checkbox (default `true`) to the "Cards" settings group; thread `show_combined_listings: section.settings.show_combined_listings` into the `product-card` render call.
- [x] 3.2 Make the same schema addition and threading in `sections/featured-collection-carousel.liquid`.

## 4. Styles

- [x] 4.1 In the `.product-card` block of `assets/main.css`: `.product-card__combined-listing` — fixed/min-height row, flex layout, margin between media and detail. Card-scoped overrides shrink `.cl-entry` padding/min-height and the `.opt-label--image` swatch box (global PDP-sized defaults — 48px min-height, 22px swatch under `swatch-style-listed`, else 50%-width — are too large for a card row). Superseded/extended by §6.1 (scroll) and §6.3 (thumbnail size).
- [x] 4.2 Add `.product-card__combined-listing .cl-entry--current` rules mirroring `assets/c-main-product.css`'s existing `.cmp .cl-row .cl-entry--current` treatment (literal `2px solid #000` border for image entries, black-filled pill for text entries) — re-scoped, not shared via a global selector change.
- [x] 4.3 ~~Style `.cl-entry--more` (the `+N` overflow marker)~~ — superseded by §6.1; the class and its styles were removed when the cap was dropped.
- [x] 4.4 Sold-out siblings: the plain global `.opt-label--is-unavailable` (radio-driven swatches) is a different, subtler treatment than the PDP's own X-strikethrough for `.cl-entry` (`assets/c-main-product.css:405-417`, scoped under `.cmp`). Restated the X-strikethrough under `.product-card__combined-listing` instead, so cards match the PDP's actual sold-out look rather than the generic swatch one.

## 6. Follow-up refinements (post-review)

- [x] 6.1 Removed `entry_limit`/cap/`cl-entry--more` from `snippets/combined-listing.liquid` and `assets/main.css`. Every visible member now renders in card mode; `.product-card__combined-listing .option-selector__btns` is `flex-wrap: nowrap; overflow-x: auto` (hidden scrollbar via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, matching `.slider--no-scrollbar`'s technique) with `flex-shrink: 0` on `.cl-entry` and `min-width: 0` on the intervening `.option-selector` flex item (the standard fix for a flex child's content-based minimum size otherwise blocking `overflow-x` from ever kicking in).
- [x] 6.2 Image-row entries in card mode: added `visually-hidden` to the `<span class="js-value">` name text (kept in the DOM for the accessible name, not shown). Text-pill entries unaffected — they still show their name visibly.
- [x] 6.3 Removed the outer `.opt-label` button-chip (border/background/padding/min-width/min-height) from `.product-card__combined-listing .cl-entry.opt-label--image` — just the image renders, no surrounding box. Text-pill entries keep the chip.
- [x] 6.4 Increased the thumbnail size from 22px to 40px (`.product-card__combined-listing .cl-entry.opt-label--image .opt-label__media`); bumped the row's `min-height` from 32px to 40px to match so nothing clips.
- [x] 6.5 Re-ran `shopify theme check` and the brace-balance check after each of the above; also caught and fixed a latent bug from an earlier pass — a CSS comment containing a literal `.opt-label*/.option-selector` substring that prematurely closed the comment block (the IDE's CSS diagnostics flagged it; fixed by rewording).

## 5. Verify

- [x] 5.1 Liquid sanity: ran `shopify theme check` across the theme — zero offenses on `combined-listing.liquid`, `product-card.liquid`, `c-main-collection.liquid`, and `featured-collection-carousel.liquid` (pre-existing offenses elsewhere are unrelated to this change); confirmed the two sections' `{% schema %}` blocks still parse as valid JSON; confirmed `assets/main.css` braces stay balanced after the new rules (re-checked after §6 too).
- [ ] 5.2 Theme editor (needs store config): a product in a 3+ member color set shows image swatches below its card's main image (scrolling horizontally if the set is wide), current entry black-bordered, sold-out sibling greyed but clickable, clicking a sibling navigates to that product's page. **Not yet verified — no live theme preview in this session.**
- [ ] 5.3 Grid evenness: in a `c-main-collection` grid mixing set and non-set products, every card in the same row has equal height regardless of combined-listing membership. **Not yet verified.**
- [ ] 5.4 Toggle off "Show combined listings" in both sections and confirm the row (and its reserved height) disappears entirely. **Not yet verified.**
- [ ] 5.5 A non-color set (text-button pills) renders correctly on the narrowest supported card width (mobile 2-up), and a wide color set scrolls horizontally rather than wrapping or overflowing the card. **Not yet verified.**
