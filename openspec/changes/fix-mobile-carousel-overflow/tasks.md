## 1. Featured collection carousel

- [x] 1.1 Add `overflow-x: clip` to the `.fcc` section-root rule in `assets/featured-collection-carousel.css`, with a short comment noting it contains the arrow overhang on mobile (20px overhang vs 16px container padding)

## 2. Collection list carousel

- [x] 2.1 Add the same `overflow-x: clip` rule to the `.clc` section root in `assets/collection-list-carousel.css`

## 3. Verification

- [ ] 3.1 On a mobile viewport (375px) with `shopify theme dev`, confirm the home page no longer scrolls/swipes horizontally and the carousel arrows still render half-overlapping the carousel edges with shadows intact
- [ ] 3.2 Sweep for remaining offenders on home, collection, and product pages (console: elements whose bounding rect exceeds `innerWidth`); if any unrelated overflow source is found, report it as a candidate for a separate change
- [ ] 3.3 Spot-check desktop (≥1024px): arrows unchanged, no clipping artifacts at the section edges
