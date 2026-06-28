## 1. Scaffold the section

- [x] 1.1 Create `sections/featured-collection-carousel.liquid` with a root wrapper using a dedicated section class plus `section-id-{{ section.id }}`, mirroring the wrapper conventions in `featured-collection.liquid`.
- [x] 1.2 Add a `{% schema %}` with settings: `title` (heading), `description` (subheading text/richtext), `collection`, `cards_desktop` (range, e.g. 2–5), `cards_mobile` (range, e.g. 1–3), `tag_style` (select light/dark), `show_view_all` (checkbox), `show_vendor` (checkbox), `color_scheme` (select), `full_width` (checkbox), and a product `limit`.
- [x] 1.3 Add a `presets` entry named "Featured collection (carousel)" so it appears in the section picker.

## 2. Carousel markup (reuse existing engine)

- [x] 2.1 Wrap the grid in `<carousel-slider class="carousel ...">` and reproduce the engine's DOM contract: `.slider` > `.slider__grid` (`product-grid product-grid--per-row-{{ cards_desktop }} product-grid--carousel`) with each item in `.slider__item`.
- [x] 2.2 Apply peek/responsive classes (`slider--edge-peek`, `slider--mobile-container-pad`, `slider--no-scrollbar`) and wire the mobile per-row to `cards_mobile`.
- [x] 2.3 Add the `.slider-nav` block with `button[name="prev"]` and `button[name="next"]` using `icon-chevron-left` / `icon-chevron-right` and visually-hidden labels from `general.slider.previous` / `general.slider.next`.

## 3. Render product cards

- [x] 3.1 Loop `collection.products limit: limit`, rendering each via `{% render 'product-card', product: product, show_vendor: section.settings.show_vendor %}` inside a `.slider__item`.
- [x] 3.2 Map `tag_style` to badge colors and pass `badge_bg` / `badge_text` to `product-card` (dark → `#000`/`#fff`, light → `#fff`/`#000`).
- [x] 3.3 Add the no-collection fallback: render onboarding placeholder cards (e.g. `onboarding-product-block`) so the section previews in the editor.

## 4. Heading and View All

- [x] 4.1 Build the heading row: left column with left-aligned `h2` (links to collection) and the `description` subtext beneath it.
- [x] 4.2 Add the desktop "View All →" link at the right of the heading row, gated by `show_view_all` and a selected collection.
- [x] 4.3 Add the mobile "View All" link below the carousel, shown only on mobile.

## 5. Scoped styling

- [x] 5.1 Add scoped CSS (new `assets/featured-collection-carousel.css` loaded by the section, or a tightly scoped block) for heading layout, gaps (24px mobile / 32px desktop), and peek sizing — reusing existing CSS variables/classes.
- [x] 5.2 Style the floating circular arrows (white, shadowed, ~⅓ height, overlapping left/right edges) scoped to the section class so other `.slider-nav` carousels are unaffected; handle RTL and disabled/bound states.
- [x] 5.3 Implement the responsive View All visibility swap (desktop right vs mobile below).
- [x] 5.4 Ensure the section CSS is deferred/lazy per theme convention and contains no duplicate/dead rules.

## 6. Verify

- [ ] 6.1 Add the section in the theme editor on a collection with many products; confirm arrows, scroll-snap, peek, and per-row behavior on desktop and mobile. _(Requires live Shopify theme-editor preview — user to verify.)_
- [ ] 6.2 Confirm graceful fallback when the collection has fewer products than fit (engine disables nav, static row). _(Requires live preview — user to verify.)_
- [x] 6.3 Verify accessibility: keyboard-operable arrows with labels, semantic card link order, and adequate tap targets. _(Static: real `<button>` elements with visually-hidden labels + `aria-controls`; card link order from `product-card`; tap targets 40px mobile / 48px desktop.)_
- [x] 6.4 Confirm `featured-collection.liquid`, `product-card.liquid`, and `slider.js` are unchanged and no new dependency/render-blocking asset was added. _(Verified via git: only new section + scoped CSS added.)_
