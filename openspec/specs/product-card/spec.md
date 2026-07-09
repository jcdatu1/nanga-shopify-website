# product-card Specification

## Purpose

Provide a reusable, lean product card snippet (`snippets/product-card.liquid`) driven by section parameters and product metafields, matching the NANGA design. It covers a border toggle, a single metafield-driven badge (content, position, and colors), a section-controllable product-type line and value-prop line, a caller-selectable hover effect (scale-zoom or metafield-driven lifestyle image swap), compare-at price presentation, and image fit — without swatches or quick-buy.

## Requirements

### Requirement: Lean product card snippet

The theme SHALL provide a standalone snippet `snippets/product-card.liquid` that renders a single product as a lean card containing, in order: the product image, an optional badge, an optional product-type line, the product title, optional value props, and the price. The snippet SHALL NOT render swatches or quick-buy controls. Hover image-swap SHALL only be rendered when explicitly requested via the `hover_effect` parameter (see "Hover image swap"). The snippet SHALL accept a `product` object and link the image and title to the product URL.

#### Scenario: Rendering a product card

- **WHEN** a section renders `{% render 'product-card', product: product %}`
- **THEN** the card displays the product's featured image, title, and price, each linking to the product URL
- **AND** no swatches, quick-buy button, or secondary hover image are rendered

#### Scenario: Product without a featured image

- **WHEN** the product has no featured media
- **THEN** the card renders a placeholder image in place of the product image and still renders the title and price

### Requirement: Border toggle

The card SHALL accept a `show_border` boolean parameter. When `show_border` is true the image container SHALL display a border consistent with the design; when false or omitted no border SHALL be displayed.

#### Scenario: Border enabled

- **WHEN** the snippet is rendered with `show_border: true`
- **THEN** the card image container displays a visible border

#### Scenario: Border disabled

- **WHEN** the snippet is rendered with `show_border: false` or without the parameter
- **THEN** the card image container displays no border

### Requirement: Single metafield-driven badge

The card SHALL render at most one badge, sourced from the product metafield `custom.c_product_badge`. When the metafield is blank no badge SHALL be rendered. The card SHALL NOT render the theme's automatic New, Sale percentage, or low-stock labels.

#### Scenario: Badge present

- **WHEN** `product.metafields.custom.c_product_badge` has a value
- **THEN** the card renders one badge displaying that value

#### Scenario: Badge absent

- **WHEN** `product.metafields.custom.c_product_badge` is blank
- **THEN** the card renders no badge, regardless of the product being new, on sale, or low stock

### Requirement: Badge position

The card SHALL accept a `badge_position` parameter with values `overlay` or `inside`. With `overlay`, the badge SHALL be absolutely positioned over the top-left of the image. With `inside`, the badge SHALL sit at the top of the image area within the card's border (when a border is enabled). When omitted, the position SHALL default to `overlay`.

#### Scenario: Overlay position

- **WHEN** the snippet is rendered with `badge_position: 'overlay'`
- **THEN** the badge is absolutely positioned over the image at the top-left

#### Scenario: Inside position

- **WHEN** the snippet is rendered with `badge_position: 'inside'`
- **THEN** the badge sits at the top of the image area and remains inside the card border when the border is enabled

### Requirement: Caller-supplied badge colors

The card SHALL accept `badge_bg` and `badge_text` parameters and apply them as the badge's background and text colors respectively. When omitted the badge SHALL fall back to sensible defaults consistent with the theme.

#### Scenario: Custom badge colors

- **WHEN** the snippet is rendered with `badge_bg` and `badge_text` values and a non-blank badge metafield
- **THEN** the rendered badge uses the supplied background and text colors

### Requirement: Value props from metafield

The card SHALL render the product metafield `custom.c_card_value_prop` (a list of single-line text) as a single line of values joined by ` • `, placed between the title and the price. The card SHALL accept a `show_value_props` boolean parameter gating the line: when `false`, no value-prop line SHALL be rendered regardless of metafield content; when `true` or omitted, the line renders whenever the metafield is non-empty.

#### Scenario: Value props present and enabled

- **WHEN** `product.metafields.custom.c_card_value_prop` contains `["760FP", "285g"]` and the snippet is rendered with `show_value_props: true` or without the parameter
- **THEN** the card renders `760FP • 285g` between the title and the price

#### Scenario: Value props suppressed by the caller

- **WHEN** the metafield is non-empty and the snippet is rendered with `show_value_props: false`
- **THEN** no value-prop line is rendered

#### Scenario: Value props absent

- **WHEN** `product.metafields.custom.c_card_value_prop` is blank or empty
- **THEN** the card renders no value-prop line

### Requirement: Product type line

The card SHALL display the product's type (`product.type`) as a category line above the title. The card SHALL accept a `show_type` boolean parameter gating the line: when `false`, no category line SHALL be rendered; when `true` or omitted, the line renders whenever the product has a non-blank type. The line's text color SHALL be the design gray (`#4b5563`).

#### Scenario: Product has a type and the line is enabled

- **WHEN** the product has a non-blank `product.type` and the snippet is rendered with `show_type: true` or without the parameter
- **THEN** the card displays the product type as a category line above the title

#### Scenario: Category line suppressed by the caller

- **WHEN** the product has a non-blank type and the snippet is rendered with `show_type: false`
- **THEN** no category line is rendered

#### Scenario: Product has no type

- **WHEN** `product.type` is blank
- **THEN** no category line is displayed above the title

### Requirement: Hover scale-zoom

The card's default hover effect SHALL be a scale-zoom of the product image to 1.05 over 0.5s with the `cubic-bezier(0.4, 0, 0.2, 1)` easing, triggered by hovering anywhere on the card, without overflowing the image container. The zoom SHALL apply when `hover_effect` is `'zoom'`, omitted, or when `'image'` is requested but the product has no lifestyle photo (see "Hover image swap"). On the same hover, the title SHALL transition its color to the design gray (`#4b5563`) over 150ms regardless of the hover effect. The hover colors SHALL be defined explicitly in card-scoped rules (not via undefined theme variables).

#### Scenario: Hovering the card

- **WHEN** a user hovers anywhere over a card whose effective hover effect is zoom
- **THEN** the image smoothly scales up to 1.05 with the specified duration and easing, and the container clips any overflow

#### Scenario: Title hover color is visible

- **WHEN** a user hovers over the card, whichever hover effect is active
- **THEN** the title color visibly transitions from its resting color to `#4b5563`

### Requirement: Hover image swap

The card SHALL accept a `hover_effect` parameter with values `'zoom'` and `'image'`, defaulting to `'zoom'` when omitted. When `hover_effect` is `'image'` and the product metafield `custom.c_lifestyle_photo` holds an image, the card SHALL render that image as a second, lazy-loaded, decorative (`aria-hidden`) layer stacked over the primary image inside the image container, hidden at rest and cross-faded to full opacity on card hover using the card's 0.5s / `cubic-bezier(0.4, 0, 0.2, 1)` transition tokens. The swap layer SHALL render cover-cropped edge-to-edge regardless of the card's `image_fit`, and the primary image's zoom SHALL be suppressed on swapping cards so the effects do not compound. When `hover_effect` is `'image'` but the metafield is blank, the card SHALL render no swap layer and SHALL fall back to the hover scale-zoom.

#### Scenario: Hovering a card with a lifestyle photo

- **WHEN** the snippet is rendered with `hover_effect: 'image'` for a product whose `custom.c_lifestyle_photo` metafield holds an image, and a user hovers the card
- **THEN** the lifestyle photo cross-fades in over the primary image, cover-cropped to the image container, with no simultaneous zoom

#### Scenario: Swap requested but metafield blank

- **WHEN** the snippet is rendered with `hover_effect: 'image'` for a product without a `c_lifestyle_photo` image
- **THEN** no swap layer is rendered and hovering the card shows the standard scale-zoom

#### Scenario: Default unchanged

- **WHEN** the snippet is rendered without `hover_effect` (any existing caller)
- **THEN** the card's markup and hover behavior are identical to before this change

#### Scenario: Swap layer loading

- **WHEN** a swap layer is rendered
- **THEN** it lazy-loads via the theme's `image` snippet with responsive `srcset`/`sizes` matching the primary image's size columns

### Requirement: Compare-at price presentation

The card SHALL render price using the existing `snippets/price.liquid`, wrapped in a card-specific modifier class. When the variant has a compare-at price greater than its price, the card SHALL display the original (compare-at) price first with a strikethrough, followed by the discounted price in the sale (red) treatment. When not on sale, only the regular price SHALL be shown.

#### Scenario: Product on sale

- **WHEN** the product's selected/cheapest variant has a compare-at price greater than its price
- **THEN** the card shows the compare-at price struck through, followed by the discounted price styled in red

#### Scenario: Product not on sale

- **WHEN** the product has no compare-at price greater than its price
- **THEN** the card shows only the regular price with no strikethrough or sale styling

### Requirement: Image fit

The card SHALL accept an `image_fit` parameter with values `contain` or `cover` controlling how the product image fits its container. When omitted, the snippet SHALL default to `contain` so the full product is visible (white background with padding) and not cropped. With `cover`, the image container's background SHALL be the design's light gray (`#f3f4f6`) so lazy-loading and transparent images match the design's tinted frame.

#### Scenario: Default fit

- **WHEN** the snippet is rendered without the `image_fit` parameter
- **THEN** the image is scaled to fit fully within the container without cropping (contain) on a white, padded frame

#### Scenario: Cover fit on gray

- **WHEN** the snippet is rendered with `image_fit: 'cover'`
- **THEN** the image fills the container, cropped to its aspect ratio, with no padding
- **AND** the image container background is `#f3f4f6`
