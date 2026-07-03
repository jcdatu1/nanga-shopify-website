## 1. Scaffold the section

- [x] 1.1 Create `sections/c-main-product.liquid` following the `c-main-collection` conventions: header comment (design source, reuse strategy, required store config: swatch settings + `custom.key_features` / `custom.specifications` metafields), `<link rel="stylesheet" href="{{ 'c-main-product.css' | asset_url }}" {%- render 'lazy-stylesheet-attrs' %}>`, deferred `<script src="{{ 'c-main-product.js' | asset_url }}" defer>`, root `.cmp` wrapper with `data-section-id` inside the theme `.container`.
- [x] 1.2 Set up the shared assigns mirroring `main-product.liquid`: `product_form_id = 'product-form-' | append: section.id`, `current_variant = product.selected_variant | default: false` (no default variant — nothing preselected), and the two-column layout scaffold (`.cmp__gallery` / `.cmp__info` with sticky `.cmp__info-inner`).
- [x] 1.3 Render `{% render 'structured-data-product', product: product, current_variant: product.selected_or_first_available_variant %}` at the end of the section, as `main-product.liquid:1112` does.

## 2. Back-link bar

- [x] 2.1 Add the top `.cmp__back` bar (chevron via `icon-chevron-left` + "Back to {label}", bottom border) gated by a `show_back_link` section setting (default on). Resolve target: `collection` (when in collection context) else `product.collections.first`; hide when neither resolves.

## 3. Gallery

- [x] 3.1 Render `.cmp__media`: bordered 3:4 main-image well with inner padding showing `product.featured_media` (or `current_variant.featured_media` when set), responsive (`image_url` + `width`/`srcset`/`sizes`), eager for this first image only.
- [x] 3.2 Render `.cmp__thumbs`: 5-per-row grid of `<button>` thumbnails looping `product.media`, each with `data-media-id`, `loading="lazy"`, small `srcset`, and active state on the currently shown media; skip the grid when `product.media.size <= 1`.
- [x] 3.3 Create `assets/c-main-product.js` with a `<cmp-gallery>` custom element (guarded by `customElements.get`): thumbnail click swaps the main image `src`/`srcset`/`alt` and moves the active class. *Implementation note: variant→image sync is handled server-side instead of an `on:variant:change` listener — the media well and thumbnail grid carry `data-dynamic-variant-content`, so `variant-picker.js` re-renders them with the new variant's featured media (see design.md Decision 3).*
- [x] 3.4 Confirm no-JS behavior: main image renders server-side; thumbnails degrade gracefully.

## 4. Info column — blocks loop

- [x] 4.1 Add the `{% for block in section.blocks %}{% case block.type %}` loop inside `.cmp__info-inner`, every block wrapper carrying `{{ block.shopify_attributes }}`, plus the `{% when '@app' %}{% render block %}` branch.
- [x] 4.2 `title` block: `product.title` as `<h1 class="cmp__title">`.
- [x] 4.3 `price` block: container tagged `data-dynamic-variant-content="{{ block.id }}-price"` rendering `{% render 'price', product: product, for_variant_picker: true, current_variant: current_variant, show_currency_code: settings.product_currency_code_enabled %}`.
- [x] 4.4 `description` block: `{{ product.description }}` in `.cmp__description` (muted, relaxed leading per design).

## 5. Variant picker (reuse, restyled)

- [x] 5.1 `variant-picker` block: build `size_chart_link` the way `main-product.liquid` does (stock size-chart block settings: enable, label, variant name, source page → theme modal machinery), then `{% render 'variant-picker', product: product, product_form_id: product_form_id, block: block, update_url: true, size_chart_link: size_chart_link %}`. Block settings mirror the stock block's (`show_single`, `dynamic_availability`, size-chart set) with `selector_style` fixed to `listed`. *Also passes `swatch_style: 'listed'` so the color name stays visible for the Figma label bar; size-chart modal renders via `snippets/product-popups.liquid` (reads this block's settings), included at the end of the section.*
- [x] 5.2 Restyle within `.cmp` scope only: Color option → image swatch cards (~96px well + label bar underneath, black border when selected, horizontal scroll on overflow) targeting the snippet's swatch classes; Size option → 4-column grid of bordered buttons, selected = black background / white text; "Size Chart" link underlined, right-aligned beside the Size label.
- [x] 5.3 Verify against the snippet's actual class names (`.option-selector`, `.opt-btn`, `.opt-label`, swatch CSS vars) and that variant-image swatches activate when store swatch settings are configured; document the required settings in the section header comment. *(Class names verified against main.css and the snippet; header comment documents the required swatch settings. Store config confirmed in `config/settings_data.json`: swatch_source "theme", option "Color", method "variant-images", style "listed", icon size 120px. Fixed a specificity clash where the theme's `.swatch-style-listed` 22px inline-swatch rule squashed the image cards.)*

## 6. Buy buttons

- [x] 6.1 `buy-buttons` block: `{% form 'product', product, id: product_form_id, class: 'form js-product-form', data-product-id: product.id %}` with hidden `id` input (`value="{{ current_variant.id }}"`, `data-dynamic-variant-content="{{ block.id }}-input-id"`).
- [x] 6.2 Quantity stepper (gated by `show_quantity_selector`, default on): stock `quantity-wrapper` markup (`data-quantity="down"/"up"` + `icon-minus`/`icon-plus`), restyled to the design's bordered-square stepper in `.cmp` scope.
- [x] 6.3 Add-to-cart submit inside a `data-dynamic-variant-content="{{ block.id }}-atc"` container with the `js-form-error` region: `name="add"`, `data-add-to-cart-text`, `data-preselection-disabled="true"`, `data-preselection-text` from a block setting (default "Select a Size"); server-render disabled state and label for the current variant/preselection like the stock block. Full-width black button per design.
- [x] 6.4 Optional dynamic payment button (`enable_payment_button` setting) using the stock `<buy-buttons>` + `dynamic-payment-button-template` pattern, with the stock gift-card/selling-plan/preorder guards.
- [ ] 6.5 Verify end-to-end on a dev store: no preselection → disabled "Select a Size"; select options → price + URL + ATC update via the dynamic-variant re-render; sold-out variant → disabled "no stock" label; add-to-cart lands in the cart drawer. *(Manual check on the dev store.)*

## 7. Trust row

- [x] 7.1 `trust-item` block (repeatable, max 4): settings `icon` (select of theme icon names — includes `truck`, `return`, `award`, `lock`, `box` and more), optional `custom_icon` image override, `heading`, `text`. Render icon via `{% render 'icon', icon: block.settings.icon %}`.
- [x] 7.2 Group consecutive `trust-item` blocks into the bordered-top `.cmp__trust` 3-up row (icon left, heading + subtext right), collapsing to stacked on small screens per design. *(All trust items render together at the position of the first one; per-item `shopify_attributes` kept for editor highlighting.)*

## 8. Metafield blocks

- [x] 8.1 `key-features` block: settings `heading` (default "Key Features") and `metafield` (text, default `custom.key_features`). Split the setting on `.` into namespace/key, read `product.metafields[namespace][key]`; when present render heading + `{{ metafield | metafield_tag }}` styled as the design's bulleted list; render nothing when empty.
- [x] 8.2 `specifications` block: settings `heading` (default "Specifications") and `metafield` (text, default `custom.specifications`). Iterate the list value; per entry split on the **first** `|` (property = first part stripped; value = remaining parts re-joined with `|`, stripped); entries without `|` render as a full-width single cell. Render as `space-between` rows with bottom borders per design.
- [x] 8.3 No `font-family` anywhere in the new CSS — both blocks inherit theme typography.

## 9. Schema, presets, template wiring

- [x] 9.1 Add `{% schema %}`: section settings (`show_back_link` + `back_label`, `media_fit`, `enable_sticky_info`, `select_first_variant`), the block definitions from tasks 4–8 with limits (`title`/`price`/`description`/`variant-picker`/`buy-buttons`/`key-features`/`specifications` at `limit: 1`; `trust-item` max 4; `@app`), and `enabled_on: { templates: ["product"] }`.
- [x] 9.2 Update `templates/product.json`: change the `main` section type to `c-main-product` and seed blocks in design order (title, price, description, variant-picker, buy-buttons, trust-item ×3 — shipping/returns/warranty, key-features, specifications). Leave all other template sections untouched.

## 10. Stylesheet

- [x] 10.1 Create `assets/c-main-product.css`, everything scoped under `.cmp`: two-column grid + gaps at the `lg` breakpoint, sticky info column with header offset (`--theme-sticky-header-height`), back bar, gallery well + thumbnail grid with active borders, block spacing matching the design's rhythm, trust row, features list, spec rows. Reuses theme CSS variables where defined; no `font-family`; mobile-first responsive per the design's `sm`/`lg` behavior.

## 11. Verification

- [ ] 11.1 Theme-editor pass: blocks add/reorder/remove cleanly, `shopify_attributes` highlight correctly, section renders acceptably with metafields unset and with a single-variant product. *(Manual check.)*
- [ ] 11.2 `shopify theme check` passes on the new files; Lighthouse/network sanity check — CSS lazy-loaded, JS deferred, images responsive + lazy, no render-blocking additions. *(CLI not installed locally; static checks done — schema/template JSON validated, Liquid tags balanced. Manual check on push.)*
- [ ] 11.3 Visual diff against `ProductDetail.tsx` at mobile and desktop widths: back bar, gallery, every block, disabled-ATC state, size-chart modal. *(Manual check.)*
