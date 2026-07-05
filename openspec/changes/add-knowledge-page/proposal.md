# add-knowledge-page

## Why

The NANGA design includes a Knowledge page (`context/NANGAv1/src/app/pages/Knowledge.tsx`) with no theme counterpart. Its four bands need three small new sections — a flat page header (a pattern the design repeats on Journal and the category page), a link-card grid (two skins: image-topped and boxed), and a flat FAQ list — none of which existing sections can render without restyling shared stock code. Built as a section-composed template (like `page.technology.json`), each piece stays reusable for the Journal and collection pages that share these patterns.

## What Changes

- **`sections/c-page-header.liquid`** ("C Page header") — new section: flat page header with H1 title, subtitle (width-capped per the design), optional tinted background color, and optional bottom border. The design uses this header on Knowledge (gray + border), Journal (white + border), and the category page (gray + border).
- **`sections/c-link-cards.liquid`** ("C Link cards") — new section: responsive grid of whole-card links with a `card_style` select: **Image** (4:3 cover image on gray, zoom hover) or **Box** (white padded card, `shadow-lg` hover). Each card: title (→ `#4b5563` hover), short text, and an arrow label with the established 8px → 12px gap hover. Optional section heading and background color so one section covers both the Knowledge grid (image, white bg, no heading) and Care & Maintenance (box, gray band, heading).
- **`sections/c-faq-list.liquid`** ("C FAQ list") — new section: heading plus always-open Q/A item blocks separated by bottom borders, constrained to reading width — the design's flat FAQ presentation (deliberately not the stock `collapsible-tabs` accordion, which stays untouched for `page.faq`).
- **`templates/page.knowledge.json`** — new page template composing: `c-page-header` ("KNOWLEDGE"), `c-link-cards` (image style, 3 cards: Movement / Philosophy / Technology), `c-link-cards` (box style, "Care & Maintenance", 2 cards), `c-faq-list` (4 design questions). All Figma copy hardcoded as editable defaults; `main-page` included disabled per convention.
- **No edits** to any existing section, snippet, or template.

## Capabilities

### New Capabilities
- `page-header-section`: reusable flat page header (title, subtitle, optional tint and bottom border).
- `link-cards-section`: reusable grid of whole-card links with image and box styles and the theme's established hover language.
- `faq-list-section`: flat, always-open FAQ list with border-separated Q/A blocks.
- `knowledge-page`: the composed Knowledge page template.

### Modified Capabilities
<!-- None: all additions; no existing spec's requirements change. -->

## Impact

- **New files**: three `sections/c-*.liquid`, three scoped `assets/c-*.css`, `templates/page.knowledge.json`.
- **Modified files**: none.
- **Shared behavior**: no JS anywhere; `collapsible-tabs`, `faq-header`, `multi-column` intentionally untouched. Hover treatments reuse the values already pinned in `product-card`/`c-content-panel` work (`#4b5563`, zoom `1.05`/`0.5s` design easing, arrow gap 8px → 12px).
- **Merchant setup**: create a "Knowledge" page, assign `page.knowledge`, upload the three grid images, and point card links at the destination pages (`/knowledge/...` subpages are out of scope).
- **Dependencies**: none added; no sequencing constraints (all referenced sections are new or already archived).
