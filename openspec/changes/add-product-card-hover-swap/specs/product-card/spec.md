## MODIFIED Requirements

### Requirement: Lean product card snippet

The theme SHALL provide a standalone snippet `snippets/product-card.liquid` that renders a single product as a lean card containing, in order: the product image, an optional badge, an optional product-type line, the product title, optional value props, and the price. The snippet SHALL NOT render swatches or quick-buy controls. Hover image-swap SHALL only be rendered when explicitly requested via the `hover_effect` parameter (see "Hover image swap"). The snippet SHALL accept a `product` object and link the image and title to the product URL.

#### Scenario: Rendering a product card

- **WHEN** a section renders `{% render 'product-card', product: product %}`
- **THEN** the card displays the product's featured image, title, and price, each linking to the product URL
- **AND** no swatches, quick-buy button, or secondary hover image are rendered

#### Scenario: Product without a featured image

- **WHEN** the product has no featured media
- **THEN** the card renders a placeholder image in place of the product image and still renders the title and price

### Requirement: Hover scale-zoom

The card's default hover effect SHALL be a scale-zoom of the product image to 1.05 over 0.5s with the `cubic-bezier(0.4, 0, 0.2, 1)` easing, triggered by hovering anywhere on the card, without overflowing the image container. The zoom SHALL apply when `hover_effect` is `'zoom'`, omitted, or when `'image'` is requested but the product has no lifestyle photo (see "Hover image swap"). On the same hover, the title SHALL transition its color to the design gray (`#4b5563`) over 150ms regardless of the hover effect. The hover colors SHALL be defined explicitly in card-scoped rules (not via undefined theme variables).

#### Scenario: Hovering the card

- **WHEN** a user hovers anywhere over a card whose effective hover effect is zoom
- **THEN** the image smoothly scales up to 1.05 with the specified duration and easing, and the container clips any overflow

#### Scenario: Title hover color is visible

- **WHEN** a user hovers over the card, whichever hover effect is active
- **THEN** the title color visibly transitions from its resting color to `#4b5563`

## ADDED Requirements

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
