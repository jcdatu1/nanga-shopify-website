# icon-features-section Specification

## Purpose

Provide a reusable section (`sections/c-icon-features.liquid`, "C Icon features") rendering a responsive grid of centered feature columns — an icon in a light-gray square tile, a title, and short text — matching the NANGA design's Technology feature grid. Icons come from the theme's `icon` snippet with an optional per-block image override; no JavaScript.

## Requirements

### Requirement: Icon feature grid section

The theme SHALL provide a section `sections/c-icon-features.liquid` ("C Icon features") that renders a responsive grid of feature columns. Each column SHALL display, centered: an icon inside a square light-gray tile, a title, and a short text beneath it. Content SHALL come from `feature` blocks, one column per block, in block order.

#### Scenario: Features render in block order

- **WHEN** the merchant adds four feature blocks and views the section
- **THEN** four columns render in block order, each with its icon tile, title, and text centered

#### Scenario: No blocks configured

- **WHEN** the section has no blocks (fresh install in the theme editor)
- **THEN** the section renders without error (empty grid or placeholder content) and remains previewable

### Requirement: Feature icon via theme icon set with image override

Each `feature` block SHALL provide an icon `select` sourced from the theme's `icon` snippet names and an optional `image_picker` override. When an override image is set, it SHALL render inside the tile instead of the icon, responsively sized and lazy-loaded. When neither produces a glyph, the tile SHALL be omitted and the title/text still render.

#### Scenario: Icon from the theme set

- **WHEN** a feature block selects the `droplet` icon and sets no image
- **THEN** the tile renders the inline `droplet` SVG from `snippets/icon.liquid`, colored via `currentColor`

#### Scenario: Custom image override

- **WHEN** a feature block sets a custom image
- **THEN** the tile renders that image instead of the selected icon

### Requirement: Responsive grid and section settings

The section SHALL expose settings for columns per row on desktop and on mobile, a color scheme select, and a full-width toggle — consistent with sibling custom sections. The grid SHALL collapse per the design: the configured desktop columns on large screens, the configured mobile columns on small screens.

#### Scenario: Design-default layout

- **WHEN** the section renders with default settings and four blocks
- **THEN** desktop shows 4 columns and small screens show 2 columns, matching the design's feature grid

#### Scenario: Settings drive output

- **WHEN** the merchant changes any exposed setting
- **THEN** the rendered section reflects it without code changes

### Requirement: Scoped styling and theme-editor preset

The section's styles SHALL live in a dedicated stylesheet loaded with the theme's lazy-stylesheet pattern and SHALL be scoped under a section-specific class prefix, touching no shared classes. The section SHALL provide a preset so it can be added from the section picker. The section SHALL NOT add JavaScript.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C Icon features" section is available and can be added via its preset

#### Scenario: Scoped styles only

- **WHEN** the section's stylesheet loads
- **THEN** all rules are scoped under the section's own class prefix and no shared class or other section is affected
