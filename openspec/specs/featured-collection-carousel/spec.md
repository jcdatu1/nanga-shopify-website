# featured-collection-carousel Specification

## Purpose

Provide a merchant-configurable section that renders a selected collection's products as a horizontally scrolling carousel of product cards, matching the NANGA Figma design. It reuses the existing `snippets/product-card.liquid` snippet and the theme's native `<carousel-slider>` engine (no third-party libraries), with responsive cards-per-row and peek, floating navigation arrows, a left-aligned heading with optional description and "View All" link, a configurable badge/tag style, and a theme-editor preset.

## Requirements

### Requirement: Section renders a collection as product cards
The section SHALL render the products of a merchant-selected collection using the existing `snippets/product-card.liquid` snippet, one card per product, up to a configurable limit. When no collection is selected, the section SHALL render onboarding placeholder cards so the section is previewable in the theme editor.

#### Scenario: Collection selected
- **WHEN** the merchant selects a collection with products and views the section
- **THEN** each product is rendered via `product-card` showing image, title, price, and (when present) vendor/category and value props

#### Scenario: No collection selected
- **WHEN** no collection is selected (e.g. fresh install in the theme editor)
- **THEN** the section renders placeholder product cards instead of being empty

#### Scenario: Product card snippet is reused unchanged
- **WHEN** the section renders product cards
- **THEN** it calls `{% render 'product-card' %}` and does not duplicate or fork the card markup

### Requirement: Carousel uses the theme's native engine without third-party libraries
The carousel SHALL be built on the theme's existing `<carousel-slider>` custom element (backed by `assets/slider.js` / `assets/main.js`) and SHALL NOT introduce any third-party carousel library or new JavaScript dependency.

#### Scenario: No new dependency
- **WHEN** the section is implemented
- **THEN** no new JS/CSS framework or carousel package is added; navigation is powered by the existing `carousel-slider` element

#### Scenario: Lazy initialization
- **WHEN** the section is below the fold
- **THEN** the carousel initializes via the theme's existing lazy-init path rather than adding render-blocking scripts

#### Scenario: Graceful fallback with few products
- **WHEN** the collection has fewer products than fit in the viewport
- **THEN** the carousel disables navigation/scroll and the cards display as a static row

### Requirement: Responsive carousel behavior with peek
The carousel SHALL scroll horizontally with scroll-snap and SHALL show a partial "peek" of the next card to signal more content. The number of fully visible cards SHALL scale across mobile, tablet, and desktop via section settings.

#### Scenario: Desktop view
- **WHEN** viewed on desktop
- **THEN** the configured number of cards per row is shown with a peek of the next card and a consistent gap between cards

#### Scenario: Mobile view
- **WHEN** viewed on a mobile viewport
- **THEN** fewer cards are shown per the mobile setting, with a peek of the next card, and swipe/scroll advances the carousel

### Requirement: Floating navigation arrows
The section SHALL display previous/next navigation arrows as floating circular buttons overlapping the left and right edges of the carousel, using the theme's existing chevron icon snippets. Arrows SHALL be keyboard-accessible and labeled for assistive technology.

#### Scenario: Navigating with arrows
- **WHEN** the user clicks the next (or previous) arrow
- **THEN** the carousel advances (or rewinds) by the configured scroll amount

#### Scenario: Accessible labels
- **WHEN** the arrows are rendered
- **THEN** each has an accessible name (e.g. visually-hidden "Previous"/"Next" text) and is focusable/operable by keyboard

#### Scenario: Arrow state at bounds
- **WHEN** the carousel is at the first or last position
- **THEN** the corresponding arrow reflects a disabled/inactive state per the existing slider behavior

### Requirement: Figma-faithful heading and View All link
The section SHALL display a left-aligned heading with an optional description subtext beneath it, and an optional "View All" link to the collection. On desktop the "View All" link SHALL appear at the right of the heading row; on mobile it SHALL appear below the carousel.

#### Scenario: Heading and subtext
- **WHEN** the merchant sets a heading and a description
- **THEN** the heading renders left-aligned with the description beneath it

#### Scenario: View All enabled
- **WHEN** the "View All" link is enabled and a collection is selected
- **THEN** the link points to the collection URL, shown at the right of the heading on desktop and below the carousel on mobile

#### Scenario: View All disabled
- **WHEN** the "View All" link is disabled
- **THEN** no "View All" link is rendered in either position

### Requirement: Configurable badge/tag style
The section SHALL expose a tag/badge style setting (light or dark) that is passed to `product-card` to control badge background/text colors for all cards in the section, matching the Figma `tagStyle` prop.

#### Scenario: Dark tag style
- **WHEN** the tag style is set to "dark"
- **THEN** product badges render with a dark background and light text

#### Scenario: Light tag style
- **WHEN** the tag style is set to "light"
- **THEN** product badges render with a light background and dark text

### Requirement: Merchant configuration via section settings and preset
The section SHALL be configurable from the theme editor via a `{% schema %}` and SHALL provide a preset so it can be added from the section picker. Settings SHALL include at least: heading, description/subheading, collection, cards-per-row (desktop and mobile), "View All" toggle, tag style, color scheme, and full-width toggle.

#### Scenario: Added from theme editor
- **WHEN** a merchant opens the section picker
- **THEN** a "Featured collection (carousel)" section is available and can be added to a page via its preset

#### Scenario: Settings drive output
- **WHEN** a merchant changes heading, description, collection, cards-per-row, tag style, color scheme, or full-width settings
- **THEN** the rendered section reflects those settings without code changes

#### Scenario: Existing section untouched
- **WHEN** this section is added
- **THEN** the existing `sections/featured-collection.liquid` and `snippets/product-card.liquid` remain unmodified
