# blog-grid-section Specification

## Purpose

Provide the NANGA blog article grid (`sections/c-blog-grid.liquid` + `assets/c-blog-grid.css`) for blog templates, reproducing the design's Journal grid (`context/NANGAv1/src/app/pages/Journal.tsx`): a paginated responsive grid of whole-card article links with metafield-driven meta, the theme's zoom/tint hover language, and automatic skipping of the featured article shown by the companion `c-featured-article` section.

## Requirements

### Requirement: Paginated blog article grid section

The theme SHALL provide a `c-blog-grid` section, restricted to blog templates, that paginates the blog's articles into a responsive grid of whole-card article links: one column on mobile, two from 640px, three from 1024px. Each card SHALL render a 16:10 image (with gray placeholder when the article has no image), the category • read-time meta row (`custom.c_category` / `custom.c_minute_read`, each hidden independently when unset), title, excerpt (with truncated-content fallback), and localized publish date. Pagination SHALL reuse the theme's `pagination-control` snippet, page size SHALL be a "Posts per page" setting, and styles SHALL be scoped in `assets/c-blog-grid.css` with no new JS.

#### Scenario: Rendering the grid

- **WHEN** the section is placed on a blog template with articles
- **THEN** the articles render as responsive cards with lazy-loaded images, followed by pagination when more than one page exists

#### Scenario: Empty blog

- **WHEN** the blog has no articles
- **THEN** the section renders the theme's localized "no matches" message

### Requirement: Grid skips the featured article

The section SHALL skip the article shown by the companion `c-featured-article` section, resolved from its own matching URL-type "Featured article" setting (blank = the blog's most recent post), matched by article ID so the skip works on any paginated page. Resolution SHALL happen outside the `paginate` block so "most recent" is the blog's true latest post on every page. A "Skip the featured article" checkbox (default on) SHALL disable the behavior for grids used without the hero.

#### Scenario: Default configuration skips the latest post

- **WHEN** both sections' Featured article settings are blank
- **THEN** the hero shows the most recent post and the grid omits it, on page 1 and on later pages

#### Scenario: Pinned featured article

- **WHEN** the merchant selects the same post URL in both sections' settings
- **THEN** the grid omits that post wherever it would appear

#### Scenario: Skip disabled

- **WHEN** the "Skip the featured article" checkbox is off
- **THEN** the grid shows every article on the page, including the featured one

### Requirement: Grid card hover language

On card hover, the image SHALL zoom (scale 1.05 over 500ms with the theme's easing) and the title SHALL tint to the theme's gray, matching the featured-article hero and the theme's existing card idiom.

#### Scenario: Hovering a card

- **WHEN** the pointer hovers anywhere on a grid card
- **THEN** the image zooms and the title tints together
