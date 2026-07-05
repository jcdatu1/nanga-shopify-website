# Design — unify-product-card-variants

## Context

The design (`context/NANGAv1`) uses one card component across four contexts (two home carousels, the New Arrival grid page, the category grid page) with variations in image treatment, border, tag style, and which detail lines render. Investigation of the theme found:

- `snippets/product-card.liquid` supports `show_border`, `badge_position`, badge colors, and `image_fit`, but always renders the type line and value-prop line when data exists — no caller control. It has exactly two callers: `sections/featured-collection-carousel.liquid:58` and `sections/c-main-collection.liquid:127`.
- Neither section exposes `image_fit`. Both currently render `contain`; the design's category grid uses `object-cover` on `bg-gray-100`, and `.product-card__image` hardcodes `background: #fff` (`assets/main.css:11417`).
- Hover drift from the design (`ProductCarousel.tsx`, `ProductCategory.tsx`, `NewArrival.tsx` all use `group-hover:scale-105 duration-500` on the image and `group-hover:text-gray-600 transition-colors` on the title):
  - `.product-card:hover .product-card__title` uses `var(--text-color-secondary, #000000)` — the variable is **never defined** in `main.css`, so the title hover is a no-op (black on black).
  - Image zoom uses `transform 0.5s ease`; the design's Tailwind easing is `cubic-bezier(0.4, 0, 0.2, 1)`.
  - `.product-card__type` / `.product-card__value-props` use `rgb(75, 98, 116)` (blue-gray); the design uses `text-gray-600` = `#4b5563`.
  - `.fcc__nav-btn:hover` uses `#f1f1f1`; design `hover:bg-gray-100` = `#f3f4f6`. The button shadow also differs from `shadow-lg`.
  - `.fcc__view-all` animates gap 6px → 10px; design is `gap-2` → `gap-3` (8px → 12px).
- The design's New Arrival page is structurally the C Collection grid with filters/sort/count absent and bordered contain cards — no new section needed, only an alternate collection template.

`fix-featured-collection-card` (implemented, pending archive) already established the product-type line and the `contain` default; this change builds on that state.

## Goals / Non-Goals

**Goals:**
- Every card variant in the design reproducible purely from section settings — no code edits per instance.
- Keep the snippet's primitives orthogonal and backward-compatible (new params default to current behavior).
- Pixel-faithful hover behavior: title color shift, zoom easing, arrow hover, View-All gap.

**Non-Goals:**
- No new sections, JS, or dependencies; no changes to `assets/slider.js` or the `<filter-container>` engine.
- No swatches, quick-buy, or hover image-swap on the card.
- No whole-card anchor restructuring (see Decisions).
- No changes to `sections/featured-collection.liquid`, `product-block`, or other theme cards.

## Decisions

### One "Image style" select, not separate fit + background settings
The sections expose a single `select` — **"Product (contained, white)"** → `image_fit: 'contain'` and **"Lifestyle (cover, gray)"** → `image_fit: 'cover'` — because the design uses exactly these two treatments and coupling them keeps the editor simple. The snippet stays orthogonal: `cover` fit gets `background: #f3f4f6` via a `.product-card--fit-cover .product-card__image` rule (visible during lazy-load and for transparent images), so no new snippet param is needed for the background.
- *Alternative considered:* independent fit and background-color settings on each section. Rejected — four combinations, two of which the design never uses; more knobs, no benefit.

### Detail lines are section-controlled, defaulting on at the snippet
`show_type` and `show_value_props` default to `true` in the snippet so an un-parameterized render keeps today's behavior; each section passes its own checkbox values. This is required because the same product must show the category line in carousels but the spec line in the category grid — per-product metafields cannot express a per-context difference.
- *Alternative considered:* metafield-only control (status quo). Rejected — cannot vary by context.

### Design-faithful section defaults, accepting a live-page change
New settings default to the Figma values per context: carousel → category on / specs off; collection grid → **Lifestyle** image style, category off, specs on. Existing `c-main-collection` instances (e.g. `templates/collection.json`) will visibly change toward the design (cover-on-gray, spec line instead of category). This is deliberate — the design is the source of truth — and is called out in the proposal. If the client's catalog turns out to lack lifestyle imagery (white-background product shots would crop poorly under `cover`), the merchant flips one setting back to "Product"; the capability is unaffected.
- *Alternative considered:* behavior-preserving defaults (contain, category on, specs off) requiring the merchant to hand-set every instance. Rejected — the point of the change is design fidelity out of the box.

### Define hover colors explicitly; do not introduce a global variable
The title hover rule becomes `color: #4b5563` (with a 150ms `cubic-bezier(0.4, 0, 0.2, 1)` transition), scoped under `.product-card`. Defining `--text-color-secondary` globally is rejected — a new global variable to fix a card-scoped rule violates minimal-surface, and nothing else consumes it. The category/spec line resting color also becomes `#4b5563` (replacing the off-design `rgb(75, 98, 116)`).

### Match the design's motion spec exactly
- Image zoom: `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)`, `scale(1.05)` on `.product-card:hover` (whole-card trigger — equivalent to the design's `group-hover`).
- Title color: 150ms, same curve (Tailwind `transition-colors` default).
- Arrow hover: `background #f3f4f6`; shadow `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` (Tailwind `shadow-lg`).
- View-All: `gap: 8px` resting, `12px` on hover, existing 200ms transition.

### Keep separate image/title anchors (no whole-card link)
The design wraps the entire card in one `<Link>`; the snippet keeps its two anchors (image, title). The hover parity the user cares about is already achieved by scoping effects to `.product-card:hover`. A stretched-link overlay would hurt text selection and the established Shopify idiom for no visual gain.

### New Arrival page as a template preset, not a section
Add `templates/collection.new-arrival.json` using `c-main-collection` with: filters off, sort off, count off, border on, dark tags, Product image style, category on, specs off. The merchant assigns it to the New Arrival collection. Zero new code paths.

## Risks / Trade-offs

- [Live collection page changes appearance on deploy] → Intentional (see Decisions); flagged for client review. One setting reverts the image treatment if catalog imagery doesn't suit `cover`.
- [`cover` region-crops white product shots] → The Figma category grid assumes lifestyle photos. Surface to the client during review; the "Product" option is the escape hatch per instance.
- [Snippet contract growth] → Two boolean params with safe defaults; both callers are in-scope and the header comment documents them. No third callers exist (verified by grep).
- [Hardcoded design grays (`#4b5563`, `#f3f4f6`) drift from any future theme color scheme] → Accepted; these rules are already scoped to the bespoke NANGA card/carousel classes, which are design-pinned by intent.
- [Stacking on an unarchived change] → `fix-featured-collection-card` is implemented; archive it before or alongside this change so spec deltas apply cleanly.

## Migration Plan

Additive settings with snippet defaults preserving un-parameterized behavior. Section defaults change the live collection grid toward the design (called out above); rollback is reverting the section/snippet/CSS edits and deleting the new template. No data migration; metafields (`c_product_badge`, `c_card_value_prop`) are unchanged in shape.

## Open Questions

- Does the client's catalog have lifestyle imagery suitable for the category grid's cover treatment, or should the collection template default to "Product" style at launch? (Capability is identical either way; only the default in `templates/collection.json` moves.)
