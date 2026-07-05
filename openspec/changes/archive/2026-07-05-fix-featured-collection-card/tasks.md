## 1. Fix carousel arrow navigation

- [x] 1.1 In `sections/featured-collection-carousel.liquid`, add the `slider-nav__btn` class to both the prev and next buttons (keep `fcc__nav-btn` and `has-ltr-icon`).
- [ ] 1.2 Verify in the theme editor that clicking the arrows advances/rewinds the carousel and that the disabled state at the bounds still works.

## 2. Expose tag-position and border settings

- [x] 2.1 In the section schema (under the "Cards" header), add a `select` setting `tag_position` with options "Over image" (value `overlay`) and "On top of image" (value `inside`), default `overlay`.
- [x] 2.2 In the section schema, add a `checkbox` setting `show_border` (default `false`).
- [x] 2.3 Update the `{% render 'product-card' %}` call to pass `badge_position: section.settings.tag_position` and `show_border: section.settings.show_border`.
- [ ] 2.4 Verify in the theme editor that toggling each setting changes badge placement and the card border on all cards.

## 3. Product type line replaces vendor

- [x] 3.1 In `snippets/product-card.liquid`, replace the vendor block with a product-type line that renders `product.type` above the title when non-blank; remove the `show_vendor` parameter and its handling.
- [x] 3.2 Update the snippet's header comment (params list and usage example) to drop `show_vendor` and document the product-type line.
- [x] 3.3 In `sections/featured-collection-carousel.liquid`, remove `show_vendor: section.settings.show_vendor` from the render call and remove the now-unused `show_vendor` section setting.
- [x] 3.4 In `assets/main.css`, rename/adapt the `.product-card__vendor` rule to the product-type line class (scoped under `.product-card*`); update the matching class name in the snippet.

## 4. Force contained image fit

- [x] 4.1 In `snippets/product-card.liquid`, change the `image_fit` default so it is `contain` when the parameter is omitted (regardless of `show_border`); keep explicit `cover` working.
- [x] 4.2 Confirm the render still passes `custom_aspect_ratio: 0.75` and that `custom_crop: 'contain'` is passed when fit is contain so the image is served at native resolution without region-cropping.
- [x] 4.3 Update the snippet header comment for the new `image_fit` default.

## 5. Verify against the design

- [ ] 5.1 In the theme editor, confirm cards show: product type above the title, contained (non-cropped) image on a white padded 3:4 frame, and the hover scale-zoom + title color change reading correctly.
- [ ] 5.2 Confirm no regressions to `sections/featured-collection.liquid` or other carousel sections, and that no shared JS/CSS behavior changed.
