## Context

The product detail design (`context/NANGAv1/src/app/pages/ProductDetail.tsx`) is a two-column page:

- **Top bar**: "‹ Back to {collection}" link over a bottom border.
- **Left**: bordered 3:4 main image (white well, inner padding, `object-contain` for product shots / `object-cover` for the model shot) above a 5-per-row grid of bordered thumbnails (model shot + one per color); the active thumbnail gets a black border.
- **Right (sticky on desktop)**: title → price → description → Color selector (image cards ~96px with a label bar underneath, black border when selected) → Size selector ("Size" label + underlined "Size Chart" link opening a modal; 4-col grid of bordered buttons, selected = black fill/white text) → Quantity (bordered −/＋ squares around a count) → full-width black add-to-cart that reads "Select a Size" and is disabled until a size is chosen → a bordered-top footer group: 3-up trust row (truck/return/shield icon + heading + subtext), "Key Features" bulleted list, "Specifications" key/value rows separated by bottom borders.

The theme's stock `sections/main-product.liquid` (3,900 lines) already contains all the *behavioral* machinery, exposed in reusable pieces:

- `snippets/variant-picker.liquid` + `assets/variant-picker.js`: a `<variant-picker>` element parameterized by a `block` object. Supports variant-image swatches with labels (the color cards), a "listed" button style (the size grid), option availability, URL sync, and the size-chart link.
- No-preselected-variant flow: `product.selected_variant | default: false` (`main-product.liquid:10`), plus `data-preselection-disabled="true"` / `data-preselection-text` on the `[name="add"]` button (`variant-picker.js:395-397`) — exactly the design's disabled "Select a Size" state with configurable text.
- Variant-driven re-render: on change, `variant-picker.js` fetches the section's own HTML for the new variant and swaps every element tagged `data-dynamic-variant-content="<key>"` (`variant-picker.js:243-252`). Price, hidden `id` input, and ATC state update this way — the new section only needs to tag its variant-dependent containers.
- `{% form 'product' %}` with class `js-product-form` + `quantity-wrapper` + `buy-buttons` (dynamic payment) — the purchase path, including cart-drawer integration via `main.js`.
- Public event `on:variant:change` (documented in `assets/custom.js`) — the hook for the new gallery to sync the variant's featured image.
- `snippets/structured-data-product.liquid` — rendered by the product section (`main-product.liquid:1112`), so the replacement section must render it too.

The team convention for design replicas is `sections/c-main-collection.liquid`: a lean `c-`prefixed section, own lazy-loaded CSS asset, BEM-prefixed scope class, header comment explaining reuse, native theme engines instead of new JS.

Constraints (per `CLAUDE.md`): minimally invasive, no new frameworks/dependencies, reuse existing engines/snippets, scope all new CSS, never mutate shared paths, match surrounding Liquid idioms. Per request: nothing hardcoded — content flows from the product object and metafields; no `font-family` declarations (theme typography wins).

## Goals / Non-Goals

**Goals:**
- A pixel-faithful, blocks-based replica of the ProductDetail design as a new `c-main-product` section wired into `templates/product.json`.
- Right-column regions as individually orderable/removable blocks.
- Rock-solid variant selection and purchase: reuse `<variant-picker>`, `js-product-form`, dynamic-variant-content re-rendering, preselection-disabled ATC, size-chart modal — all native theme behavior, restyled only.
- Key Features from a `rich_text` product metafield; Specifications from a `list.single_line_text_field` metafield with `Property|Value` entries split on the first `|`.
- Lean gallery with variant-image sync via `on:variant:change`; responsive images and lazy-loading throughout.

**Non-Goals:**
- Not modifying or deleting `sections/main-product.liquid`, its snippets, or `assets/variant-picker.js` — the stock section remains available (quickbuy and `featured-product` also depend on its snippets).
- No zoom/lightbox/slider in the gallery (the design shows none); no reuse of `media-gallery`/`gallery-viewer`.
- No sticky add-to-cart bar, reviews, complementary products, or other stock blocks not present in the design (apps can still inject via `@app`).
- Not creating the metafield definitions themselves (store admin task) and not altering global theme swatch settings in code.

## Decisions

### Decision 1: New lean section `c-main-product.liquid`, swapped into `templates/product.json`
Follow the `c-main-collection` pattern exactly: `sections/c-main-product.liquid` scoped under `.cmp`, `assets/c-main-product.css` linked via `lazy-stylesheet-attrs`, header comment describing the reuse strategy. `templates/product.json`'s `main` entry changes type to `c-main-product` with seeded blocks in design order. The stock section is untouched.
- **Alternative considered:** Restyle `main-product` via settings + CSS. Rejected — it cannot reach the design's structure (color cards adjacent to gallery thumbnails, trust row placement, metafield blocks) without invasive edits to a 3,900-line shared section.

### Decision 2: Reuse the theme's variant/purchase machinery verbatim, restyle in `.cmp` scope
The section keeps the stock conventions so `variant-picker.js` and `main.js` work unmodified:
- Wrap the whole section in the expected structure with `assign current_variant = product.selected_variant | default: false` (no default variant → nothing preselected, like the design).
- Render `{% render 'variant-picker', product: product, product_form_id: product_form_id, block: block, update_url: true, size_chart_link: size_chart_link %}` from a `variant-picker` block whose settings mirror the stock block's (selector_style fixed to `listed`, `dynamic_availability`, size-chart page settings). Color renders as variant-image swatches via the theme's existing swatch settings; Size renders as listed buttons.
- Render the `buy-buttons` block as `{% form 'product', product, id: product_form_id, class: 'form js-product-form' %}` with the hidden `id` input tagged `data-dynamic-variant-content`, the stock `quantity-wrapper` stepper, and the `[name="add"]` button carrying `data-add-to-cart-text`, `data-preselection-disabled="true"`, and `data-preselection-text` (setting, default "Select a Size"). Optional dynamic payment button via the stock `buy-buttons` element pattern.
- Tag the price block's container `data-dynamic-variant-content="{{ block.id }}-price"` and render `snippets/price.liquid` with `for_variant_picker: true` so price re-renders on variant change.
- **Alternative considered:** A bespoke lightweight variant selector element. Rejected — duplicates availability matrices, URL sync, sold-out states, and section re-rendering; the theme's engine already produces the exact design states.

### Decision 3: Lean gallery with a small `<cmp-gallery>` element
Markup: `.cmp__media` main-image well (3:4, border, inner padding) + `.cmp__thumbs` 5-per-row grid of `<button>` thumbnails from `product.media`. A ~40-line custom element in `assets/c-main-product.js` (deferred, loaded only by this section):
- Click thumbnail → swap main image `src`/`srcset` and move the active border.
- Variant sync (color card click → photo switch): **implemented server-side instead of the planned `on:variant:change` listener.** The media well and thumbnail grid are tagged `data-dynamic-variant-content`, so `variant-picker.js` re-renders them with the new variant's featured media on every full variant selection — no event-payload assumptions, and preselection changes (partial option choices) correctly leave the gallery untouched. The custom element uses event delegation from its root, so it survives those container replacements.
- First media eager with `fetchpriority="high"`-equivalent sizing; thumbnails and non-initial images `loading="lazy"`; all via `image_url` + `srcset`/`sizes`.
- Works without JS: the main image renders server-side; thumbnails are progressive enhancement.
- **Alternative considered:** Reuse `media-gallery` + `gallery-viewer`. Rejected — brings zoom, slider, and thumbnail-slider machinery the design doesn't want, and its layout assumptions fight the simple grid.

### Decision 4: One block per right-column region
Block list (all `limit: 1` except `trust-item` and `@app`):
- `title` — `product.title` as `<h1>`.
- `price` — as in Decision 2.
- `description` — `product.description`.
- `variant-picker` — as in Decision 2, includes the "Size Chart" link (underlined, right of the Size label) using the stock size-chart settings (source page → theme modal machinery).
- `buy-buttons` — quantity stepper + ATC + optional dynamic payment button; `show_quantity_selector` default on.
- `trust-item` — repeatable (max ~4): icon select rendered via `{% render 'icon', icon: ... %}` (theme has `truck`, `return`, `award`, `lock`, …) with optional custom image override, heading, subtext. First `trust-item` opens the bordered-top footer group; consecutive items flow into the 3-up row.
- `key-features` — heading text setting (default "Key Features") + metafield reference setting (default `custom.key_features`).
- `specifications` — heading text setting (default "Specifications") + metafield reference setting (default `custom.specifications`).
- `@app`.
The top back-bar is a section-level setting (`show_back_link`, default on), resolving to `collection.url`/`collection.title` when in collection context, else `product.collections.first`.
- **Why blocks:** requested modularity; merchants reorder/remove regions in the editor, and the template seeds the design order.

### Decision 5: Metafield handling
- **Key Features** (`rich_text`): resolve `namespace.key` from the block's text setting via `product.metafields[namespace][key]`, render with `| metafield_tag` (semantic `<ul>/<li>/<p>` output), styled in `.cmp` scope to the design's bullet list. Block renders nothing if the metafield is empty.
- **Specifications** (`list.single_line_text_field`): iterate `.value`; for each entry `assign parts = entry | split: '|'` → property = `parts | first | strip`, value = remaining parts re-joined with `|` and stripped (preserves literal `|` inside values; only the **first** separator splits). Entries without a `|` render as a full-width single cell rather than being dropped silently. Rows are the design's `space-between` key/value lines with bottom borders.
- The `namespace.key` text settings make wiring adjustable without code; defaults match the agreed metafields.
- **Alternative considered:** Theme-editor dynamic sources on richtext settings. Rejected — per request, the section reads product metafields directly; no per-template wiring needed.

### Decision 6: Sticky info column and layout via scoped CSS only
Two-column grid at the `lg` breakpoint mirroring the design's `max-w-7xl` container and gaps, using the theme's `.container` conventions; `.cmp__info-inner { position: sticky; top: <header offset> }` on desktop. All rules live in `assets/c-main-product.css` under `.cmp`; zero `font-family` declarations; reuse existing CSS variables (borders, colors) where the theme defines them.

## Risks / Trade-offs

- **`templates/product.json` is admin-managed** ("Update from Shopify" commits; auto-generated warning). The swap may be re-edited from the admin. Mitigation: the section + preset is the durable deliverable; the template edit is a seed. Coordinate the deploy so the admin sync doesn't race the swap.
- **Swatch behavior depends on global theme settings** (`swatch_source: 'theme'`, `swatch_option_name` containing "Color", variant-images method, `swatch_picker_image_size`). If unset, colors render as listed text buttons instead of image cards. Mitigation: document the required settings in the section's header comment; verify on the dev store during rollout. The design's ~96px cards may need `swatch_picker_image_size` raised (store config, not code) to avoid soft images.
- **Metafields absent or malformed** → Key Features / Specifications blocks render nothing (empty-metafield guard) and malformed spec entries render as a single cell. No hard failures.
- **Preselection UX with multi-option products**: `data-preselection-disabled` applies while *any* option is unselected, and the button text is a single static string. The design's product implies Color preselected + Size unselected; with no URL variant, *neither* is selected. Mitigation: keep the generic-capable preselection text setting (default "Select a Size", merchant can set "Select options"); optionally seed collection links with a `?variant=` param later if the client wants color preselected. Accepted trade-off.
- **Model shot in the thumbnail row**: the design shows a model photo plus per-color shots. Real data is just `product.media` order — merchants control this by arranging media in the admin. No code assumption about which media is "the model".
- **`on:variant:change` payload shape** must be read from `assets/custom.js`'s documented example (variant object in `event.detail`) — verify `featured_media` id mapping against a real event during implementation before relying on it.
- **Dynamic-variant re-render swaps DOM nodes** inside tagged containers; the gallery element must not keep references into those containers (it doesn't — it only reads events), and `.cmp` styles must target stable classes that survive the swap.

## Open Questions

- None blocking. If the store's metafield namespace differs from `custom.*`, adjust the block setting defaults at implementation time (settings already make this editable per instance).
