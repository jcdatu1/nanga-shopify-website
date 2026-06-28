# reusable-icon-snippet Specification

## Purpose

Provide a reusable Liquid `icon` snippet that renders inline SVG icons selected by name, including an `arrow-right` glyph, with an optional stroke-width override.

## Requirements

### Requirement: Reusable icon snippet registers arrow-right

The theme's existing `icon` snippet (`snippets/icon.liquid`), which renders an inline SVG selected by a required `icon` string parameter and emits an `icon--type-<icon>` class, SHALL register an `arrow-right` icon. The `arrow-right` icon SHALL render a line-arrow (`→`) using the lucide `ArrowRight` path so it matches the hero figma design. The snippet SHALL remain callable as `{% render 'icon', icon: '<name>' %}`.

#### Scenario: Render the arrow-right icon

- **WHEN** the snippet is rendered with `icon: 'arrow-right'`
- **THEN** it outputs the inline right-arrow SVG markup carrying the `icon--type-arrow-right` class

#### Scenario: Unknown icon name

- **WHEN** the snippet is rendered with an `icon` value that is not registered
- **THEN** it outputs no icon glyph (an empty SVG wrapper, no error)

### Requirement: Optional stroke width override

The `icon` snippet SHALL accept an optional `stroke_width` parameter that overrides the default stroke width derived from `size`. When `stroke_width` is omitted, existing behavior SHALL be preserved (stroke width `1.5` for `size: 'small'`, otherwise `1`).

#### Scenario: Override stroke width

- **WHEN** the snippet is rendered with `icon: 'arrow-right', size: 'small', stroke_width: 2`
- **THEN** the output SVG uses stroke width `2`

#### Scenario: Default stroke width preserved

- **WHEN** the snippet is rendered without `stroke_width` (e.g. `icon: 'arrow-right', size: 'small'`)
- **THEN** the output SVG uses the size-derived stroke width (`1.5` for `small`)
