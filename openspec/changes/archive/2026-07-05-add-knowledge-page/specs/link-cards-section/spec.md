## ADDED Requirements

### Requirement: Link card grid section with image and box styles

The theme SHALL provide a section `sections/c-link-cards.liquid` ("C Link cards") rendering card blocks as a responsive grid, with a `card_style` select: **Image** — a 4:3 cover-cropped image well (light-gray `#f3f4f6` background) above the text; **Box** — the text inside a white padded card. Cards SHALL render in block order with settings for columns per row on desktop and mobile.

#### Scenario: Image-style grid

- **WHEN** the section renders with `card_style: image` and three card blocks
- **THEN** three columns render, each with a 4:3 cover image well above the title, text, and arrow label

#### Scenario: Box-style grid

- **WHEN** the section renders with `card_style: box` and two card blocks
- **THEN** two columns render as white padded cards containing title, text, and arrow label, with no image

### Requirement: Whole-card link and card anatomy

Each card block SHALL provide image (used by the image style), title, text, link, and link label (default "Learn More") settings. When a link is set, the entire card SHALL be a single anchor to it; when unset, the card SHALL render as a non-anchor element. The arrow label SHALL render with the theme's `arrow-right` icon.

#### Scenario: Whole card is clickable

- **WHEN** a card has a link and the user clicks anywhere on the card
- **THEN** the browser navigates to the card's URL via a single wrapping anchor

#### Scenario: Card without a link

- **WHEN** a card block has no link set
- **THEN** the card renders its content without an anchor element

### Requirement: Design hover language

Cards SHALL follow the theme's established hover treatments, triggered by hovering anywhere on the card: image-style cards zoom the image to 1.05 over 0.5s with `cubic-bezier(0.4, 0, 0.2, 1)`; box-style cards gain the `shadow-lg` elevation (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`); on both, the title transitions to `#4b5563` over 150ms and the arrow label's gap animates 8px → 12px.

#### Scenario: Image card hover

- **WHEN** the user hovers an image-style card
- **THEN** the image zooms to 1.05 with the design easing, the title shifts to `#4b5563`, and the arrow gap animates to 12px

#### Scenario: Box card hover

- **WHEN** the user hovers a box-style card
- **THEN** the card gains the `shadow-lg` elevation, the title shifts to `#4b5563`, and the arrow gap animates to 12px

### Requirement: Optional heading and band background

The section SHALL expose an optional heading rendered above the grid and a `background_color` picker (default transparent/none). A tinted background SHALL wrap the section as a full band so one section reproduces both the design's plain grid and its gray "Care & Maintenance" band.

#### Scenario: Plain grid instance

- **WHEN** the section renders with no heading and no background color
- **THEN** only the card grid renders on the page background

#### Scenario: Tinted band instance

- **WHEN** the merchant sets a heading and a light-gray background
- **THEN** the section renders as a tinted band with the heading above the grid

### Requirement: Responsive images, scoped styling, no JS, preset

Card images SHALL use responsive `image_url` with `srcset`/`sizes` and lazy loading. Styles SHALL live in a dedicated lazily-loaded stylesheet scoped under a section-specific class prefix. The section SHALL load no JavaScript and SHALL provide a theme-editor preset.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C Link cards" section is available via its preset

#### Scenario: Responsive lazy images

- **WHEN** an image-style card renders below the fold
- **THEN** its image uses `srcset`/`sizes` and lazy loading
