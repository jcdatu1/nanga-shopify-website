## Context

The theme already has a global product card, `snippets/product-block.liquid`, rendered by 6+ live sections (product-list, featured-collection, shop-the-look, mini-related-products, predictive-search, main-collection). It bundles hover image-swap, swatches, quick-buy, and reviews, and delegates badges to `snippets/product-label.liquid` and price to `snippets/price.liquid`.

The NANGA design (`context/NANGAv1/`) calls for a much leaner card. Two design variants exist:
- Bordered (`pages/NewArrival.tsx`): `bg-white p-4 border border-gray-200`, image `object-contain`, badge `bg-black text-white`, with a vendor/category line above the title.
- Borderless (`pages/ProductCategory.tsx`): `bg-gray-100`, image `object-cover`, badge `bg-white text-black`, with a dot-separated value-prop line (`Fill Power • Weight`) between title and price.

Both variants use the same hover behavior: `group-hover:scale-105 transition-transform duration-500` on the image. The merchant maintains two product metafields: `custom.c_product_badge` (single-line text — the badge label) and `custom.c_card_value_prop` (list of single-line text — the value props).

CLAUDE.md mandates minimally invasive changes, strong reuse, and no new JS/CSS frameworks.

## Goals / Non-Goals

**Goals:**
- Provide a lean, design-faithful card as a new snippet that sections opt into.
- Make the design's variation axes configurable by the caller: border, badge position, badge colors, vendor, image fit.
- Drive badge and value-prop content from the existing product metafields.
- Reuse `snippets/price.liquid` for compare-at pricing; present original-slashed-then-discounted-red via CSS only.
- Zero regression risk to existing sections.

**Non-Goals:**
- Modifying `product-block.liquid`, `product-label.liquid`, or `price.liquid`.
- Swatches, quick-buy, hover image-swap, or reviews in the new card.
- Wiring the new card into specific sections (a follow-up; this change delivers the snippet + CSS).
- Adding a metaobject or per-product color metafields — colors are passed in by the caller.

## Decisions

### Decision: New snippet instead of extending `product-block.liquid`
Build `snippets/product-card.liquid` fresh rather than reshaping the global card.
- **Why:** `product-block.liquid` is rendered by many live sections; adding design-specific branching there risks regressions and bloats a hot path. A separate lean snippet keeps the existing card untouched and the new one simple.
- **Alternative considered:** Extending `product-block.liquid` behind params. Rejected — higher regression surface, and the design card shares little markup (no swatches/quick-buy/hover-swap), so reuse would be shallow.

### Decision: Caller-supplied parameters for all variation axes
Parameters: `product` (required), `show_border`, `badge_position` (`overlay` | `inside`), `badge_bg`, `badge_text`, `show_vendor`, `image_fit` (`contain` | `cover`).
- **Why:** The design's two variants differ exactly along these axes. Passing them in keeps the snippet stateless and reusable across sections without reading section settings internally. Sections own the settings and forward them.
- **Defaults:** `badge_position` → `overlay`; `show_border`/`show_vendor` → falsy; `image_fit` → derive from `show_border` (bordered→`contain`, borderless→`cover`) unless explicitly passed, to reduce required params.

### Decision: Badge colors via inline CSS custom properties
Apply `badge_bg`/`badge_text` as inline `style="--pc-badge-bg: …; --pc-badge-text: …"` on the badge element; the `.product-card__badge` CSS consumes the variables with theme-consistent fallbacks.
- **Why:** Keeps color values out of the stylesheet, supports per-render colors, and avoids inline `background`/`color` that are harder to override. Matches the theme's existing CSS-variable approach (e.g. `--product-label-overlay-*`).

### Decision: Single badge from `custom.c_product_badge`, replacing auto labels
The card renders only the metafield badge and does not call `product-label.liquid`.
- **Why:** The design shows one clean badge. Reusing `product-label.liquid` would reintroduce the auto New/Sale/stock stack the design omits.

### Decision: Reuse `price.liquid`, reorder/recolor via a wrapper class
Render `{% render 'price', product: product, current_variant: cheapest_variant %}` inside `.product-card__price`. `price.liquid` emits `.price__current` (sale) then `.price__was` (compare-at); the wrapper uses CSS to place `.price__was` first (strikethrough) and color `.price--on-sale .price__current` red.
- **Why:** The price snippet already computes compare-at logic correctly. A CSS-only reorder avoids duplicating money/variant logic and respects the reuse rule.
- **Alternative considered:** Inline price markup. Rejected — duplicates existing, working logic.

### Decision: Hover zoom via CSS, image via existing `image.liquid`
Use `snippets/image.liquid` (responsive `image_url`/srcset/sizes/lazy) for the image and add `.product-card__image img { transition: transform … } .product-card:hover img { transform: scale(1.05) }` with `overflow: hidden` on the container.
- **Why:** Matches the design's `scale-105` and honors the perf rules (responsive images, lazy loading, no JS).

## Risks / Trade-offs

- **Two cards to maintain (`product-block` + `product-card`) → drift over time.** Mitigation: scope `product-card` to the design's lean use cases only; document its parameter contract in the snippet header.
- **`price.liquid` markup/class changes could break the wrapper reorder.** Mitigation: rely only on stable public classes (`.price__current`, `.price__was`, `.price--on-sale`) already used elsewhere; keep the wrapper CSS small and commented.
- **`badge_position: 'inside'` spacing interaction with the border is fiddly.** Mitigation: keep the badge in normal flow at the top of the image area for `inside`, with padding so it stays within the border; verify both border on/off visually.
- **Metafield shape assumptions (`c_card_value_prop` is a list).** Mitigation: guard with `where`/`compact`/size checks and `join: ' • '`; render nothing when blank.

## Migration Plan

Additive only. Ship the snippet and the scoped `.product-card*` CSS block (appended to an existing stylesheet such as `assets/main.css`). No existing output changes until a section renders the new snippet. Rollback = remove the snippet file and the CSS block.

## Open Questions

- Which stylesheet should host the `.product-card*` CSS — `assets/main.css` (global) or a section-scoped sheet? Default to `assets/main.css` unless a section-specific sheet is preferred.
- Should `image_fit` always derive from `show_border`, or remain an independent override? Current plan: derive by default, allow explicit override.
