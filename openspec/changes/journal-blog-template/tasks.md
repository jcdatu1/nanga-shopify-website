## 1. Featured article section

- [x] 1.1 Create `sections/c-featured-article.liquid`: blog-template-only schema (`enabled_on: blog`), URL-type Featured article setting with latest-post fallback resolved via the global `articles` object, split hero markup (4:3 eager/high-priority image via the `image` snippet, meta row from `custom.c_category` / `custom.c_minute_read` with independent hiding, title, excerpt with truncated-content fallback, "Read Article" arrow label), whole card one link, nothing rendered when no article resolves
- [x] 1.2 Create `assets/c-featured-article.css` scoped to `.cfa`: responsive split grid, image zoom (scale 1.05 / 500ms theme easing), title tint and 8px → 12px arrow-gap hover, design typography/spacing

## 2. Blog grid section

- [x] 2.1 Create `sections/c-blog-grid.liquid`: blog-template-only schema with Posts per page range, Skip the featured article checkbox, and matching Featured article URL setting; featured resolution before `{% paginate %}` with skip-by-ID inside the loop; card markup (lazy 16:10 image with placeholder fallback, meta row, title, excerpt fallback, localized date); `pagination-control` reuse and localized empty-blog message
- [x] 2.2 Create `assets/c-blog-grid.css` scoped to `.cbg`: 1/2/3-column responsive grid, card zoom + title-tint hover matching the hero, meta/title/excerpt/date typography, pagination spacing

## 3. Journal blog template

- [x] 3.1 Create `templates/blog.journal.json` composing `c-page-header` ("Journal" H1, "Stories, guides, and insights from the field" subtitle, white band with border), `c-featured-article` (blank selection, "Read Article" label), and `c-blog-grid` (9 posts per page, skip enabled), with `main-blog` included disabled

## 4. Verification

- [ ] 4.1 Review rendered output against `context/NANGAv1/src/app/pages/Journal.tsx` (band order, card anatomy, hover behavior) and confirm the default configuration features the latest post in the hero and omits it from the grid, including on page 2+
