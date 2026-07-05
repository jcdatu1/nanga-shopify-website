## MODIFIED Requirements

### Requirement: Lean product card snippet

The theme SHALL provide a standalone snippet `snippets/product-card.liquid` that renders a single product as a lean card containing, in order: the product image, an optional badge, an optional product-type line, the product title, optional value props, and the price. The snippet SHALL NOT render swatches, quick-buy controls, or hover image-swap. The snippet SHALL accept a `product` object and link the image and title to the product URL.

#### Scenario: Rendering a product card

- **WHEN** a section renders `{% render 'product-card', product: product %}`
- **THEN** the card displays the product's featured image, title, and price, each linking to the product URL
- **AND** no swatches, quick-buy button, or secondary hover image are rendered

#### Scenario: Product without a featured image

- **WHEN** the product has no featured media
- **THEN** the card renders a placeholder image in place of the product image and still renders the title and price

### Requirement: Image fit

The card SHALL accept an `image_fit` parameter with values `contain` or `cover` controlling how the product image fits its container. When omitted, the snippet SHALL default to `contain` so the full product is visible (white background with padding) and not cropped, matching the design.

#### Scenario: Default fit

- **WHEN** the snippet is rendered without the `image_fit` parameter
- **THEN** the image is scaled to fit fully within the container without cropping (contain)

#### Scenario: Contain fit

- **WHEN** the snippet is rendered with `image_fit: 'contain'`
- **THEN** the image is scaled to fit fully within the container without cropping

#### Scenario: Cover fit

- **WHEN** the snippet is rendered with `image_fit: 'cover'`
- **THEN** the image fills the container and is cropped to its aspect ratio

## ADDED Requirements

### Requirement: Product type line

The card SHALL display the product's type (`product.type`) as a category line above the title when the product has a type. When the product has no type, no category line SHALL be rendered.

#### Scenario: Product has a type

- **WHEN** the product has a non-blank `product.type`
- **THEN** the card displays the product type as a category line above the title

#### Scenario: Product has no type

- **WHEN** `product.type` is blank
- **THEN** no category line is displayed above the title

## REMOVED Requirements

### Requirement: Optional vendor line

**Reason**: The design shows the product type (not the vendor) as the category line above the title; the card now always shows the product type instead.
**Migration**: Remove the `show_vendor` parameter from any `{% render 'product-card' %}` call; the product type now renders automatically when present (see "Product type line").
