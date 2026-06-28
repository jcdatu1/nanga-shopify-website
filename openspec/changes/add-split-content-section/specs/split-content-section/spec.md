## ADDED Requirements

### Requirement: Split image-and-panel layout

The section SHALL render a two-part layout: a full-bleed image that fills one half via
`object-cover`, and a text panel that fills the other half. On desktop the two halves SHALL sit
side by side at equal width; on mobile they SHALL stack vertically with the image above the panel.

#### Scenario: Desktop side-by-side

- **WHEN** the section renders on a desktop viewport
- **THEN** the image and text panel appear as two equal-width halves side by side
- **AND** the image fills its half edge-to-edge using `object-cover` with no internal padding or max-width constraint

#### Scenario: Mobile stacked

- **WHEN** the section renders on a mobile viewport
- **THEN** the image appears above the text panel, each spanning the full width

#### Scenario: Image missing

- **WHEN** no image is selected for the section
- **THEN** a placeholder image is shown in the image half so the layout remains intact

### Requirement: Image position control

The section SHALL allow the editor to place the image on the left (image first) or right (image
last) on desktop via an `image_position` setting, defaulting to left to match the design.

#### Scenario: Image on right

- **WHEN** `image_position` is set to "right"
- **THEN** on desktop the text panel appears first (left) and the image appears second (right)

### Requirement: Full-width and page-width layout option

The section SHALL provide a `full_width` toggle. When enabled, the section runs edge-to-edge
across the viewport. When disabled, the section is constrained to the theme's page width
(`container`).

#### Scenario: Full width enabled

- **WHEN** `full_width` is enabled
- **THEN** the section spans the full viewport width with no page-width container max

#### Scenario: Constrained to page width

- **WHEN** `full_width` is disabled
- **THEN** the section is wrapped in the theme's standard `container` and aligns to page width

### Requirement: Color-scheme text panel

The text panel SHALL use the theme's color-scheme mechanism for its background, heading, text,
link, and button colors, selectable via a `color_scheme` setting. The default SHALL be a light
scheme so the panel reads as a subtle off-white background consistent with the design.

#### Scenario: Panel uses selected color scheme

- **WHEN** a `color_scheme` value is selected
- **THEN** the text panel background and typography colors reflect that scheme's tokens

### Requirement: Configurable content blocks

The section SHALL support content composed from blocks: heading, subheading, text, and button.
Editors SHALL be able to add, remove, and reorder these blocks within the panel. The button block
SHALL support a link style that renders as an inline call-to-action with an arrow affordance.

#### Scenario: Compose panel content

- **WHEN** the editor adds a heading, one or more text blocks, and a button block
- **THEN** the panel renders them in order within the text half

#### Scenario: Link-style call to action

- **WHEN** a button block uses the link style
- **THEN** it renders as an inline text link with an arrow affordance rather than a filled button

### Requirement: Image height behavior

In full-width mode the image SHALL fill its half and, on desktop, match the height of the adjacent
text panel via the theme's half-fill pattern. On mobile the stacked image SHALL render at its
natural aspect ratio. No per-section height controls are required, since the existing layout
pattern achieves the design without them.

#### Scenario: Desktop image matches panel height

- **WHEN** full width is enabled and the section renders on a desktop viewport
- **THEN** the image fills its half and its height matches the rendered height of the adjacent text panel

#### Scenario: Mobile stacked image

- **WHEN** the section renders on a mobile viewport
- **THEN** the image renders full width above the panel at its natural aspect ratio

### Requirement: Editor preset and stock section isolation

The section SHALL be available as a theme editor preset and SHALL be a distinct section from the
stock `image-with-text`, leaving the stock section and its templates (`page.returns`,
`page.story`) unchanged.

#### Scenario: Available as preset

- **WHEN** an editor browses sections to add
- **THEN** the new split content section appears as a selectable preset

#### Scenario: Stock section unaffected

- **WHEN** the new section is added or edited
- **THEN** the stock `image-with-text` section and the `page.returns` / `page.story` templates render exactly as before
