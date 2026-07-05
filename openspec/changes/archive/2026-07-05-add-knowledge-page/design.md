# Design — add-knowledge-page

## Context

The design's Knowledge page (`context/NANGAv1/src/app/pages/Knowledge.tsx`) is four bands:

1. **Page header** — flat `bg-gray-50` band with `border-b border-gray-200`, page-width container: left H1 "KNOWLEDGE" + gray subtitle capped at `max-w-2xl`. The identical header appears on Journal (white, border only) and the category page (gray + border).
2. **Knowledge grid** — 3 columns of whole-card links: 4:3 `object-cover` image on `bg-gray-100` with `scale-105/500ms` hover, title with `→ gray-600` hover, small gray text, "Learn More →" arrow row with `gap-2 → gap-3` hover.
3. **Care & Maintenance** — `bg-gray-50` band, heading, 2 columns of white `p-6` cards with `hover:shadow-lg`, same title/text/arrow treatment, no image.
4. **FAQ** — `max-w-4xl` heading + four always-open Q/A items with `border-b` separators (last item borderless).

Investigation found no reusable fits: `faq-header` unconditionally loads `faq-header.js` and carries search/index chrome; `c-content-panel` band mode is reading-width with an `h2` heading and no border option; stock `multi-column` has per-column image/title/text/link but is shared (used by `index`) and can't take the Figma hover language; `collapsible-tabs` is an accordion, not the flat list. User decisions: flat FAQ list (design-faithful), general-purpose page header, one link-cards section with a style select.

## Goals / Non-Goals

**Goals:**
- Reproduce the Knowledge page as `page.knowledge.json` with all copy editable (Figma text as defaults).
- Three small reusable sections following house conventions: `c-` filenames, `"C ..."` schema names, block model with conventional setting IDs, per-section color pickers where the design needs tints, scoped CSS via `lazy-stylesheet-attrs`, zero JS.
- Hover parity with the already-pinned design language: title `#4b5563` @150ms, image zoom `1.05`/`0.5s cubic-bezier(0.4, 0, 0.2, 1)`, arrow gap 8px → 12px @200ms, `shadow-lg` elevation.

**Non-Goals:**
- No Knowledge subpages (`/knowledge/movement` etc.) — card links are URL pickers.
- No Journal template or collection-page header adoption in this change (the header section is built to serve them later).
- No changes to `collapsible-tabs`, `faq-header`, `multi-column`, or any existing file.

## Decisions

### `c-page-header` is a general flat-header primitive, not Knowledge-specific
Settings: `title` (+ `use_h1` defaulting true — it's a page header), `subtitle` (richtext, width-capped to the design's `max-w-2xl`), `background_color` picker (default the design's `#f9fafb`; transparent/white reproduces the Journal variant), `show_border` checkbox (bottom border `#e5e7eb`, default on). Page-width `container`. This covers all three design variants from settings alone.
- *Alternative considered:* bending `c-content-panel` (add `use_h1`, width mode, border). Rejected — three bends to make a panel act like a header, and the header identity ("what page am I on") deserves its own small section.

### One `c-link-cards` section with a `card_style` select
`image` style renders a 4:3 cover image well (`#f3f4f6` background, zoom on hover) above the text; `box` style renders the text inside a white padded card that gains `shadow-lg` on hover. Shared card anatomy (title, text, arrow label) is one markup path; the style only switches the chrome. Section settings: optional `title` heading, `columns_desktop` (default 3) / `columns_mobile`, `card_style`, `background_color` picker (default transparent; Care & Maintenance instance sets the gray). Card blocks: `image` (image style only), `title`, `text`, `link`, `link_label` (default "Learn More").
- *Alternative considered:* two sections. Rejected — the variants share the whole text stack and hover language; a select matches the established `image_style`/`tag_style` pattern.
- *Alternative considered:* reusing stock `multi-column`. Rejected — shared stock section; the Figma hovers and whole-card link can't be added without mutating it.

### Whole-card anchor for link cards
Unlike `product-card` (which keeps separate image/title anchors per Shopify commerce idiom), these are static navigation cards with a single destination and no nested interactive elements — one `<a>` wrapping the card is simpler and matches the design's `<Link className="group">`. Cards without a link render as a `<div>` (no dead anchors).

### `c-faq-list` is a flat list, deliberately distinct from `collapsible-tabs`
Blocks: `item` (`title` text + `answer` richtext), rendered always-open with a `#e5e7eb` bottom border between items (none after the last). Section settings: `title` heading, reading-width container (matches `max-w-4xl`). No JS, no `<details>` — the design shows static content, and using `collapsible-tabs` would misrepresent the interaction. `page.faq.json` keeps the accordion; the two coexist for different jobs.

### Template composition mirrors `page.technology.json`
`page.knowledge.json`: disabled `main-page`, then `c-page-header` → `c-link-cards` (image ×3) → `c-link-cards` (box ×2, heading, gray) → `c-faq-list` (4 items). All copy hardcoded from the Figma; grid images left unset (placeholder wells) for the merchant; card links default to `/pages/...` guesses the merchant repoints.

### CSS approach
Three small scoped stylesheets (`assets/c-page-header.css`, `assets/c-link-cards.css`, `assets/c-faq-list.css`) with `.cph` / `.clk` / `.cfl` prefixes, loaded lazily — same pattern as the Technology sections. Design-pinned grays used directly (`#f9fafb`, `#f3f4f6`, `#4b5563`, `#e5e7eb`), consistent with prior changes. Image cards use the `image` snippet/`image_url` with `srcset` + lazy loading.

## Risks / Trade-offs

- [Three new sections for one page] → Each is small, and two are demonstrably multi-page patterns (header: 3 design pages; link cards: Knowledge ×2 bands). The FAQ list is the only single-use piece today; it's ~50 lines.
- [Hardcoded design grays drift from future reskins] → Same accepted trade-off as prior changes; every color is a merchant-editable picker or scoped rule.
- [Whole-card link limits future in-card interactivity] → Acceptable: these are navigation tiles by definition; product cards remain the separate-anchor pattern.
- [Default card links point at pages that may not exist yet] → Placeholder URLs; flagged in verification for the merchant to repoint.

## Open Questions

- None blocking. Grid imagery supplied by the merchant (Figma uses Unsplash placeholders).
