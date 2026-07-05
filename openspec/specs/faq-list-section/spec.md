# faq-list-section Specification

## Purpose

Provide a flat FAQ section (`sections/c-faq-list.liquid`, "C FAQ list"): a heading and always-open question/answer blocks separated by light borders at reading width, matching the NANGA design's static FAQ presentation — deliberately distinct from the stock `collapsible-tabs` accordion; no JavaScript.

## Requirements

### Requirement: Flat FAQ list section

The theme SHALL provide a section `sections/c-faq-list.liquid` ("C FAQ list") rendering a heading and `item` blocks as an always-open question/answer list: each item shows its question as a subheading with the answer text visible beneath it (no accordion, no JavaScript). Items SHALL be separated by a light bottom border (`#e5e7eb`), with no border after the last item. Content SHALL be constrained to reading width per the design.

#### Scenario: FAQ items render open

- **WHEN** the section renders with four item blocks
- **THEN** all four questions and answers are visible with borders between items and none after the last

#### Scenario: Reading-width layout

- **WHEN** the section renders on desktop
- **THEN** the heading and items are constrained to the theme's reading-width container

#### Scenario: Distinct from the accordion

- **WHEN** this section is added to the theme
- **THEN** the stock `collapsible-tabs` section and `page.faq.json` are unchanged and remain the accordion option

### Requirement: Composable item blocks

Each `item` block SHALL provide a question title (text) and an answer (richtext). Blocks SHALL render in block order and be add/remove/reorderable in the theme editor.

#### Scenario: Editing items

- **WHEN** the merchant adds, edits, or reorders item blocks
- **THEN** the rendered list reflects the change without code edits

### Requirement: Scoped styling and preset

Styles SHALL live in a dedicated lazily-loaded stylesheet scoped under a section-specific class prefix, and the section SHALL provide a theme-editor preset.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C FAQ list" section is available via its preset
