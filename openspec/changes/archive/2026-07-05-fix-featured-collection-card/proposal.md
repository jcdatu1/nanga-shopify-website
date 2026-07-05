## Why

The "C Featured collection" section and its `product-card` snippet don't match the NANGA Figma design: the carousel arrows are dead, two card-level settings (tag position, border) were built into the snippet but never exposed in the section, and the card shows the vendor with a cover-cropped image instead of the design's product type with a contained image.

## What Changes

- **Fix carousel arrow navigation.** The section's prev/next buttons lack the `slider-nav__btn` class that `assets/slider.js` requires, so clicks are ignored. Add the class so the existing engine drives the carousel (no JS change).
- **Expose the tag (badge) position setting.** The `product-card` snippet already supports `badge_position` (`overlay` over the image / `inside` at the top of the image), but the section neither exposes nor passes it. Add a section select setting and thread it into the render call.
- **Expose the border setting.** The snippet already supports `show_border`, but the section neither exposes nor passes it. Add a section checkbox and thread it into the render call.
- **Show Product Type above the title.** Replace the card's vendor line with the product type (`product.type`), shown above the title as the design's category line. **BREAKING** at the snippet contract level: the `show_vendor` parameter / vendor line is removed in favor of the product-type line.
- **Force contained images (no cover crop).** Make the card render the product image with `contain` fit (white background + padding at 3:4) so the full product is visible at native resolution, matching the design; stop defaulting to `cover`.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `featured-collection-carousel`: arrows must actually navigate; the section must expose and pass tag-position and border settings to the card.
- `product-card`: the category line above the title is the product type (not vendor); the image fit defaults to `contain` rather than `cover`.

## Impact

- **Code:**
  - `sections/featured-collection-carousel.liquid` — button class, two new schema settings, render call wiring.
  - `snippets/product-card.liquid` — product-type line replaces vendor line; `contain` default for image fit.
  - `assets/main.css` — minor rename/adjustment of the `.product-card__vendor` rule for the product-type line (scoped to `.product-card*`).
- **Shared behavior:** `assets/slider.js` is unchanged. `snippets/product-card.liquid` has a single caller (this section), so the contract change is contained.
- **Dependencies:** none added.
