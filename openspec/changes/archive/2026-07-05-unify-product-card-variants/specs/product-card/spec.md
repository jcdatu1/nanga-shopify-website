## MODIFIED Requirements

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

The card SHALL apply a hover scale-zoom to the product image, scaling to 1.05 over 0.5s with the `cubic-bezier(0.4, 0, 0.2, 1)` easing, triggered by hovering anywhere on the card, without overflowing the image container. On the same hover, the title SHALL transition its color to the design gray (`#4b5563`) over 150ms. The hover colors SHALL be defined explicitly in card-scoped rules (not via undefined theme variables).

#### Scenario: Hovering the card

- **WHEN** a user hovers anywhere over the card
- **THEN** the image smoothly scales up to 1.05 with the specified duration and easing, and the container clips any overflow

#### Scenario: Title hover color is visible

- **WHEN** a user hovers over the card
- **THEN** the title color visibly transitions from its resting color to `#4b5563`

### Requirement: Image fit

The card SHALL accept an `image_fit` parameter with values `contain` or `cover` controlling how the product image fits its container. When omitted, the snippet SHALL default to `contain` so the full product is visible (white background with padding) and not cropped. With `cover`, the image container's background SHALL be the design's light gray (`#f3f4f6`) so lazy-loading and transparent images match the design's tinted frame.

#### Scenario: Default fit

- **WHEN** the snippet is rendered without the `image_fit` parameter
- **THEN** the image is scaled to fit fully within the container without cropping (contain) on a white, padded frame

#### Scenario: Cover fit on gray

- **WHEN** the snippet is rendered with `image_fit: 'cover'`
- **THEN** the image fills the container, cropped to its aspect ratio, with no padding
- **AND** the image container background is `#f3f4f6`
