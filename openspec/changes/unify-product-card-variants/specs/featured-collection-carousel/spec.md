## MODIFIED Requirements

### Requirement: Merchant configuration via section settings and preset

The section SHALL be configurable from the theme editor via a `{% schema %}` and SHALL provide a preset so it can be added from the section picker. Settings SHALL include at least: heading, description/subheading, collection, cards-per-row (desktop and mobile), "View All" toggle, tag style, tag position, card border, image style, category-line toggle, spec-line toggle, color scheme, and full-width toggle.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C Featured collection" section is available and can be added to a page via its preset

#### Scenario: Settings drive output

- **WHEN** a merchant changes any exposed setting
- **THEN** the rendered section reflects it without code changes

### Requirement: Floating navigation arrows

The section SHALL display previous/next navigation arrows as floating circular buttons overlapping the left and right edges of the carousel, using the theme's existing chevron icon snippets. Arrows SHALL be keyboard-accessible and labeled for assistive technology. On hover the button background SHALL transition to the design's gray (`#f3f4f6`), and the button SHALL carry the design's `shadow-lg` elevation.

#### Scenario: Navigating with arrows

- **WHEN** the user clicks the next (or previous) arrow
- **THEN** the carousel advances (or rewinds) by the configured scroll amount

#### Scenario: Arrow hover state

- **WHEN** the user hovers an arrow button
- **THEN** its background transitions to `#f3f4f6`

#### Scenario: Accessible labels

- **WHEN** the arrows are rendered
- **THEN** each has an accessible name (e.g. visually-hidden "Previous"/"Next" text) and is focusable/operable by keyboard

#### Scenario: Arrow state at bounds

- **WHEN** the carousel is at the first or last position
- **THEN** the corresponding arrow reflects a disabled/inactive state per the existing slider behavior

### Requirement: Figma-faithful heading and View All link

The section SHALL display a left-aligned heading with an optional description subtext beneath it, and an optional "View All" link to the collection. On desktop the "View All" link SHALL appear at the right of the heading row; on mobile it SHALL appear below the carousel. The link's icon gap SHALL be 8px at rest and animate to 12px on hover (design `gap-2` → `gap-3`).

#### Scenario: Heading and subtext

- **WHEN** the merchant sets a heading and a description
- **THEN** the heading renders left-aligned with the description beneath it

#### Scenario: View All enabled

- **WHEN** the "View All" link is enabled and a collection is selected
- **THEN** the link points to the collection URL, shown at the right of the heading on desktop and below the carousel on mobile

#### Scenario: View All hover

- **WHEN** the user hovers the "View All" link
- **THEN** the gap between label and chevron animates from 8px to 12px

#### Scenario: View All disabled

- **WHEN** the "View All" link is disabled
- **THEN** no "View All" link is rendered in either position

## ADDED Requirements

### Requirement: Card display settings

The section SHALL expose, under its "Cards" settings group: an **Image style** select mapping "Product (contained, white)" → `image_fit: 'contain'` and "Lifestyle (cover, gray)" → `image_fit: 'cover'` (default Product); a **Show category line** checkbox (default on) passed as `show_type`; and a **Show spec line** checkbox (default off, matching the design's carousels) passed as `show_value_props`. All three SHALL be threaded into every `product-card` render call.

#### Scenario: Design-default carousel card

- **WHEN** the section renders with default settings
- **THEN** cards show a contained image on a white padded frame, the category line, and no spec line

#### Scenario: Switching to lifestyle imagery

- **WHEN** the merchant sets Image style to "Lifestyle (cover, gray)"
- **THEN** every card's image renders cover-cropped on the gray-tinted frame

#### Scenario: Toggling detail lines

- **WHEN** the merchant unchecks "Show category line" and checks "Show spec line"
- **THEN** cards hide the product-type line and show the value-prop line (when the metafield is present)
