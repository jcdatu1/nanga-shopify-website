## 1. Snippet scaffold & parameter contract

- [x] 1.1 Create `snippets/product-card.liquid` with a header comment documenting all parameters: `product` (required), `show_border`, `badge_position` (`overlay`|`inside`, default `overlay`), `badge_bg`, `badge_text`, `show_vendor`, `image_fit` (`contain`|`cover`).
- [x] 1.2 Add the opening `{%- liquid -%}` block: resolve `product_url`, `cheapest_variant` (`product.variants | sort: 'price' | first`), and default `image_fit` from `show_border` (bordered→`contain`, borderless→`cover`) when not explicitly passed.
- [x] 1.3 Render the root `.product-card` element with a `.product-card--bordered` modifier when `show_border` is true and a `.product-card--badge-{{ badge_position }}` modifier.

## 2. Image & hover zoom

- [x] 2.1 Render the image container `.product-card__image` (aspect ratio per design, `overflow: hidden`) linking to `product_url`; use `snippets/image.liquid` with responsive widths/sizes and `loading: 'lazy'`.
- [x] 2.2 Handle the no-featured-media case with a placeholder image.
- [x] 2.3 Pass `image_fit` through to the image crop/object-fit so `contain` vs `cover` is honored.

## 3. Badge

- [x] 3.1 Read `product.metafields.custom.c_product_badge`; render `.product-card__badge` only when it is non-blank (do not render `product-label.liquid` or any auto New/Sale/stock labels).
- [x] 3.2 Apply `badge_bg`/`badge_text` as inline CSS custom properties (`--pc-badge-bg`, `--pc-badge-text`) on the badge element.
- [x] 3.3 Place the badge for `overlay` (absolute top-left over image) and `inside` (top of image area, in normal flow, inside the border) per `badge_position`.

## 4. Text block: vendor, title, value props

- [x] 4.1 Render the optional vendor/category line above the title when `show_vendor` is true.
- [x] 4.2 Render the product title linking to `product_url`.
- [x] 4.3 Read `product.metafields.custom.c_card_value_prop`, guard for blank/empty (compact the list), and render the values joined by ` • ` in `.product-card__value-props` between title and price.

## 5. Price

- [x] 5.1 Render price via `{% render 'price', product: product, current_variant: cheapest_variant, show_currency_code: settings.product_currency_code_enabled %}` wrapped in `.product-card__price`.

## 6. Styles

- [x] 6.1 Append a scoped `.product-card*` CSS block to `assets/main.css` (no new files/dependencies): layout, border modifier, image hover `scale(1.05)` with transition and container `overflow: hidden`.
- [x] 6.2 Style `.product-card__badge` to consume `--pc-badge-bg`/`--pc-badge-text` with theme-consistent fallbacks, plus overlay vs inside positioning.
- [x] 6.3 Style `.product-card__price` so `.price__was` (compare-at) renders first with strikethrough and `.price--on-sale .price__current` renders red, using only the stable price classes.
- [x] 6.4 Style `.product-card__value-props` (muted, between title and price) and the vendor line per the design.

## 7. Verification

- [x] 7.1 Render the snippet in a scratch/test context for: bordered + overlay badge, borderless + inside badge, on-sale product (slashed original then red), product with and without value props, and a product with no badge — confirm each matches the design and no swatches/quick-buy appear.
- [x] 7.2 Confirm existing sections rendering `product-block.liquid` are visually unchanged (no shared CSS/snippet was modified).
