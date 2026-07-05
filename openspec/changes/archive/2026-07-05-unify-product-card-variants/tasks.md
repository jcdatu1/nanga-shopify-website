## 1. Snippet: section-controllable detail lines

- [x] 1.1 In `snippets/product-card.liquid`, add `show_type` and `show_value_props` params, both defaulting to `true` when omitted; gate the type line on `show_type` and the value-prop line on `show_value_props`.
- [x] 1.2 Update the snippet's header comment (params list and usage example) to document both params and their defaults.

## 2. CSS: cover-fit background + hover/motion fidelity

- [x] 2.1 In `assets/main.css` (card-scoped rules only), add `.product-card--fit-cover .product-card__image { background: #f3f4f6; }` for the design's gray-tinted cover frame.
- [x] 2.2 Replace the title hover color `var(--text-color-secondary, #000000)` with `#4b5563` and set the title color transition to `150ms cubic-bezier(0.4, 0, 0.2, 1)`.
- [x] 2.3 Change the image zoom transition from `transform 0.5s ease` to `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)`.
- [x] 2.4 Change `.product-card__type` and `.product-card__value-props` color from `rgb(75, 98, 116)` to `#4b5563`.
- [x] 2.5 In `assets/featured-collection-carousel.css`: arrow hover background `#f1f1f1` → `#f3f4f6`; arrow shadow → `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`; View-All gap 6px → 8px resting and 10px → 12px on hover.

## 3. C Featured collection: new card settings

- [x] 3.1 In `sections/featured-collection-carousel.liquid` schema (under "Cards"), add: `image_style` select ("Product (contained, white)" → `contain`, "Lifestyle (cover, gray)" → `cover`, default `contain`), `show_type` checkbox (default `true`), `show_value_props` checkbox (default `false`).
- [x] 3.2 Thread `image_fit`, `show_type`, and `show_value_props` into the `{% render 'product-card' %}` call.

## 4. C Collection grid: mirrored card settings

- [x] 4.1 In `sections/c-main-collection.liquid` schema (under "Cards"), add the same three settings with category-grid defaults: `image_style` default `cover`, `show_type` default `false`, `show_value_props` default `true`.
- [x] 4.2 Thread the three params into the `{% render 'product-card' %}` call.
- [x] 4.3 Review `templates/collection.json`: confirm the live instance picks up the design-faithful defaults (or set them explicitly) — this intentionally changes the live collection page toward the Figma.

## 5. New Arrival alternate template

- [x] 5.1 Create `templates/collection.new-arrival.json` using `c-main-collection` with: `enable_filtering: false`, `show_sort: false`, `show_total: false`, `show_border: true`, `tag_style: "dark"`, `image_style: "contain"`, `show_type: true`, `show_value_props: false`, `grid: 3`, `mobile_grid: "2"`.

## 6. Verify against the design

- [ ] 6.1 Theme editor: home carousels show contain-on-white padded cards, category line, no spec line; toggling each new setting changes only its own aspect.
- [ ] 6.2 Collection page: cover-on-gray cards, spec line (with metafield data), no category line, light tag; filters/sort/AJAX behavior unchanged.
- [ ] 6.3 Assign the new-arrival template to a test collection: bordered contain cards, dark "New" tags, no filter/sort/count chrome.
- [ ] 6.4 Hover pass on real devices/browsers: image zooms to 1.05 with the design easing from anywhere on the card; title visibly shifts to gray-600; arrow hover turns gray-100 with the shadow-lg elevation; View-All gap animates 8px → 12px.
- [x] 6.5 Confirm no regressions to `featured-collection.liquid`, `product-block` cards, or any shared CSS outside the `.product-card*` / `.fcc*` scopes.
