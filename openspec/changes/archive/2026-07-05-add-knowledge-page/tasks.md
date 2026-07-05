## 1. C Page header section

- [x] 1.1 Create `sections/c-page-header.liquid`: `.cph`-scoped band with `title` (+ `use_h1`, default true), richtext `subtitle` capped at reading width, `background_color` picker (default `#f9fafb`), `show_border` bottom-border toggle (default on); page-width container; schema + preset ("C Page header").
- [x] 1.2 Create `assets/c-page-header.css` (lazy-loaded): band padding per design (`py-12`/`py-16`), subtitle width cap and `#4b5563` color, `#e5e7eb` bottom border; all rules scoped under `.cph`.

## 2. C Link cards section

- [x] 2.1 Create `sections/c-link-cards.liquid`: `.clk`-scoped grid of card blocks (image, title, text, link, link_label) with whole-card anchor when linked (div otherwise); `card_style` select (image / box); image style renders a 4:3 cover well via responsive `image_url` + `srcset` + lazy loading; arrow label uses `{% render 'icon', icon: 'arrow-right' %}`.
- [x] 2.2 Add schema: name "C Link cards", settings for optional heading, `columns_desktop` (default 3), `columns_mobile` (default 1), `card_style`, `background_color` (default transparent); preset with three image cards.
- [x] 2.3 Create `assets/c-link-cards.css`: responsive grid, 4:3 `#f3f4f6` image well with 1.05/0.5s `cubic-bezier(0.4, 0, 0.2, 1)` zoom, box style white padding + `shadow-lg` hover, title → `#4b5563` @150ms, arrow gap 8px → 12px @200ms; scoped under `.clk`.

## 3. C FAQ list section

- [x] 3.1 Create `sections/c-faq-list.liquid`: `.cfl`-scoped reading-width list with `title` setting and `item` blocks (question text + richtext answer), always open, no JS; schema + preset with the design's four Q/A items.
- [x] 3.2 Create `assets/c-faq-list.css`: item spacing, `#e5e7eb` border between items (none after last), question sizing, `#4b5563` answer color; scoped under `.cfl`.

## 4. Knowledge page template

- [x] 4.1 Create `templates/page.knowledge.json`: disabled `main-page`, `c-page-header` ("KNOWLEDGE" + subtitle, gray, border), `c-link-cards` (image style, 3 design cards), `c-link-cards` (box style, "Care & Maintenance", gray band, 2 cards), `c-faq-list` (4 design questions). All Figma copy as defaults; card links as placeholder URLs.
- [x] 4.2 Validate the template JSON parses and every referenced section type, block type, and setting ID exists in its schema.

## 5. Verify against the design

- [ ] 5.1 Theme editor: assign `page.knowledge` to a test page; confirm the four bands render in order with design copy; per-section settings edit only their own band.
- [ ] 5.2 Compare against `Knowledge.tsx`: gray bordered header, 3-col image cards with zoom/title/arrow hovers, gray band with box cards and shadow hover, flat bordered FAQ list at reading width.
- [x] 5.3 Confirm no regressions: `collapsible-tabs` / `faq-header` / `multi-column` and all existing templates untouched; no new JS loaded on the page.
