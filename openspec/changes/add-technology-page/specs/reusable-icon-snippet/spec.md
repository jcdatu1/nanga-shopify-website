## ADDED Requirements

### Requirement: Feature icons registered

The `icon` snippet (`snippets/icon.liquid`) SHALL additionally register `droplet`, `thermometer`, and `mountain` icons, rendered as inline SVGs stroke-styled consistently with the existing lucide-derived set (e.g. `feather`) and colored via `currentColor`. Registration SHALL be purely additive: existing icons, parameters, and callers SHALL be unaffected.

#### Scenario: Render a new feature icon

- **WHEN** the snippet is rendered with `icon: 'droplet'` (or `thermometer`, `mountain`)
- **THEN** it outputs the inline SVG carrying the `icon--type-<name>` class, stroked with `currentColor`

#### Scenario: Existing icons unaffected

- **WHEN** the snippet is rendered with any previously registered icon (e.g. `arrow-right`, `feather`)
- **THEN** the output is identical to the pre-change output
