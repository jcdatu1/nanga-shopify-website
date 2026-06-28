## ADDED Requirements

### Requirement: Section renders curated collections as blocks
The section SHALL render a merchant-curated list of collections, one tile per `collection` block, in the merchant's block order. Each tile SHALL link to the block's selected collection URL. When no blocks are configured (e.g. fresh install in the theme editor), the section SHALL render placeholder tiles so it is previewable.

#### Scenario: Blocks configured
- **WHEN** the merchant adds collection blocks and views the section
- **THEN** one tile is rendered per block, in block order, each linking to its collection URL

#### Scenario: Block order respected
- **WHEN** the merchant reorders blocks in the theme editor
- **THEN** the tiles render in the new order without code changes

#### Scenario: No blocks configured
- **WHEN** the section has no blocks (fresh install)
- **THEN** placeholder tiles render instead of an empty section

### Requirement: Tile image and label with per-block overrides
Each tile SHALL display a circular image well and an uppercase label beneath it. The image SHALL default to the selected collection's `featured_image` and SHALL be overridable by an optional per-block image setting. The label SHALL default to the collection's `title` and SHALL be overridable by an optional per-block label setting. Images SHALL use responsive `image_url` with `width`/`srcset`/`sizes` and lazy loading for below-the-fold tiles.

#### Scenario: Defaults from collection
- **WHEN** a block selects a collection and sets no overrides
- **THEN** the tile shows the collection's featured image and the collection title (uppercased) as the label

#### Scenario: Image override
- **WHEN** a block sets a custom image
- **THEN** the tile shows the custom image instead of the collection's featured image

#### Scenario: Label override
- **WHEN** a block sets a custom label
- **THEN** the tile shows the custom label instead of the collection title

#### Scenario: Responsive imagery
- **WHEN** a tile image is rendered
- **THEN** it uses `image_url` with `srcset`/`sizes` and lazy loads when below the fold

### Requirement: Circular tile presentation
Tiles SHALL be presented as circular image wells with a neutral gray background, the image contained (`object-contain`) and centered within the circle, and the label rendered beneath in uppercase. The tile styling SHALL be scoped to the section (`.clc`) and SHALL NOT modify shared classes or other sections.

#### Scenario: Circular well
- **WHEN** a tile renders
- **THEN** the image area is a circle (1:1 aspect ratio, fully rounded) with a gray background and the image contained within it

#### Scenario: Scoped styling
- **WHEN** the section's stylesheet is added
- **THEN** all custom rules are scoped under `.clc` and no shared snippet or shared class is altered

### Requirement: Carousel uses the theme's native engine without third-party libraries
The carousel SHALL be built on the theme's existing `<carousel-slider>` custom element (backed by `assets/slider.js` / `assets/main.js`) and the shared `slider`/`product-grid--per-row` classes, and SHALL NOT introduce any third-party carousel library or new JavaScript dependency.

#### Scenario: No new dependency
- **WHEN** the section is implemented
- **THEN** no new JS/CSS framework or carousel package is added; navigation is powered by the existing `carousel-slider` element

#### Scenario: Lazy initialization
- **WHEN** the section is below the fold
- **THEN** the carousel initializes via the theme's existing lazy-init path rather than adding render-blocking scripts

### Requirement: Responsive per-row settings gate scroll and arrows
The section SHALL expose `cards_desktop` and `cards_mobile` settings controlling how many tiles are shown per row on desktop and mobile. When the number of blocks exceeds the per-row value, the carousel SHALL scroll horizontally with scroll-snap, show a partial peek of the next tile, and display navigation arrows. When the number of blocks fits within the per-row value, the carousel SHALL disable scroll/arrows and display the tiles as a static row (native slider `[inactive]` behavior).

#### Scenario: More tiles than fit (desktop)
- **WHEN** the block count exceeds `cards_desktop` on desktop
- **THEN** the configured number of tiles shows with a peek of the next tile, and scroll/arrows are active

#### Scenario: Mobile scroll with peek
- **WHEN** the block count exceeds `cards_mobile` on a mobile viewport
- **THEN** `cards_mobile` tiles show with a peek of the next tile and swipe/scroll advances the carousel

#### Scenario: Tiles fit within a row
- **WHEN** the block count is less than or equal to the per-row value
- **THEN** the carousel disables navigation/scroll and the tiles display as a static row

### Requirement: Floating navigation arrows
When the carousel is active, the section SHALL display previous/next navigation arrows as floating circular buttons overlapping the left and right edges of the carousel, using the theme's existing chevron icon snippets. Arrows SHALL be keyboard-accessible and labeled for assistive technology, and SHALL reflect a disabled/inactive state at the carousel bounds per the existing slider behavior.

#### Scenario: Navigating with arrows
- **WHEN** the user clicks the next (or previous) arrow
- **THEN** the carousel advances (or rewinds) by the configured scroll amount

#### Scenario: Accessible labels
- **WHEN** the arrows are rendered
- **THEN** each has an accessible name (e.g. visually-hidden "Previous"/"Next" text) and is focusable/operable by keyboard

#### Scenario: Arrows hidden when inactive
- **WHEN** the carousel is inactive (tiles fit within a row)
- **THEN** the navigation arrows are not displayed

### Requirement: Heading with optional description and optional View All
The section SHALL display a left-aligned heading with an optional description subtext beneath it, consistent with the sibling `featured-collection-carousel`. A "View All" link SHALL be available but disabled by default to match the design; when enabled it SHALL appear at the right of the heading row on desktop and below the carousel on mobile.

#### Scenario: Heading and subtext
- **WHEN** the merchant sets a heading and a description
- **THEN** the heading renders left-aligned with the description beneath it

#### Scenario: View All disabled by default
- **WHEN** the section is added with default settings
- **THEN** no "View All" link is rendered

#### Scenario: View All enabled
- **WHEN** the "View All" link is enabled
- **THEN** the link appears at the right of the heading on desktop and below the carousel on mobile

### Requirement: Merchant configuration via section settings, blocks, and preset
The section SHALL be configurable from the theme editor via a `{% schema %}` with `collection` blocks and SHALL provide a preset so it can be added from the section picker. Section settings SHALL include at least: heading, description, cards-per-row (desktop and mobile), full-width toggle, "View All" toggle, and color scheme. The section SHALL NOT modify the existing `sections/collection-list.liquid` or `sections/featured-collection-carousel.liquid`.

#### Scenario: Added from theme editor
- **WHEN** a merchant opens the section picker
- **THEN** a collection-list carousel section is available and can be added via its preset, then populated with collection blocks

#### Scenario: Settings drive output
- **WHEN** a merchant changes heading, description, cards-per-row, full-width, View All, or color scheme settings
- **THEN** the rendered section reflects those settings without code changes

#### Scenario: Existing sections untouched
- **WHEN** this section is added
- **THEN** the existing `sections/collection-list.liquid` and `sections/featured-collection-carousel.liquid` remain unmodified
