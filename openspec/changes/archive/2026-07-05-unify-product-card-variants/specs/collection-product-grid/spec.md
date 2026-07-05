## MODIFIED Requirements

### Requirement: Reuse the lean product-card

The section SHALL render each product using the `product-card` snippet (not `product-block`), through the snippet's parameter contract. It SHALL expose card-controlling settings equivalent to the carousel section — tag style, tag position, card border, image style, category-line toggle, and spec-line toggle — and pass them to `product-card` via `badge_bg` / `badge_text`, `badge_position`, `show_border`, `image_fit`, `show_type`, and `show_value_props`. Defaults SHALL match the design's category grid: Lifestyle image style (cover on gray), category line off, spec line on, light tag, no border.

#### Scenario: Card settings flow to the snippet

- **WHEN** the merchant sets any card setting in the section
- **THEN** each rendered `product-card` reflects it via the snippet's parameter contract

#### Scenario: Design-default category grid card

- **WHEN** the section renders with default settings
- **THEN** cards show a cover-cropped image on the gray-tinted frame, no category line, the spec line (when the `c_card_value_prop` metafield is present), and a light tag

#### Scenario: New Arrival grid variant

- **WHEN** the section is configured with filters, sort, and count off, border on, dark tag, Product image style, category line on, and spec line off
- **THEN** the rendered page reproduces the design's New Arrival grid using this same section

## ADDED Requirements

### Requirement: New Arrival alternate template

The theme SHALL provide `templates/collection.new-arrival.json` using the `c-main-collection` section preconfigured to the design's New Arrival grid: filters off, sort off, product count off, card border on, dark tags, Product image style, category line on, spec line off.

#### Scenario: Assigning the template

- **WHEN** a merchant assigns the "new-arrival" template to a collection
- **THEN** the collection page renders the bordered, contain-fit card grid with no filter/sort/count chrome, matching the design's New Arrival page
