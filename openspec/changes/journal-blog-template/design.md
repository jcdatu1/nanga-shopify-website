# journal-blog-template — Design

## Context

The design's Journal page (`context/NANGAv1/src/app/pages/Journal.tsx`) is a blog listing in three bands: a bordered page-title band, a large split featured-article hero, and a `sm:2 / lg:3`-column article grid whose cards carry category + read-time meta, title, excerpt, and date, with a 1.05 image zoom on hover. The theme already has the reusable `c-page-header` for the title band and an established `c-` section pattern (self-contained Liquid + scoped CSS file, no JS, shared `image`/`icon`/`animation-attrs`/`lazy-stylesheet-attrs` snippets). The stock `main-blog` list doesn't match and shouldn't be mutated. The merchant maintains article metafields `custom.c_category` (single line text) and `custom.c_minute_read` (minutes) for the meta row.

## Goals / Non-Goals

**Goals:**
- Reproduce the Journal page as an alternate blog template composed from sections, per the theme's page-composition convention.
- Featured article selectable by the merchant, defaulting to the most recent post; the grid skips it automatically in the default configuration.
- The theme's existing card hover language (image zoom, title tint, widening arrow gap) on both hero and grid cards.
- Lean output: responsive images through the `image` snippet, lazy grid images, eager/high-priority hero image, scoped CSS, zero new JS.

**Non-Goals:**
- No changes to `main-blog`, `featured-blog`, the article page (`main-article`), or any shared snippet/CSS.
- No tag filtering, RSS/social icons, or author display (not in the design).
- No cross-blog reuse concerns beyond what blog-template restriction gives for free.

## Decisions

- **Two sections, not one.** The featured hero (`c-featured-article`) and the grid (`c-blog-grid`) are separate sections so each can be reordered, omitted, or reused independently in the theme editor — and it matches the design's two distinct bands.

- **Featured selection via a `url` setting resolved through the global `articles` object.** Shopify has no article picker setting; the URL picker does offer blog posts. The section parses `blog-handle/article-handle` from the `/blogs/...` URL (splitting off `?`/`#`) and resolves it as `articles[key]` — O(1), no loop over `blog.articles`. Alternative considered: a text setting for the handle (worse UX, same lookup).

- **Blank setting = most recent post, in both sections.** Liquid sections cannot read each other's settings, so "the grid automatically skips the featured article" is achieved by both sections independently resolving the same default (`blog.articles.first`). Pinning a specific post requires setting the same URL in both sections (documented in each setting's info text). A `skip_featured` checkbox (default on) lets a grid run standalone. Alternatives considered: a shared snippet computing the featured post from an article tag (couples content to layout), or one combined section (rejected — see above).

- **Resolve the skip target before `{% paginate %}`, match by ID inside it.** Inside a `paginate` block, `blog.articles` is the current page's slice, so `blog.articles.first` on page 2 would be wrong; resolving before the tag gives the blog's true latest post. Skipping compares `article.id == featured_article.id` in the loop, so a pinned post is skipped on whatever page it falls. Trade-off: Shopify's paginator still counts the skipped article, so page 1 renders one fewer card (accepted; matches how the design reads).

- **Metafields accessed as `article.metafields.custom.*`, hidden when blank.** Each meta part renders independently; the bullet separator only renders when both exist; no computed read-time fallback (keeps Liquid lean, merchant controls the value).

- **Template as `blog.journal.json`, stock `blog.json` untouched.** An alternate template the merchant assigns to the Journal blog is the minimally invasive path and leaves other blogs on the stock list. `main-blog` is included disabled, mirroring `page.knowledge.json` / `page.about.json`.

- **Card CSS duplicated per section rather than shared.** The meta-row/zoom rules repeat (~20 lines) between `c-featured-article.css` and `c-blog-grid.css`. The `c-` pattern is one self-contained stylesheet per section; a shared "article card" stylesheet would create exactly the cross-section coupling the codebase guidelines warn about, for trivial savings.

## Risks / Trade-offs

- [Merchant pins a featured post in one section but not the other] → The grid would show the hero's post (or skip the wrong one). Mitigated by matching info text on both settings and the blank-default behavior covering the common case.
- [Metafield namespace differs from `custom`] → Meta rows silently hide. Confirm the definitions live in the default `custom` namespace; adjust the two lookups if not.
- [Localized store URLs could prefix the `/blogs/` path] → The parse splits on `/blogs/` rather than assuming a leading position, which tolerates locale prefixes.
- [First grid page shows `posts_per_page − 1` cards] → Inherent to skipping inside Shopify pagination; noted in the proposal, tunable via the setting.

## Migration Plan

Purely additive: five new files, no existing file modified. Deploy with the theme; assign the `blog.journal` template to the Journal blog in the theme editor. Rollback = unassign the template (or delete the files).

## Open Questions

- Confirm the metafield definitions' namespace is `custom` (`custom.c_category`, `custom.c_minute_read`).
