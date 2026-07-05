# Design — fix-collection-page-ui

## Context

- **Dropdown overlap**: the theme's global `link-dropdown` places its chevron absolutely (`.link-dropdown__button-icon { position: absolute; right: 0; margin-inline-end: 8px }`) and reserves room via `padding-inline-end: 40px` on the button (`assets/main.css:6948`). Our Figma-styling override `.cmc__sort .link-dropdown__button { padding: 8px 16px }` (`assets/c-main-collection.css:83`) collapses that end padding to 16px, so longer selected labels ("Most Relevant") render under the chevron. The `gap: 8px` in the same rule is a no-op (the icon is out of flex flow).
- **Pagination**: `c-main-collection.liquid:134` renders `pagination-control` in a standalone `.cmc__pagination[data-ajax-container]` *after* `</filter-container>`, so it sits below the whole two-column layout — beneath the sidebar's full height. The AJAX engine (`assets/main.js:1457-1533`) collects `[data-ajax-container]` elements within the `.shopify-section` and index-matches them against the fetched document, replacing `innerHTML` in document order. Consequence: containers must correspond 1:1 and MUST NOT nest — a container inside another would be detached when the outer is replaced first, and its own refresh would write to a dead node.
- **Collection header**: the design's category header (`ProductCategory.tsx:114-118`) is exactly the shipped `c-page-header` visual (gray band, bottom border, H1, reading-width gray subtitle); New Arrival (`NewArrival.tsx:78-81`) is the same anatomy with no tint and no border. `c-page-header` currently renders only static settings; collection pages need `collection.title`/`collection.description`. The live collection template renders no title at all.

## Goals / Non-Goals

**Goals:**
- Sort label never overlaps the chevron, at any label length.
- Pagination directly below the product grid, inside the product column, still AJAX-refreshed and back/forward-safe.
- Collection pages show the design's title/description header, dynamic per collection, with per-template background/border control; default collection template shows the gray variant out of the box.

**Non-Goals:**
- No changes to global `link-dropdown` CSS, `pagination-control`, the `<filter-container>` engine, or `main.js`.
- No new sections; no changes to `c-page-header`'s existing static behavior or its Knowledge instance.

## Decisions

### Fix the padding in our override, not the global rule
Add `padding-inline-end: 40px` back within `.cmc__sort .link-dropdown__button` (and drop the no-op `gap`). Restyling the global icon to static flex positioning was rejected — `link-dropdown` is shared (sort on stock sections, elsewhere) and the absolute-icon design is load-bearing for its animation.

### Relocate pagination markup inside the grid's AJAX container
Move the `{% render 'pagination-control', paginate: paginate %}` wrapper (keeping the `.cmc__pagination` class for spacing, minus the `data-ajax-container` attribute) to the end of `.filters-adjacent[data-ajax-container]`, after the grid/empty-state. Both the live DOM and the `section_id` fetch render the same structure, so the container count (sidebar `filters__inner`, `filters-adjacent`) stays index-consistent and pagination refreshes as part of the product column.
- *Alternative considered:* keeping it a sibling container but moving it visually with CSS (grid/order tricks). Rejected — fragile layout coupling; the markup move is the honest structure.

### Contextual fallback in `c-page-header`, not a new section
In the section's Liquid: `title` blank → `collection.title | default: page.title`; subtitle blank and `collection` present → `collection.description`. Purely additive — every existing instance sets a non-blank title (schema default "Page title" plus the Knowledge template), so nothing changes for static uses. This keeps one header primitive across static pages and collections.
- *Alternative considered:* dedicated `c-collection-header` section. Rejected — duplicate markup/CSS for a two-line data difference.

### Template instances carry the per-collection variants
`collection.json`: header instance with `"title": ""` (dynamic), `background_color: "#f9fafb"`, `show_border: true`, ordered before the grid — the design's category header, always on for the default template. `collection.new-arrival.json`: same but `background_color: "rgba(0,0,0,0)"`, `show_border: false` — the design's plain New Arrival header. Merchants flip the picker/toggle per template ("gray on some, none on others").

## Risks / Trade-offs

- [Index-matched AJAX containers are order-sensitive] → The relocation keeps container order identical in live and fetched markup; verified against `main.js`'s replacement loop. Manual QA re-checks filter/sort/paginate flows.
- [`collection.description` may contain rich HTML] → Rendered inside the existing `.cph__subtitle rte` wrapper, which is built for richtext.
- [Collections without descriptions] → Fallback yields a blank subtitle; the section already renders cleanly with no subtitle.
- [`data-ajax-scroll-to` scroll anchor behavior] → Lives on the `<filter-container>` element, untouched by the pagination move.

## Open Questions

- None blocking.
