# unify-product-card-variants

## Why

The NANGA design renders the same product card in four contexts with per-context variations that the current sections cannot produce from settings:

| Instance (design) | Image | Border | Tag | Category line | Spec line |
|---|---|---|---|---|---|
| Home › New Arrival carousel | contain, white, padded | no | dark | shown | hidden |
| Home › Featured collection carousel | contain, white, padded | no | light | shown | hidden |
| New Arrival page grid | contain, white, padded | yes | dark | shown | hidden |
| Category page grid (`ProductCategory.tsx`) | cover, gray tint | no | light | hidden | shown |

The card's category (`product.type`) and spec (`c_card_value_prop` metafield) lines currently render whenever data is present — but the same product must show the category line in a carousel and the spec line in the category grid, so per-product metafields alone cannot express the variation; the **section** must control which lines render. `image_fit` exists on the snippet but is exposed by neither section, and the cover treatment's gray image background does not exist (`.product-card__image` hardcodes white).

Separately, several hover/interaction details drift from the design — most notably the card title's hover color is a **no-op** because it references `--text-color-secondary`, which is never defined in `assets/main.css` (falls back to `#000000`, the resting color).

## What Changes

- **`snippets/product-card.liquid`** — add two optional display params, defaulting to current behavior: `show_type` (default `true`) and `show_value_props` (default `true`). Cover fit gains a light-gray image background (design `bg-gray-100`).
- **`sections/featured-collection-carousel.liquid`** ("C Featured collection") — under the "Cards" header, add: **Image style** select (Product — contained on white / Lifestyle — cover on gray), **Show category line** checkbox (default on), **Show spec line** checkbox (default off, per design); thread all three into the `product-card` render call.
- **`sections/c-main-collection.liquid`** ("C Collection grid") — mirror the same three settings with design-faithful defaults for the category page (Lifestyle image style, category line off, spec line on); thread into the render call. **Note:** defaults intentionally match the Figma category grid, which changes the live collection page's current rendering (contain → cover on gray; category line hidden; spec line shown).
- **Hover/interaction fidelity** (scoped to `.product-card*` / `.fcc*` rules in `assets/main.css` and `assets/featured-collection-carousel.css`):
  - Title hover color: explicit design gray (`#4b5563`, Tailwind gray-600) instead of the undefined `--text-color-secondary`; 150ms color transition.
  - Image zoom easing: `cubic-bezier(0.4, 0, 0.2, 1)` (design's Tailwind ease) instead of `ease`.
  - Category/spec line color: `#4b5563` instead of the current off-design `rgb(75, 98, 116)`.
  - Carousel arrow hover background: `#f3f4f6` (gray-100) instead of `#f1f1f1`; shadow matched to the design's `shadow-lg`.
  - "View All" link gap animation: 8px → 12px on hover (design `gap-2` → `gap-3`) instead of 6px → 10px.
- **`templates/collection.new-arrival.json`** — new alternate collection template preset: C Collection grid with filters/sort/count off, border on, dark tags, Product image style, category line on, spec line off — reproducing the design's New Arrival page with zero new sections.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `product-card`: section-controllable category and spec lines; gray background for cover fit; hover title color and easing per design.
- `featured-collection-carousel`: exposes image style and detail-line settings; arrow/View-All hover fidelity.
- `collection-product-grid`: exposes the same card settings (image style, category line, spec line); its "snippet SHALL NOT be modified" constraint is relaxed to "rendered through its parameter contract".

## Impact

- **Code:**
  - `snippets/product-card.liquid` — two new optional params + header-comment update.
  - `sections/featured-collection-carousel.liquid`, `sections/c-main-collection.liquid` — three schema settings each + render-call wiring.
  - `assets/main.css` — card-scoped color/easing/background rules only.
  - `assets/featured-collection-carousel.css` — nav hover/shadow, View-All gaps.
  - `templates/collection.new-arrival.json` — new template (additive).
- **Shared behavior:** no JS changes; `product-card` has exactly two callers (both sections in scope). Snippet defaults (`true`/`true`) preserve behavior for any render call that doesn't pass the new params.
- **Sequencing:** builds on `fix-featured-collection-card` (implemented, pending archive) — the deltas here assume its post-fix state (product-type line, `contain` default).
- **Dependencies:** none added.
