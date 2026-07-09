## MODIFIED Requirements

### Requirement: Reuse the lean product-card

The section SHALL render each product using the `product-card` snippet (not `product-block`), through the snippet's parameter contract. It SHALL expose card-controlling settings equivalent to the carousel section — tag style, tag position, card border, image style, category-line toggle, spec-line toggle, and hover effect — and pass them to `product-card` via `badge_bg` / `badge_text`, `badge_position`, `show_border`, `image_fit`, `show_type`, `show_value_props`, and `hover_effect`. The **Hover effect** select SHALL map "Zoom" → `hover_effect: 'zoom'` and "Change to lifestyle image" → `hover_effect: 'image'`, defaulting to Zoom, with info text naming the `custom.c_lifestyle_photo` metafield. Other defaults SHALL match the design's category grid: Lifestyle image style (cover on gray), category line off, spec line on, light tag, no border.

#### Scenario: Card settings flow to the snippet

- **WHEN** the merchant sets any card setting in the section
- **THEN** each rendered `product-card` reflects it via the snippet's parameter contract

#### Scenario: Design-default category grid card

- **WHEN** the section renders with default settings
- **THEN** cards show a cover-cropped image on the gray-tinted frame, no category line, the spec line (when the `c_card_value_prop` metafield is present), a light tag, and the hover zoom

#### Scenario: New Arrival grid variant

- **WHEN** the section is configured with filters, sort, and count off, border on, dark tag, Product image style, category line on, and spec line off
- **THEN** the rendered page reproduces the design's New Arrival grid using this same section

#### Scenario: Switching the hover effect

- **WHEN** the merchant sets Hover effect to "Change to lifestyle image"
- **THEN** every card renders with `hover_effect: 'image'` — cross-fading to the product's lifestyle photo on hover where the metafield is set, and falling back to the zoom where it is not
