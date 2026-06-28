## Context

The "C Featured collection" section (`sections/featured-collection-carousel.liquid`) renders a collection as a carousel of `product-card` snippets on the theme's native `<carousel-slider>` engine. Investigation found:

- The prev/next buttons use only the `fcc__nav-btn` class. The engine's click handler guards on `evt.target.matches('.slider-nav__btn')` (`assets/slider.js:219`), so clicks are ignored. Every other carousel section in the theme gives its buttons the `slider-nav__btn` class. The global rule `button svg { pointer-events: none }` (`assets/main.css:742`) already guarantees the click target is the button, not the inner SVG.
- The `product-card` snippet already implements `badge_position` (`overlay`/`inside`) and `show_border` with matching CSS, but the section never exposes settings for them nor passes them in the render call.
- The card's category line is the vendor (gated by `show_vendor`), while the Figma `ProductCarousel` shows the product **category** (mapped here to `product.type`). The card's image fit defaults to `cover` when no border is present, cropping the product; the design uses `object-contain` on a white, padded 3:4 frame everywhere.

The `product-card` snippet has a single caller (this section), so contract changes are contained.

## Goals / Non-Goals

**Goals:**
- Make the carousel arrows work using the existing engine, with no JS changes.
- Surface the already-built badge-position and border capabilities as section settings.
- Match the design: product type above the title, contained (non-cropped) image at native resolution, existing hover scale-zoom reading correctly.

**Non-Goals:**
- No changes to `assets/slider.js` or any shared carousel behavior.
- No new JS/CSS dependencies; no changes to `sections/featured-collection.liquid` or other `product-card`-style cards.
- No swatches, quick-buy, or hover image-swap added to the card.

## Decisions

### Fix arrows via the button class, not the engine
Add `slider-nav__btn` to both buttons (keeping `fcc__nav-btn` for the bespoke floating styling). This is the theme's established contract for carousel nav and the minimally invasive fix.
- *Alternative considered:* change the guard in `slider.js` to `evt.target.closest('.slider-nav__btn')`. Rejected — edits shared JS used by every carousel for a problem that is local to one section's markup.

### Map merchant-facing labels to existing snippet values
Add a `select` "Tag position" with options that pass `badge_position`: **"Over image" → `overlay`** (absolute, inset over the photo — the Figma default) and **"On top of image" → `inside`** (flush to the top-left of the image area). Add a `checkbox` "Show border" passing `show_border`. Both go under the existing "Cards" header and are threaded into the line-58 render call.
- *Alternative considered:* a single combined "card style" select. Rejected — the two concerns are independent and the snippet already models them separately.

### Replace vendor with product type
Render `product.type` as the category line above the title (reusing the existing position/styling), and remove the `show_vendor` parameter and vendor line. The design shows exactly one category line and it is the type; keeping vendor as a parallel option adds settings with no design use. Since the sole caller doesn't rely on vendor, this is safe.
- *Alternative considered:* keep `show_vendor` and add a separate `show_type` toggle. Rejected per the decision above (chosen with the user).

### Force `contain` as the image-fit default
Default `image_fit` to `contain` regardless of border, so the full product shows on the white padded 3:4 frame at native resolution and the existing `:hover` scale-105 reads correctly (scaling a cropped `cover` image only shifts the crop). The render already passes `custom_aspect_ratio: 0.75`; with `contain`, `custom_crop: 'contain'` is passed so the `image` snippet skips region-cropping and serves the source via its responsive `srcset`. The `.product-card--fit-contain` padding rule (`assets/main.css:11428`) supplies the design's padding for free.
- *Alternative considered:* tie fit to the border setting (`contain` when bordered, else `cover`). Rejected — the design never uses cover and the user asked not to default to cover.

## Risks / Trade-offs

- [Removing `show_vendor` could break an external caller] → Verified only one caller (`featured-collection-carousel.liquid`) renders `product-card`; the snippet's own usage comment is the only other reference. Update the snippet header comment accordingly.
- [`contain` leaves letterboxing for non-3:4 product images] → Acceptable and on-design (white padded frame); the 3:4 aspect box is intentional per the Figma export.
- [CSS class rename for the category line could orphan styles] → Reuse/rename the existing `.product-card__vendor` rule into a `.product-card__type` (or generic category) class scoped under `.product-card*`; no shared classes touched.
- [Editor confusion over "over" vs "on top of"] → Settings use the chosen plain-language labels with the `overlay`/`inside` mapping documented; defaults preserve current behavior (`overlay`).

## Migration Plan

Theme-editor settings are additive with defaults that preserve current rendering (tag position defaults to `overlay`, border defaults to off). No data migration. Rollback is reverting the section/snippet/CSS edits; no persisted state changes.

## Open Questions

None — the two prior decisions (product type replaces vendor; force `contain`) are resolved.
