# Design — add-product-card-combined-listing

## Context

- `snippets/combined-listing.liquid` already resolves everything a card needs: the current product's set (`product.metafields[set_ref].value`), the visible member list (blank/inaccessible references filtered, row skipped below 2 visible members), the image-vs-text-row decision (`settings.swatch_option_name contains cl_set.variant_label`), each member's display name/availability, and current-product detection. This logic is single-value-metafield based (one set per product) and product-agnostic — nothing in it assumes the PDP.
- The only PDP-specific parts of the snippet are: the label line (`variant_label` + current name, image rows only), the `<combined-listing>` custom-element wrapper + `data-section-id` (needed only for the Section Rendering API swap), and the lack of any entry cap (the PDP's info column has room for a full row).
- The card's "currently selected listing" treatment already exists almost verbatim: `assets/c-main-product.css` marks `.cl-entry--current` with a literal `border: 2px solid #000` (image rows) or a black-filled pill (text rows) — scoped under `.cmp`. The user asked for exactly this look on cards, just without the "Color: Navy" label line. So the card doesn't need a new visual language, only a re-scoping of the same rule (the snippet already emits `cl-entry--current` regardless of context).
- `product-card` has no dedicated stylesheet; its rules live inline in `assets/main.css` (`/* Scoped to .product-card*` block, ~line 11441). New card-scoped combined-listing rules belong there, not in a new file.
- `product-block`'s existing `product-block-options__more-label` (`+N`) pattern is the theme's established answer to "too many swatches to show" — reused rather than inventing a new overflow affordance.
- Both card call sites (`c-main-collection.liquid`, `featured-collection-carousel.liquid`) already thread per-card settings (`badge_position`, `image_fit`, `show_type`, `show_value_props`, `hover_effect`) from section settings into `product-card` one parameter at a time — `show_combined_listings` follows the identical idiom.

## Goals / Non-Goals

**Goals:**
- Sibling colorways are discoverable directly from the collection grid and featured carousel, not just after opening a PDP.
- Visual language matches the PDP's combined-listing row exactly (same classes, same current-entry black border/pill, same sold-out treatment) — a shopper who has seen one recognizes the other.
- No grid raggedness: every card in a section reserves the same row height whether or not the product has a set.
- Zero new JS; zero changes to the Section Rendering API swap path (`assets/combined-listing.js`, `sections/c-main-product.liquid`) or to `product-block`.

**Non-Goals:**
- No seamless in-place product switch on cards (PDP-only behavior, per the original design's Non-Goals) — clicking a sibling entry on a card is a plain navigation to that product's page.
- No combined-listing support for `product-block` / the ~15 sections that use it — scoped to the two sections built on the lean `product-card`.
- No per-section metafield-key configuration — the two keys stay hardcoded to the PDP's defaults (`custom.c_combined_listing_set` / `custom.c_combined_listing_name`); this is one store-wide convention, not a per-section choice.

## Decisions

### Extend `combined-listing.liquid` with a `card_mode` parameter, rather than forking the snippet or extracting a data-only helper

Liquid snippets can't return structured data to a caller (only render markup), so "extract the name-resolution logic into a shared helper" — as the original design anticipated — means keeping the resolution `{%- liquid ... -%}` block in one file and branching only at the point where PDP and card markup actually diverge. Concretely, `combined-listing.liquid` gains:
- `card_mode` (boolean, default `false`).
- `entry_limit` (number, default `4`) — only consulted when `card_mode` is true.

When `card_mode` is true:
- The label line (`.label`, with the current name for image rows) is skipped entirely.
- The outer wrapper is a plain `<div class="cl-row cl-row--card">` instead of `<combined-listing data-section-id="...">` — no custom element, no `section_id` parameter needed, no `combined-listing.js` script tag from the caller.
- The member loop renders at most `entry_limit` entries; any remainder renders as a single non-interactive `<span class="cl-entry--more">+N</span>` (mirroring `product-block-options__more-label`'s existing `products.product.more_swatches` idiom), where N is the count of members past the limit.
- Each entry keeps its existing `cl-entry`, `opt-label--image`/`opt-label--btn`, `cl-entry--current`, `opt-label--is-unavailable` classes and `aria-current="true"` unchanged — only the *label line* and *wrapper element* differ from PDP mode. The current-entry treatment (border/pill) and sold-out treatment are therefore identical in both modes for free.
- *Alternative considered:* a separate `combined-listing-card.liquid` snippet duplicating the resolution logic — rejected, it would fork the set/visibility/name rules the moment either file changes them independently (e.g. a future "3+ sets" feature) and duplicates a `{%- liquid -%}` block that's already non-trivial. *Alternative considered:* pulling the resolution into a data-returning helper — not idiomatic Liquid (snippets render markup, not values); would need `capture` + custom delimiter parsing to smuggle structured data across a render boundary, adding fragility for no real benefit over an in-place branch.

### `product-card.liquid` always renders the row's wrapper element; the reserved-height slot lives in CSS, not in the snippet's render-nothing contract

`combined-listing.liquid`'s existing contract — render nothing when the product has no set, or fewer than 2 visible members remain — is untouched. `product-card.liquid` wraps the render call in its own `<div class="product-card__combined-listing">` unconditionally (whenever `show_combined_listings` is true), and that wrapper gets a fixed `min-height` in CSS matching one row of capped entries. A product with no set renders an empty (but height-reserving) div; a product in a set renders entries inside it. This keeps the "reserve space" behavior entirely in the caller + CSS, so the snippet's existing "renders nothing" scenarios (already spec'd for the PDP) stay true verbatim in card mode too.

### Current-listing highlight reuses the PDP's literal black border/pill, re-scoped

`assets/c-main-product.css` already implements exactly what was asked for — `.cmp .cl-row .cl-entry--current.opt-label--image { border: 2px solid #000; }` and a black-filled pill for `.opt-label--btn`. `assets/main.css` adds the equivalent selectors scoped under `.product-card__combined-listing` instead of `.cmp`, with the same literal values (not a themed CSS variable) so the two contexts render identically without introducing a new design token. Sold-out siblings reuse the global `.opt-label--is-unavailable` diagonal-line treatment unchanged, same as PDP.

### Plain navigation, no Section Rendering API swap

Card entries are real `<a href="{{ member.url }}">` links with no JS attached in card mode — clicking one navigates to the sibling product page like any other card link. This sidesteps every concern the PDP's swap machinery exists to solve (stale sections, history state, hover preloading) because a card has no "other sections" to keep in sync with — the whole point of clicking into a sibling from a grid is to land on its PDP.

### Settings: one checkbox per section, hardcoded metafield keys

Both `c-main-collection.liquid` and `featured-collection-carousel.liquid` get a single `show_combined_listings` checkbox (default `true`) in their existing "Cards" settings group, threaded into `product-card` alongside the other per-card parameters. The metafield keys are not exposed as settings — `product-card.liquid` passes the same literal defaults the PDP block ships with. If a store ever needs different keys per section, that's a small follow-up (promote the two literals to parameters), not designed for now.

### Entry cap defaults to 4

Chosen as a reasonable fit for the narrowest card width the sections support (2-up mobile grid) without requiring a per-breakpoint cap; final pixel/count tuning happens visually during implementation, not fixed here.

## Risks / Trade-offs

- [Reserved-height slot adds a small empty gap to every card for stores that don't use combined listings at all] → Acceptable trade-off explicitly chosen over raggedness; the row is a single thin strip, not a large block.
- [Text-pill rows (non-color sets) can vary more in width than image rows, and a capped set of pills might still overflow a very narrow card] → Bounded by `entry_limit`; visual QA during implementation can lower the cap for text rows specifically if needed, without a spec change.
- [Two rendering modes in one snippet file adds branching] → Kept minimal (skip-label / wrapper-element / entry-cap are the only differences); the alternative (forking the file) duplicates far more surface (the whole resolution block) for less benefit.
- [Store not using combined listings sees zero visible change] → By design; the feature is inert until the metaobject/metafields are populated, exactly like the PDP block today.

## Migration Plan

Purely additive and backward compatible: `card_mode` defaults to `false` (PDP call site unchanged), `show_combined_listings` defaults to `true` but renders nothing visible for products without a set. No data migration. Rollback = revert the commit; no theme-editor settings are removed from existing installs.

## Open Questions

- None blocking. Whether `product-block`'s ~15 call sites should eventually get the same treatment was explicitly scoped out for this change (see proposal's Non-Goals) and would be a separate change if requested.
