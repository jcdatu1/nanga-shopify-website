## MODIFIED Requirements

### Requirement: Card display settings

The section SHALL expose, under its "Cards" settings group: an **Image style** select mapping "Product (contained, white)" → `image_fit: 'contain'` and "Lifestyle (cover, gray)" → `image_fit: 'cover'` (default Product); a **Show category line** checkbox (default on) passed as `show_type`; a **Show spec line** checkbox (default off, matching the design's carousels) passed as `show_value_props`; a **Hover effect** select mapping "Zoom" → `hover_effect: 'zoom'` and "Change to lifestyle image" → `hover_effect: 'image'` (default Zoom), with info text naming the `custom.c_lifestyle_photo` metafield; and a **Show combined listings** checkbox (default on) passed as `show_combined_listings`. All five SHALL be threaded into every `product-card` render call.

#### Scenario: Design-default carousel card

- **WHEN** the section renders with default settings
- **THEN** cards show a contained image on a white padded frame, the category line, no spec line, the hover zoom, and a combined-listing row (when the product belongs to a set)

#### Scenario: Switching to lifestyle imagery

- **WHEN** the merchant sets Image style to "Lifestyle (cover, gray)"
- **THEN** every card's image renders cover-cropped on the gray-tinted frame

#### Scenario: Toggling detail lines

- **WHEN** the merchant unchecks "Show category line" and checks "Show spec line"
- **THEN** cards hide the product-type line and show the value-prop line (when the metafield is present)

#### Scenario: Switching the hover effect

- **WHEN** the merchant sets Hover effect to "Change to lifestyle image"
- **THEN** every card renders with `hover_effect: 'image'` — cross-fading to the product's lifestyle photo on hover where the metafield is set, and falling back to the zoom where it is not

#### Scenario: Disabling combined listings

- **WHEN** the merchant unchecks "Show combined listings"
- **THEN** no card in the carousel renders a combined-listing row, regardless of product set membership
