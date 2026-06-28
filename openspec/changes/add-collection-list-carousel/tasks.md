## 1. Scaffold the section file

- [ ] 1.1 Create `sections/collection-list-carousel.liquid` by mirroring the structure of `sections/featured-collection-carousel.liquid` (comment header, `lazy-stylesheet-attrs` stylesheet link, scoped root wrapper, `container` / `container--no-max` for full-width), swapping the `fcc` class prefix for `clc`.
- [ ] 1.2 Link the new stylesheet `assets/collection-list-carousel.css` via the same `<link rel="stylesheet" ... {%- render 'lazy-stylesheet-attrs' %}>` pattern.

## 2. Heading and View All

- [ ] 2.1 Render the `clc__header` with left-aligned `clc__title` (heading) and optional `clc__subtitle` (description), matching `.fcc` markup and `animation-attrs`.
- [ ] 2.2 Add the optional desktop "View All" link (right of heading) and mobile "View All" link (below carousel), gated by `show_view_all` (default off) and a URL/link setting.

## 3. Carousel scaffold and blocks loop

- [ ] 3.1 Add the `<carousel-slider class="carousel block clc__carousel">` → `.slider slider--edge-peek slider--mobile-container-pad slider--no-scrollbar` → `.product-grid product-grid--per-row-{{ cards_desktop }} product-grid--per-row-mob-{{ cards_mobile }} slider__grid product-grid--carousel clc__grid` scaffold, reusing the native engine.
- [ ] 3.2 Loop `section.blocks`, rendering one `.slider__item` per `collection` block with `{{ block.shopify_attributes }}`.
- [ ] 3.3 For each block, resolve: link = `block.settings.collection.url`; image = `block.settings.image` else `collection.featured_image`; label = `block.settings.label` else `collection.title`.
- [ ] 3.4 Render the tile as `clc__card` → `clc__media` (circular well) with a responsive image (`image_url` + `width`/`srcset`/`sizes`, `loading="lazy"` for tiles past the first visible row) and a graceful empty state when no image resolves, plus `clc__label` beneath.
- [ ] 3.5 Add the no-blocks placeholder branch so the section is previewable in the theme editor when empty.

## 4. Navigation arrows

- [ ] 4.1 Add the `slider-nav clc__nav js-only` prev/next buttons reusing `icon-chevron-left` / `icon-chevron-right` snippets, `aria-controls`, and visually-hidden labels — copied from `.fcc` with the prefix swap.
- [ ] 4.2 Confirm arrows/scroll rely on the native `[inactive]` behavior so they auto-hide when block count ≤ per-row value.

## 5. Scoped stylesheet

- [ ] 5.1 Create `assets/collection-list-carousel.css` scoped under `.clc`, reusing the `.fcc` header/subtitle/view-all/nav rules (renamed to `clc`), including the floating circular arrow styling and the mobile/desktop view-all swap.
- [ ] 5.2 Add `clc__media` circular well rules: `aspect-ratio: 1 / 1`, `border-radius: 50%`, neutral gray background, `overflow: hidden`, contained/centered image with internal padding; and `clc__label` centered with `text-transform: uppercase`.
- [ ] 5.3 Set the `clc__grid` `--gutter` (and any nav `--*-top`) values appropriate to circular tiles, mirroring `.fcc` responsive breakpoints.

## 6. Schema and preset

- [ ] 6.1 Add the `{% schema %}` with section settings: `title` (default "CATEGORY"), `description`, `cards_desktop` (range 2–6, default 6), `cards_mobile` (range 1–4, default 2), `full_width`, `show_view_all` (default false) + View All URL, `color_scheme`; and `disabled_on` matching `.fcc`.
- [ ] 6.2 Define the `collection` block type with `collection`, optional `image`, and optional `label` settings; set `max_blocks` (~12).
- [ ] 6.3 Add a `presets` entry (category "Collections") with one or more default blocks so it appears in the section picker.

## 7. Home page wiring

- [ ] 7.1 Add one `collection-list-carousel` section instance to `templates/index.json` after `split_content_craftsmanship`, with curated collection blocks and `title: "CATEGORY"`, and append its id to the `order` array.

## 8. Verification

- [ ] 8.1 Verify in the theme editor: section adds via preset, blocks add/reorder/remove, and settings (heading, description, per-row, full-width, View All, color scheme) drive output.
- [ ] 8.2 Verify carousel behavior: tiles fit → static row, no arrows; more tiles than per-row → scroll, peek, and arrows on both desktop and mobile; defaults from collection and image/label overrides both render correctly.
- [ ] 8.3 Confirm no shared files changed: `sections/collection-list.liquid`, `sections/featured-collection-carousel.liquid`, `snippets/product-card.liquid`, and shared CSS/JS remain untouched; no new dependencies added.
