# journal-blog-page Specification

## Purpose

Provide the NANGA Journal page as a section-composed alternate blog template (`templates/blog.journal.json`) reproducing the design (`context/NANGAv1/src/app/pages/Journal.tsx`): flat page header, featured-article hero, and paginated article grid — built from the reusable `c-page-header`, `c-featured-article`, and `c-blog-grid` sections with the design copy as editable defaults.

## Requirements

### Requirement: Journal blog template composed from sections

The theme SHALL provide `templates/blog.journal.json` reproducing the design's Journal page (`context/NANGAv1/src/app/pages/Journal.tsx`) as a stack of section instances in order: a `c-page-header`, a `c-featured-article`, and a `c-blog-grid`. The template SHALL include `main-blog` disabled, per the theme's composition convention. No existing section or template SHALL be modified.

#### Scenario: Assigning the template

- **WHEN** a merchant assigns the `blog.journal` template to a blog
- **THEN** the blog page renders header, featured hero, and grid in the design's order, each editable as a normal section in the theme editor

### Requirement: Design-faithful instance configuration

The template's instances SHALL default to the design's content and treatments: header "Journal" as the page H1 with subtitle "Stories, guides, and insights from the field" on a white band with bottom border; the featured hero with blank article selection (most recent post) and "Read Article" label; and the grid at 9 posts per page with featured-skip enabled.

#### Scenario: Fresh assignment matches the design

- **WHEN** the template is assigned and no settings are changed
- **THEN** the rendered page matches the design's Journal structure: title band, latest post as the split hero, and the remaining posts in the card grid
