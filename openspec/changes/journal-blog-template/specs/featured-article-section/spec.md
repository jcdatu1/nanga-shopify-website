## ADDED Requirements

### Requirement: Featured article hero section

The theme SHALL provide a `c-featured-article` section, restricted to blog templates, that renders one article as the design's split hero: a 4:3 image beside a vertically centered column of meta row, article title, excerpt, and an arrow "Read Article" label. The whole card SHALL be a single link to the article. Styles SHALL be scoped in a dedicated stylesheet (`assets/c-featured-article.css`) with no new JS, reusing the theme's `image`, `icon`, `animation-attrs`, and `lazy-stylesheet-attrs` snippets.

#### Scenario: Rendering on the blog template

- **WHEN** the section is placed on a blog template with at least one article
- **THEN** it renders the split hero linking to the resolved featured article, with the image loaded eagerly at high fetch priority (it is the page's likely LCP)

#### Scenario: Empty blog

- **WHEN** the blog has no articles and no featured article resolves
- **THEN** the section renders nothing

### Requirement: Featured article selection with latest-post fallback

The section SHALL provide a URL-type "Featured article" setting resolved via the global `articles` object (parsing the blog/article handle pair from the `/blogs/...` URL). When the setting is blank or does not resolve to an article, the section SHALL fall back to the blog's most recent post.

#### Scenario: Default configuration

- **WHEN** the Featured article setting is blank
- **THEN** the hero features the blog's most recent post

#### Scenario: Pinned article

- **WHEN** the merchant selects a specific blog post URL in the setting
- **THEN** the hero features that post regardless of recency

### Requirement: Metafield-driven meta row

The hero's meta row SHALL show the article's category from `custom.c_category` and read time from `custom.c_minute_read` (rendered as "<n> min read" with the theme's clock icon), separated by a bullet. Each part SHALL hide independently when its metafield is unset, the separator SHALL only appear when both are present, and the row SHALL be omitted entirely when both are unset. Title and excerpt SHALL come from the article, with the excerpt falling back to truncated article content.

#### Scenario: Both metafields set

- **WHEN** an article has `custom.c_category` "Guides" and `custom.c_minute_read` 8
- **THEN** the meta row renders "Guides • 🕒 8 min read"

#### Scenario: Partial metafields

- **WHEN** only one of the two metafields is set
- **THEN** only that part renders, with no bullet separator

### Requirement: Card hover language

On card hover, the image SHALL zoom (scale 1.05 over 500ms with the theme's easing), the title SHALL tint to the theme's gray, and the arrow label's gap SHALL widen from 8px to 12px, matching the theme's existing card hover idiom.

#### Scenario: Hovering the hero

- **WHEN** the pointer hovers anywhere on the hero card
- **THEN** the image zooms, the title tints, and the arrow gap widens together
