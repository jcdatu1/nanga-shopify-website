## ADDED Requirements

### Requirement: Knowledge page template composed from sections

The theme SHALL provide `templates/page.knowledge.json` reproducing the design's Knowledge page as a stack of section instances in order: a `c-page-header`, a `c-link-cards` grid (image style), a `c-link-cards` band (box style), and a `c-faq-list`. The template SHALL include `main-page` disabled, per the theme's page-composition convention. No existing section or template SHALL be modified.

#### Scenario: Assigning the template

- **WHEN** a merchant creates a page and assigns the `page.knowledge` template
- **THEN** the page renders the four bands in the design's order, each editable as a normal section in the theme editor

### Requirement: Design-faithful instance configuration

The template's instances SHALL default to the design's content: header "KNOWLEDGE" with its subtitle on the gray bordered band; three image cards (NANGA MOVEMENT, QUALITY PHILOSOPHY, TECHNOLOGY) with descriptions and "Learn More" labels; the gray "Care & Maintenance" band with two box cards (Down Care Guide / "Read Guide", Warranty & Repair / "Learn More"); and the "Frequently Asked Questions" list with the design's four Q/A items. All copy SHALL be hardcoded template defaults, editable in the theme editor; card links SHALL be merchant-repointable URL settings.

#### Scenario: Fresh assignment matches the design

- **WHEN** the template is assigned and no settings are changed (merchant supplies grid imagery and repoints links)
- **THEN** the rendered page matches the design's Knowledge page structure, copy, and treatments

#### Scenario: Copy is merchant-editable

- **WHEN** the merchant edits any heading, card, or FAQ item in the theme editor
- **THEN** the change persists in the template instance without code edits
