## Why

The NANGA design (Figma→React export in `context/NANGAv1/`) introduces a clean, minimal product card used across New Arrivals, Product Category, and carousels. The theme's existing global card (`snippets/product-block.liquid`) is feature-heavy (hover image-swap, swatches, quick-buy, reviews) and is rendered by 6+ live sections, so reshaping it to match the design would risk regressions everywhere. We need a lean, design-faithful card that sections can opt into, driven by the product metafields the merchant already maintains.

## What Changes

- Add a new, standalone snippet `snippets/product-card.liquid` that renders a lean card matching the design: image (with hover scale-zoom), single badge, optional vendor/category, title, dot-separated value props, and price. No swatches, quick-buy, or hover image-swap.
- Card accepts caller-supplied parameters to toggle/configure: `show_border`, `badge_position` (`overlay` | `inside`), `badge_bg`, `badge_text`, `show_vendor`, `image_fit` (`contain` | `cover`).
- Badge content comes from product metafield `custom.c_product_badge` (single clean badge that replaces, not coexists with, the auto New/Sale/stock labels). Badge colors are applied from the passed-in `badge_bg`/`badge_text`.
- Render additional value props from product metafield `custom.c_card_value_prop` (list, single-line text) joined by ` • `, placed between title and price.
- Compare-at pricing reuses the existing `snippets/price.liquid`, wrapped in a card modifier class so the original price shows slashed first and the discounted price renders in the sale (red) treatment.
- Add a scoped CSS block for `.product-card*` to existing theme assets (no new files, no new dependencies).
- `snippets/product-block.liquid`, `snippets/product-label.liquid`, and `snippets/price.liquid` remain unchanged.

## Capabilities

### New Capabilities
- `product-card`: A reusable, lean product card snippet driven by section parameters and product metafields, covering border toggle, badge (content/position/colors), vendor, value props, hover zoom, and compare-at price presentation.

### Modified Capabilities
<!-- None. The existing product-block, product-label, and price snippets are not changed. -->

## Impact

- New file: `snippets/product-card.liquid`.
- Modified asset: scoped `.product-card*` CSS block appended to an existing stylesheet (e.g. `assets/main.css`).
- Reuses: `snippets/price.liquid`, `snippets/image.liquid`, `snippets/icon*` (existing patterns).
- Consumes product metafields: `custom.c_product_badge`, `custom.c_card_value_prop`.
- No changes to existing sections until they explicitly render the new snippet. No new JS, frameworks, or dependencies.
