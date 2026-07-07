# about-page Specification

## Purpose

Provide the NANGA About page as a section-composed template (`templates/page.about.json`) reproducing the design (`context/NANGAv1/src/app/pages/About.tsx`): hero, founding-story band, deferred brand video, Japan Quality long-form band with subsections, and CTA — built entirely from existing sections plus the extended content panel, with the design copy as editable defaults.

## Requirements

### Requirement: About page template composed from sections

The theme SHALL provide `templates/page.about.json` reproducing the design's About page (`context/NANGAv1/src/app/pages/About.tsx`) as a stack of section instances in order: an `image-with-text-overlay` hero, a `c-content-panel` story band, a `video` section, a `c-content-panel` Japan Quality band, and a `rich-text` CTA. The template SHALL include `main-page` disabled, per the theme's page-composition convention. Stock sections (`image-with-text-overlay`, `video`, `rich-text`) SHALL be reused via template settings only, with their section files unchanged.

#### Scenario: Assigning the template

- **WHEN** a merchant creates a page and assigns the `page.about` template
- **THEN** the page renders the five bands in the design's order, each editable as a normal section in the theme editor

#### Scenario: Stock sections are configuration-only

- **WHEN** the template is added to the theme
- **THEN** `image-with-text-overlay`, `video`, and `rich-text` render via template settings only, with their section files unchanged

### Requirement: Design-faithful instance configuration

The template's instances SHALL default to the design's content and presentation: hero with fixed height (720 desktop / 480 mobile), full tint + shadow overlay, centered "ABOUT NANGA" H1 and "Passion to Challenge the Impossible" tagline; a white full-width story band at reading width with the "Passion to Challenge the Impossible" heading and its two founding-story paragraphs; the NANGA brand video as an external YouTube video (`https://www.youtube.com/watch?v=1TCP8EZ1gAU`) with a screen-reader description; a white full-width Japan Quality band with the "JAPAN QUALITY" heading, four subheaded subsections (Relentless Pursuit of Quality, Commitment to Domestic Washing, Manufacturing by Skilled Artisans, Precise and Prompt After-Care) with their paragraphs, and an "Explore Our Technology" arrow link to `/pages/technology`; and a centered CTA band on the theme's gray color scheme with the "Experience NANGA" heading, supporting text, and a primary "Shop Collection" button to `/collections/down-jackets`. All copy SHALL be hardcoded template defaults from the design, editable in the theme editor.

#### Scenario: Fresh assignment matches the design

- **WHEN** the template is assigned and no settings are changed (merchant supplies hero image and video cover image)
- **THEN** the rendered page matches the design's About page structure, copy, and treatments

#### Scenario: Copy is merchant-editable

- **WHEN** the merchant edits any heading, subheading, paragraph, or link in the theme editor
- **THEN** the change persists in the template instance without code edits

#### Scenario: Video is deferred

- **WHEN** the About page loads
- **THEN** no YouTube iframe is requested until the visitor activates the play button

### Requirement: Document outline

The template SHALL produce a single `<h1>` (the hero heading), `<h2>` band headings, and `<h3>` subsection headings within the Japan Quality band, matching the design's heading hierarchy.

#### Scenario: Heading hierarchy

- **WHEN** the rendered About page's document outline is inspected
- **THEN** "ABOUT NANGA" is the only h1, band headings ("Passion to Challenge the Impossible", "JAPAN QUALITY", "Experience NANGA") are h2, and the four Japan Quality subsection titles are h3
