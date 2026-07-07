# combined-listing Specification

## Purpose

Provide a metafield/metaobject-driven sibling-product selector on the product page (`c-main-product` section) for stores without Shopify's native (Plus-only) Combined Listings. A merchant-defined `c_combined_listings` metaobject groups separate products (mostly colorways); the PDP renders a variant-picker-style row for the product's set with the current product marked selected and sold-out siblings greyed, and switches products seamlessly via the Section Rendering API (`snippets/combined-listing.liquid` + `assets/combined-listing.js`), degrading to plain links.

## Requirements

### Requirement: Metaobject-driven combined listing data model

The feature SHALL be driven by a `c_combined_listings` metaobject (fields: `product_list`, a list of product references defining the set's members and their display order; `variant_label`, a single-line text axis label such as "Color") and two **single-value** product metafields: `custom.c_combined_listing_set` (metaobject reference — a product belongs to at most one set) and `custom.c_combined_listing_name` (single-line text, the product's display name within its set). The block SHALL expose both metafield keys as text settings (defaults above, `namespace.key` format). A member's display name SHALL resolve from that member's own name metafield, falling back to the member's title.

#### Scenario: Member name resolution

- **WHEN** a member product's name metafield is "Navy"
- **THEN** the member's entry displays "Navy"

#### Scenario: Missing member name

- **WHEN** a member product has no name metafield value
- **THEN** the entry displays the member's product title, and the row still renders

### Requirement: Combined listing block on the product page

The `c-main-product` section SHALL provide a `combined-listing` block (limit 1) that renders a selector row for the set referenced by the current product, positioned by editor block order (above the variant picker in `templates/product.json`). The row SHALL render a label line with the set's `variant_label` and, for image-swatch rows, the current product's display name. Each set member SHALL render as a real anchor linking to the sibling product's URL, in `product_list` order. A product with no set reference SHALL render nothing.

#### Scenario: Product in a color set

- **WHEN** a product referencing a set (label "Color", members Navy/Sand/Moss) renders the block
- **THEN** a row appears labeled with "Color" and the current product's name, containing three entries in `product_list` order, each an anchor to that sibling's product URL

#### Scenario: No set membership

- **WHEN** a product has no `c_combined_listing_set` reference
- **THEN** the block renders no markup

### Requirement: Presentation by variant label

A row whose `variant_label` matches `settings.swatch_option_name` (the same containment test the variant picker uses) SHALL render entries in the theme's listed image-swatch style — the sibling's featured image as a thumbnail card beside the display name, reusing the existing `.opt-label--image` pattern. Any other label SHALL render entries as the theme's text button pills (`.opt-label--btn` pattern). Shared global classes SHALL be consumed without modification; new rules SHALL be scoped to the section's stylesheet.

#### Scenario: Color set renders image swatches

- **WHEN** `settings.swatch_option_name` contains "Color" and the set's `variant_label` is "Color"
- **THEN** each entry shows the sibling's featured image as a thumbnail with the display name beside it

#### Scenario: Non-color set renders button pills

- **WHEN** the set's `variant_label` is "Capacity" and it does not match `settings.swatch_option_name`
- **THEN** entries render as text-only button pills showing display names, with no thumbnails

### Requirement: Entry states

The entry for the current product SHALL be visually marked as selected (active border treatment consistent with the variant picker's checked state) and carry `aria-current="true"`. A sibling whose product is not available (all variants sold out) SHALL render with the theme's unavailable treatment (greyed) while remaining a functional link. Blank or inaccessible product references SHALL be skipped. A row with fewer than two visible products SHALL not render. When the current product is absent from the set's `product_list` (authoring mismatch), the row SHALL still render its members with no entry marked current.

#### Scenario: Current product marked selected

- **WHEN** the row renders and one member is the current product
- **THEN** that entry shows the active treatment with `aria-current="true"` and the others do not

#### Scenario: Sold-out sibling

- **WHEN** a member product has no available variants
- **THEN** its entry renders greyed via the unavailable treatment and still links to the sibling product

#### Scenario: Set too small after filtering

- **WHEN** filtering blank/inaccessible references leaves fewer than two visible products in the set
- **THEN** the row does not render

### Requirement: Seamless product switching via the Section Rendering API

A `<combined-listing>` custom element (new `assets/combined-listing.js`, deferred, loaded only by the section) SHALL intercept sibling link clicks and fetch the sibling's product URL with a `sections` parameter containing the section's ID plus the IDs of any `.cc-variant-dependent-section` sections present, through `theme.fetchCache`. On success it SHALL replace each fetched section's content in place, push the sibling's URL onto the history with a state marker, and restore focus to the corresponding entry in the swapped content. Entry hover/touchstart SHALL preload the fetch after a 250ms intent delay. Concurrent clicks SHALL resolve last-click-wins. During an active fetch the element SHALL expose a busy state (`aria-busy="true"`).

#### Scenario: Clicking a sibling swaps the section

- **WHEN** a shopper clicks a sibling entry and the fetch returns the section rendered for the sibling
- **THEN** the section's content (gallery, title, price, description, variant picker, buy buttons, metafield blocks, and the combined-listing row) reflects the sibling product without a page load
- **AND** the address bar shows the sibling's URL via `history.pushState`

#### Scenario: Hover preload

- **WHEN** the pointer rests on a non-current entry for at least 250ms
- **THEN** the sibling's section render is preloaded into `theme.fetchCache`, and a subsequent click swaps without a network wait

### Requirement: Degradation and history behavior

Entries SHALL function as normal links when JavaScript is unavailable. When the fetch fails or returns no non-empty HTML for the section ID (e.g. the sibling uses a different product template), the element SHALL fall back to full navigation to the sibling URL. Browser back/forward across a pushed combined-listing state SHALL restore the correct product (reload on `popstate` involving the state marker).

#### Scenario: No JavaScript

- **WHEN** scripts are disabled and a shopper clicks a sibling entry
- **THEN** the browser navigates to the sibling's product page normally

#### Scenario: Sibling on an alternate template

- **WHEN** the fetched response contains no non-empty HTML for the section ID
- **THEN** the browser performs a full navigation to the sibling URL instead of swapping

#### Scenario: Back button after a swap

- **WHEN** a shopper switches products via the block and presses Back
- **THEN** the previous product's page state is restored
