## 1. Product card snippet

- [ ] 1.1 In `snippets/product-card.liquid`, accept `hover_effect` (`'zoom'` default via the existing `| default:` pattern), resolve the swap image from `product.metafields.custom.c_lifestyle_photo`, and document the parameter and metafield in the header comment (updating the "does NOT render … hover image-swap" line)
- [ ] 1.2 When `hover_effect == 'image'` and the swap image is present: add the `product-card--hover-image` modifier and render the swap layer inside `.product-card__image` via the `image` snippet (lazy, same size columns as the primary image, cover crop, `aria-hidden="true"`); in all other cases render exactly today's markup

## 2. Card styles

- [ ] 2.1 In the product-card block of `assets/main.css`, style the swap layer: absolutely positioned over the primary image, `object-fit: cover`, edge-to-edge (ignoring the contain-fit padding), `opacity: 0` at rest
- [ ] 2.2 On `.product-card--hover-image:hover`: fade the swap layer to `opacity: 1` with the card's existing 0.5s `cubic-bezier(0.4, 0, 0.2, 1)` tokens and keep the primary image's zoom transform suppressed for these cards; verify non-swap cards match today's rendering exactly

## 3. Section settings

- [ ] 3.1 In `sections/featured-collection-carousel.liquid`, add a "Hover effect" select (Zoom / Change to lifestyle image, default Zoom, info text naming `custom.c_lifestyle_photo`) to the Cards settings group and thread `hover_effect` into the `product-card` render call
- [ ] 3.2 Make the same schema addition and threading in `sections/c-main-collection.liquid`

## 4. Verification

- [ ] 4.1 With `shopify theme dev`: a section set to Zoom is pixel-identical to before; set to Change image, hovering a card with the metafield cross-fades to the lifestyle photo (no compounding zoom), and a card without the metafield falls back to the zoom
- [ ] 4.2 Confirm swap images lazy-load with responsive srcset, no layout shift on hover, and the theme-editor setting round-trips in both sections
