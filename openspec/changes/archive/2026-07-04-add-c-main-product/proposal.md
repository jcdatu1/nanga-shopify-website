## Why

The NANGA product detail design (`context/NANGAv1/src/app/pages/ProductDetail.tsx`) — a two-column page with a bordered 3:4 gallery + thumbnail row on the left and a sticky info column (title, price, description, image-card color selector, size button grid, quantity stepper, add-to-cart, trust row, Key Features, Specifications) on the right — does not match the stock `sections/main-product.liquid` layout. The stock section is a 3,900-line multi-purpose theme section; restyling it to a pixel-faithful replica would mean mutating a heavily shared surface. The team already established the pattern for this situation with `c-main-collection`: build a lean, `c-`prefixed sibling section that reuses the theme's native JS engines and swap it into the template.

## What Changes

- Add a new `c-main-product` section (lean sibling to `main-product`), scoped under `.cmp`, with its own lazy-loaded stylesheet `assets/c-main-product.css` and a small deferred `assets/c-main-product.js` for the gallery.
- Render every region of the design's right column as a **block** so merchants can add/reorder/remove them in the theme editor: `title`, `price`, `description`, `variant-picker`, `buy-buttons`, `trust-item` (repeatable icon + heading + subtext), `key-features`, `specifications`, plus `@app`.
- **Reuse the theme's native variant/purchase machinery** — the `<product-form>` wrapper, `snippets/variant-picker.liquid` + `assets/variant-picker.js`, and `{% form 'product' %}` — restyled within the `.cmp` scope. This keeps option availability, URL sync, dynamic price updates, the size-chart modal, and the no-variant-preselected "select a size" disabled add-to-cart state (all already supported by the theme) instead of rebuilding them.
- Build a **lean gallery**: bordered 3:4 main image + a 5-per-row thumbnail grid from `product.media`, with a tiny custom element that swaps the main image on thumbnail click and listens to the theme's `on:variant:change` event to sync the variant's featured image. No reuse of the heavy `media-gallery`/`gallery-viewer` (zoom, sliders) machinery.
- Nothing hardcoded: all content flows from the product object and two product metafields —
  - **Key Features**: a `rich_text` metafield (default `custom.key_features`), rendered as the design's bulleted list.
  - **Specifications**: a `list.single_line_text_field` metafield (default `custom.specifications`) where each entry is `Property|Value`, split on the **first** `|` into the design's bordered key/value rows.
  Both blocks expose the `namespace.key` as a text setting so the wiring is adjustable without code.
- Add the top "Back to {collection}" bar (chevron + label, bottom border) as part of the section, derived from the collection context / product's first collection.
- Swap `templates/product.json`'s `main` section from `main-product` to `c-main-product` with a seeded block order matching the design. The stock `main-product` section stays in the repo untouched.
- No `font-family` declarations anywhere in the new CSS — typography inherits the theme.

## Capabilities

### New Capabilities
- `product-detail-page`: A blocks-based main product section replicating the NANGA product detail design, reusing the theme's native variant-picker/product-form engines for variant selection and purchase, with Key Features and Specifications driven by product metafields.

### Modified Capabilities
<!-- None. This is a net-new section; the stock main-product section and its shared snippets are not modified. -->

## Impact

- **New files**: `sections/c-main-product.liquid`, `assets/c-main-product.css`, `assets/c-main-product.js`.
- **Modified files**: `templates/product.json` (point the `main` section at `c-main-product` and seed its blocks).
- **Reused, unchanged**: `snippets/variant-picker.liquid`, `assets/variant-picker.js`, `snippets/price.liquid`, `snippets/structured-data-product.liquid`, `snippets/icon.liquid`, size-guide/modal machinery, `lazy-stylesheet-attrs`, `animation-attrs` — consistent with `c-main-collection`.
- **Store configuration dependencies** (no code): theme swatch settings must map the Color option to variant-image swatches (`swatch_option_name` contains "Color", variant-images method), and the store must define the `custom.key_features` (rich_text) and `custom.specifications` (list of single-line text) product metafields.
- **No new dependencies**, no new frameworks, no changes to shared snippets/classes (additive only; all new CSS scoped to `.cmp`).
