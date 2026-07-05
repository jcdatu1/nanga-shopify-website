# technology-page Specification

## Purpose

Provide the NANGA Technology page as a section-composed template (`templates/page.technology.json`) reproducing the design (`context/NANGAv1/src/app/pages/Technology.tsx`): hero, UDD text+image split, icon feature grid, Fill Power stats panel, dark Responsible Sourcing band, and CTA — built entirely from existing and reusable sections with the design copy as editable defaults.

## Requirements

### Requirement: Technology page template composed from sections

The theme SHALL provide `templates/page.technology.json` reproducing the design's Technology page as a stack of section instances in order: an `image-with-text-overlay` hero, a `split-content` text+image band, a `c-icon-features` grid, a `c-content-panel` stats panel (gray), a `c-content-panel` dark band, and a `rich-text` CTA. The template SHALL include `main-page` disabled, per the theme's page-composition convention (`page.story.json`). No stock section or `split-content` SHALL be modified by this template.

#### Scenario: Assigning the template

- **WHEN** a merchant creates a page and assigns the `page.technology` template
- **THEN** the page renders the six bands in the design's order, each editable as a normal section in the theme editor

#### Scenario: Reused sections are configuration-only

- **WHEN** the template is added to the theme
- **THEN** `image-with-text-overlay`, `split-content`, and `rich-text` render via template settings only, with their section files unchanged

### Requirement: Design-faithful instance configuration

The template's instances SHALL default to the design's content and presentation: hero with fixed height, full tint overlay, centered "Technology" H1 and subtitle; UDD band constrained with image right; four icon features (water resistance, warmth, premium fill, tested extreme); Fill Power panel with heading, intro paragraphs, and three FP stat columns; dark band with "Responsible Sourcing" heading, paragraphs, and an arrow link to the About page; centered CTA with a primary button to the shop collection. All copy SHALL be hardcoded template defaults from the design, editable in the theme editor.

#### Scenario: Fresh assignment matches the design

- **WHEN** the template is assigned and no settings are changed (merchant supplies hero/UDD imagery)
- **THEN** the rendered page matches the design's Technology page structure, copy, and treatments

#### Scenario: Copy is merchant-editable

- **WHEN** the merchant edits any heading, paragraph, stat, or link in the theme editor
- **THEN** the change persists in the template instance without code edits
