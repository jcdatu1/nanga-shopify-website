## Why

The NANGA design (`context/NANGAv1`) calls for a featured-collection section on the home page rendered as a horizontal product carousel using the new lean `product-card` snippet, with left-aligned heading + subtext, a "View All" link, and floating circular arrows. The theme's existing `featured-collection.liquid` renders the feature-rich `product-block` with a centered heading and inline arrows, which does not match the design and should not be mutated (it is a shared, heavily-reused standard section). A dedicated section lets us match the design faithfully while reusing the theme's existing carousel engine — no new dependencies.

## What Changes

- Add a **new section** `sections/featured-collection-carousel.liquid` that renders products from a chosen collection using the existing `snippets/product-card.liquid`.
- Compose the section on the theme's native `<carousel-slider>` custom element (from `assets/slider.js` / `assets/main.js`) — **no third-party carousel library** (Embla in the Figma export is the React prototype's tool, not shipped).
- Match the Figma layout: left-aligned heading + description subtext, right-aligned "View All →" link (desktop) / below carousel (mobile), and **floating circular arrows** overlapping the carousel's left/right edges.
- Responsive carousel behavior: peek of the next card with cards-per-view scaling across mobile/tablet/desktop, driven by section settings + scroll-snap (handled by the existing slider engine).
- Section settings: heading, subheading/description, collection, cards-per-row (desktop/mobile), "View All" link toggle, badge/tag style (light/dark), color scheme, full-width toggle.
- Add scoped CSS for the new section (heading layout, floating arrows, slide peek, gaps) reusing existing CSS variables/classes where possible.

## Capabilities

### New Capabilities
- `featured-collection-carousel`: A merchant-configurable home-page section that displays a collection's products as a horizontal, no-JS-library carousel using the `product-card` snippet, with Figma-faithful heading, "View All" link, and floating navigation arrows.

### Modified Capabilities
<!-- None. The existing featured-collection section and product-card snippet are reused, not changed. -->

## Impact

- **New files**: `sections/featured-collection-carousel.liquid`; scoped CSS (new `assets/` file loaded by the section, or an appended scoped block in an existing stylesheet).
- **Reused, unchanged**: `snippets/product-card.liquid`, `assets/slider.js` / `<carousel-slider>` in `assets/main.js`, `snippets/icon-chevron-left.liquid` / `icon-chevron-right.liquid`, `snippets/image.liquid`.
- **No new dependencies**, no new JS framework, no render-blocking assets.
- Theme editor: a new "Featured collection (carousel)" section appears in the section picker with a preset; existing `featured-collection.liquid` is untouched.
