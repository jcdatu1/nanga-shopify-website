# content-panel-section Specification

## Purpose

Provide a reusable section (`sections/c-content-panel.liquid`, "C Content panel") rendering a padded content panel with per-section background and text colors, composed from heading, text, stat, and button blocks. It covers both the NANGA design's tinted stats panel (e.g. Fill Power) and its full-width dark band (e.g. Responsible Sourcing) without touching the theme's global color schemes; no JavaScript.

## Requirements

### Requirement: Content panel section with per-section colors

The theme SHALL provide a section `sections/c-content-panel.liquid` ("C Content panel") that renders a padded content panel whose background and text colors come from per-section color pickers (not global color schemes). Defaults SHALL match the design's gray panel (light-gray background, dark text). The panel SHALL support a full-width band mode and a constrained mode via the theme's existing container utilities.

#### Scenario: Gray panel instance

- **WHEN** the section renders with default settings
- **THEN** a padded panel renders with the design's light-gray background and dark text

#### Scenario: Dark band instance

- **WHEN** the merchant sets the background color to black and the text color to white
- **THEN** the section renders as a full black band with white content, with no effect on global color schemes or other sections

### Requirement: Composable content blocks

The section SHALL compose its content from blocks consistent with the theme's established block model: `heading` (text), `text` (richtext), `stat` (label + description), and `button` (label, link, style select: primary/secondary/link). Blocks SHALL render in block order.

#### Scenario: Heading and text blocks

- **WHEN** the merchant adds a heading block and text blocks
- **THEN** the heading renders above the rich-text paragraphs in block order

#### Scenario: Button block styles

- **WHEN** a button block uses the `primary` style
- **THEN** it renders as a standard theme button (`btn btn--primary`)

### Requirement: Stat blocks render as bordered columns

Consecutive `stat` blocks SHALL render together as a responsive row of columns (three across on desktop, stacking on small screens per the design). Each stat SHALL display its label above its description with the design's stat treatment: a 2px solid left border in the panel's text color and left padding.

#### Scenario: Three stats in a row

- **WHEN** three stat blocks are configured (e.g. "760-800 FP", "860-900 FP", "1000 FP")
- **THEN** desktop shows three left-bordered columns in block order and small screens stack them

#### Scenario: Stat border follows text color

- **WHEN** the section's text color is set to white on a dark background
- **THEN** each stat's left border renders in the light color, remaining visible

### Requirement: Arrow-link button style

When a button block uses the `link` style, it SHALL render as an inline text link with the theme's `arrow-right` icon, and on hover the gap between label and arrow SHALL animate from 8px to 12px, matching the established arrow-link idiom (design `gap-2` → `gap-3`).

#### Scenario: Arrow link renders

- **WHEN** a button block with the `link` style and a label "Learn More About NANGA" renders
- **THEN** the label renders with the `arrow-right` icon and links to the block's URL

#### Scenario: Arrow link hover

- **WHEN** the user hovers the arrow link
- **THEN** the gap between label and arrow animates from 8px to 12px

### Requirement: Scoped styling and theme-editor preset

The section's styles SHALL live in a dedicated stylesheet loaded with the theme's lazy-stylesheet pattern and SHALL be scoped under a section-specific class prefix, touching no shared classes. The section SHALL provide a preset so it can be added from the section picker. The section SHALL NOT add JavaScript.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C Content panel" section is available and can be added via its preset

#### Scenario: Scoped styles only

- **WHEN** the section's stylesheet loads
- **THEN** all rules are scoped under the section's own class prefix and no shared class or other section is affected
