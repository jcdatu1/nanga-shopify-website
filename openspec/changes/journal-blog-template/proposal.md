# journal-blog-template

## Why

The NANGA design includes a Journal page (`context/NANGAv1/src/app/pages/Journal.tsx`) — a blog listing with a page-title band, a large featured-article hero, and a 3-column article grid — but the theme's blog rendering is still the stock `main-blog` list, which matches neither the layout nor the design's card treatments (16:10/4:3 imagery with zoom hover, category • read-time meta, whole-card links). The store now has the supporting article metafields (`custom.c_category`, `custom.c_minute_read`) ready to drive the meta row.

## What Changes

- **`sections/c-featured-article.liquid` + `assets/c-featured-article.css`** — new blog-template section rendering one article as the design's split hero: 4:3 image (zoom on hover) beside vertically centered meta / title / excerpt / "Read Article" arrow label, the whole card one link. A URL setting picks the article; blank falls back to the blog's most recent post.
- **`sections/c-blog-grid.liquid` + `assets/c-blog-grid.css`** — new paginated article-grid section (1 → 2 → 3 columns) with the same card language: 16:10 image with zoom hover, category • read-time meta, title, excerpt, date. Skips the featured article (same URL setting + skip toggle; blank = most recent post) and reuses the theme's `pagination-control`.
- **`templates/blog.journal.json`** — new alternate blog template composing `c-page-header` ("Journal" band, white with bottom border), `c-featured-article`, and `c-blog-grid`, with `main-blog` included disabled per the theme's composition convention.
- **No edits** to `main-blog`, `featured-blog`, or any shared snippet — the sections are self-contained and reuse `image`, `icon` (`clock`, `arrow-right`), `animation-attrs`, `lazy-stylesheet-attrs`, and `pagination-control` as-is.

## Capabilities

### New Capabilities
- `featured-article-section`: the blog hero section featuring one selectable article with metafield-driven meta and the theme's zoom/arrow hover language.
- `blog-grid-section`: the paginated article-card grid that skips the featured article and paginates the rest.
- `journal-blog-page`: the composed `blog.journal` template reproducing the design's Journal page from the header, featured, and grid sections.

### Modified Capabilities

(none — no existing spec's requirements change)

## Impact

- **New files**: `sections/c-featured-article.liquid`, `sections/c-blog-grid.liquid`, `assets/c-featured-article.css`, `assets/c-blog-grid.css`, `templates/blog.journal.json`.
- **Modified files**: none.
- **Content dependencies**: article metafields `custom.c_category` (single line text) and `custom.c_minute_read` (minutes number) drive the meta row; each hides independently when unset. Title, excerpt (with truncated-content fallback), image, and date come from the article itself.
- **Merchant setup**: assign the `blog.journal` template to the Journal blog. Leaving both sections' Featured article settings blank features/skips the most recent post automatically; pinning a specific post requires selecting the same post in both sections (Liquid sections cannot read each other's settings).
- **Behavior note**: Shopify pagination counts the skipped article, so the first page shows one fewer grid card than "Posts per page".
