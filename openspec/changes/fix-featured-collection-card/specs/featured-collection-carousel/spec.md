## MODIFIED Requirements

### Requirement: Floating navigation arrows
The section SHALL display previous/next navigation arrows as floating circular buttons overlapping the left and right edges of the carousel, using the theme's existing chevron icon snippets. The arrow buttons SHALL carry the `slider-nav__btn` class required by the theme's `<carousel-slider>` engine (`assets/slider.js`) so that clicks actually advance/rewind the carousel. Arrows SHALL be keyboard-accessible and labeled for assistive technology.

#### Scenario: Navigating with arrows
- **WHEN** the user clicks the next (or previous) arrow
- **THEN** the carousel advances (or rewinds) by the configured scroll amount

#### Scenario: Engine recognizes the arrow buttons
- **WHEN** the section renders the prev/next buttons
- **THEN** each button carries the `slider-nav__btn` class so the existing slider engine's click handler acts on it (no change to `assets/slider.js`)

#### Scenario: Accessible labels
- **WHEN** the arrows are rendered
- **THEN** each has an accessible name (e.g. visually-hidden "Previous"/"Next" text) and is focusable/operable by keyboard

#### Scenario: Arrow state at bounds
- **WHEN** the carousel is at the first or last position
- **THEN** the corresponding arrow reflects a disabled/inactive state per the existing slider behavior

### Requirement: Merchant configuration via section settings and preset
The section SHALL be configurable from the theme editor via a `{% schema %}` and SHALL provide a preset so it can be added from the section picker. Settings SHALL include at least: heading, description/subheading, collection, cards-per-row (desktop and mobile), "View All" toggle, tag style, tag position, border toggle, color scheme, and full-width toggle. The tag-position and border settings SHALL be passed to `product-card` as the `badge_position` and `show_border` parameters respectively.

#### Scenario: Added from theme editor
- **WHEN** a merchant opens the section picker
- **THEN** a "C Featured collection" section is available and can be added to a page via its preset

#### Scenario: Settings drive output
- **WHEN** a merchant changes heading, description, collection, cards-per-row, tag style, color scheme, or full-width settings
- **THEN** the rendered section reflects those settings without code changes

#### Scenario: Tag position setting drives badge placement
- **WHEN** the merchant chooses a tag position (over the image vs. on top of the image)
- **THEN** the section passes the matching `badge_position` value (`overlay` or `inside`) to `product-card` and every card's badge is placed accordingly

#### Scenario: Border setting drives card border
- **WHEN** the merchant enables (or disables) the border setting
- **THEN** the section passes `show_border: true` (or `false`) to `product-card` and every card's image container reflects that border state

#### Scenario: Existing section untouched
- **WHEN** this section is added
- **THEN** the existing `sections/featured-collection.liquid` remains unmodified
