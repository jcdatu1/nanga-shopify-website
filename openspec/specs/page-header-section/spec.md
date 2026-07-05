# page-header-section Specification

## Purpose

Provide a reusable flat page-header section (`sections/c-page-header.liquid`, "C Page header"): an H1 title and reading-width subtitle on a per-section tinted band with an optional bottom border, reproducing the NANGA design's Knowledge/Journal/category page headers from settings alone — with blank settings falling back to the template context (collection title/description, page title) so the same section serves collection templates dynamically; no JavaScript.

## Requirements

### Requirement: Flat page header section

The theme SHALL provide a section `sections/c-page-header.liquid` ("C Page header") rendering a flat page header band: a title (H1 by default via a `use_h1` setting) and an optional subtitle beneath it, left-aligned in a page-width container. The subtitle SHALL be width-capped per the design (`max-w-2xl` equivalent) independent of the container width.

#### Scenario: Header renders title and subtitle

- **WHEN** the section renders with a title "KNOWLEDGE" and a subtitle
- **THEN** the band shows the H1 title with the subtitle beneath it, left-aligned, with the subtitle capped at reading width

#### Scenario: Subtitle omitted

- **WHEN** no subtitle is set
- **THEN** only the title renders, with no empty subtitle spacing artifacts

### Requirement: Per-section tint and bottom border

The section SHALL expose a `background_color` picker (default the design's light gray `#f9fafb`) and a bottom-border toggle (default on, `#e5e7eb`), so settings alone reproduce the design's header variants: gray with border (Knowledge, category) and white with border (Journal).

#### Scenario: Gray header variant

- **WHEN** the section renders with default settings
- **THEN** the band has the light-gray background and a bottom border

#### Scenario: White header variant

- **WHEN** the merchant sets the background to white/transparent and keeps the border
- **THEN** the band renders borderless-gray-free with only the bottom border, matching the Journal header

### Requirement: Scoped styling, no JS, and theme-editor preset

The section's styles SHALL live in a dedicated lazily-loaded stylesheet scoped under a section-specific class prefix; the section SHALL load no JavaScript and SHALL provide a preset in the section picker.

#### Scenario: Added from theme editor

- **WHEN** a merchant opens the section picker
- **THEN** a "C Page header" section is available via its preset

#### Scenario: No script or shared-class impact

- **WHEN** the section renders
- **THEN** no script tag is emitted and no shared class or other section is affected

### Requirement: Contextual title and subtitle fallback

When the section's `title` setting is blank, the header SHALL fall back to the template context's title: `collection.title` on collection templates, else `page.title` on page templates. When the subtitle setting is blank on a collection template, the header SHALL fall back to `collection.description` (rendered as rich text). Instances with non-blank settings SHALL behave exactly as before; a blank fallback (e.g. a collection with no description) SHALL render cleanly with no empty-element artifacts.

#### Scenario: Dynamic collection header

- **WHEN** an instance with a blank title and blank subtitle renders on a collection template
- **THEN** the header shows the current collection's title as the heading and its description as the subtitle

#### Scenario: Static settings take precedence

- **WHEN** an instance sets a non-blank title (e.g. "KNOWLEDGE")
- **THEN** the configured text renders and no contextual fallback applies

#### Scenario: Collection without a description

- **WHEN** the current collection has no description and the subtitle setting is blank
- **THEN** the header renders only the title, with no empty subtitle markup
