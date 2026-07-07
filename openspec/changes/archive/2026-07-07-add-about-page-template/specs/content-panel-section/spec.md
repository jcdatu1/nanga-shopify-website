# content-panel-section Specification (delta)

## MODIFIED Requirements

### Requirement: Composable content blocks

The section SHALL compose its content from blocks consistent with the theme's established block model: `heading` (text), `subheading` (text), `text` (richtext), `stat` (label + description), and `button` (label, link, style select: primary/secondary/link). Blocks SHALL render in block order. The `subheading` block SHALL render as an `<h3>` scoped to the panel (`ccp__subheading`), colored with the panel's heading/stat color and sized between the panel heading and body text, so long-form content can express subsections beneath the panel's `<h2>` heading. Adding the `subheading` block SHALL NOT change the rendering of existing block types or existing section instances.

#### Scenario: Heading and text blocks

- **WHEN** the merchant adds a heading block and text blocks
- **THEN** the heading renders above the rich-text paragraphs in block order

#### Scenario: Button block styles

- **WHEN** a button block uses the `primary` style
- **THEN** it renders as a standard theme button (`btn btn--primary`)

#### Scenario: Subheading blocks between text blocks

- **WHEN** the merchant composes a heading block, then alternating subheading and text blocks
- **THEN** the panel renders one h2 followed by h3 subsections each above their paragraphs, in block order

#### Scenario: Existing instances unaffected

- **WHEN** a `c-content-panel` instance that uses no subheading blocks (e.g. the Technology template's panels) renders after this change
- **THEN** its markup and styling are unchanged
