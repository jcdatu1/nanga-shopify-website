## ADDED Requirements

### Requirement: Combined listing row

The card SHALL accept a `show_combined_listings` boolean parameter (default `true`). When enabled, the card SHALL render a combined-listing row, via `{% render 'combined-listing', product: product, card_mode: true %}` with the store's standard metafield keys (`custom.c_combined_listing_set` / `custom.c_combined_listing_name`, not caller-configurable), positioned between the product image and the detail block (type/title/value-props/price). The row's wrapper element SHALL always render when `show_combined_listings` is true, regardless of whether the product belongs to a set, so its reserved height is consistent across every card in a grid. When `show_combined_listings` is `false`, no wrapper or row SHALL render.

#### Scenario: Product in a combined-listing set

- **WHEN** the snippet is rendered with `show_combined_listings: true` (or omitted) for a product belonging to a set with 2+ visible members
- **THEN** the card shows every visible sibling entry between the image and the title, each linking to that sibling's product page, with the current product's entry visually marked

#### Scenario: Product not in any set

- **WHEN** the product has no combined-listing set (or its set has fewer than 2 visible members)
- **THEN** the card still renders the row's wrapper element (occupying its reserved height) with no visible entries inside it

#### Scenario: Feature disabled by the caller

- **WHEN** the snippet is rendered with `show_combined_listings: false`
- **THEN** no combined-listing wrapper or row is rendered, regardless of the product's set membership

### Requirement: Combined-listing entry navigation

Each combined-listing entry on the card SHALL be a plain link to the sibling product's URL. Clicking a non-current entry SHALL navigate to that sibling's product page as a normal page load — no in-place section swap SHALL occur.

#### Scenario: Clicking a sibling entry

- **WHEN** a shopper clicks a non-current combined-listing entry on a card
- **THEN** the browser navigates to that sibling product's page

### Requirement: Uncapped, horizontally scrollable entries

The combined-listing row SHALL render every visible member with no artificial limit. When the members' combined width exceeds the card's width, the row SHALL scroll horizontally rather than wrapping to a new line, clipping entries, or growing the card wider than its grid column.

#### Scenario: Set fits within the card width

- **WHEN** a product's visible set fits within the card's width
- **THEN** all entries display in a single row with no scrolling needed

#### Scenario: Set exceeds the card width

- **WHEN** a product's visible set is wider than the card
- **THEN** the row scrolls horizontally to reveal the remaining entries, the card's own width is unaffected, and no entry is hidden behind a count or cut off

### Requirement: Image entries render without outer button chrome

An image-row combined-listing entry on the card SHALL render only its thumbnail image, with no surrounding border, background, or padding beyond the image's own appearance — distinct from a text-row entry, which SHALL retain the button-pill chrome (border/background/padding) since it has no image.

#### Scenario: Image entry has no outer chip

- **WHEN** a card renders an image-row combined-listing entry
- **THEN** no border, background, or padding box surrounds the entry beyond the thumbnail image itself

#### Scenario: Text-pill entry keeps its chip

- **WHEN** a card renders a text-row (non-color) combined-listing entry
- **THEN** the entry displays with the theme's button-pill border/background, unchanged
