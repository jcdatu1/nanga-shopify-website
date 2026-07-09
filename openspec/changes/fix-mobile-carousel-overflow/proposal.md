# fix-mobile-carousel-overflow

## Why

On mobile, pages containing the NANGA carousels can be swiped horizontally, dragging the whole layout sideways and revealing a white gap. The cause is geometric: both carousels position their floating circular arrows overlapping the carousel edges by half the button width (`translate(±50%)` at `left: 0` / `right: 0` — 20px on mobile for the 40px button), but the mobile container padding (`--container-pad-x`) is only 16px. Each arrow therefore pokes ~4px past the viewport, and nothing clips it: neither section clips horizontal overflow and the theme has no body-level `overflow-x` guard, so the browser makes the page horizontally scrollable. Even the invisible "prev" arrow contributes, because its disabled state is `opacity: 0`, not `display: none`. The design export (`context/NANGAv1/src/app/components/ProductCarousel.tsx`) carries the same overhang, so this was copied faithfully — the overflow is a bug in both.

## What Changes

- **`assets/featured-collection-carousel.css`** — add `overflow-x: clip` on the section root (`.fcc`) so arrow overhang can never widen the page. The overlapping-arrow design is preserved; only the sliver that would fall outside the full-width section (i.e. outside the viewport) is clipped.
- **`assets/collection-list-carousel.css`** — same fix on `.clc`.
- **No markup, JS, or arrow-position changes.** The arrows keep their design-faithful half-overlap of the carousel edges; on mobile the outermost ~4px is flat-cut at the viewport edge, which is visually negligible.
- **Verification sweep** — confirm on a live preview that no other element widens the page on mobile (the custom `c-*` stylesheets were audited and show no other fixed-width/negative-margin candidates).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `featured-collection-carousel`: adds a requirement that the section must not introduce horizontal page overflow at any viewport width.
- `collection-list-carousel`: same containment requirement.

## Impact

- **Modified files**: `assets/featured-collection-carousel.css`, `assets/collection-list-carousel.css` (one rule each).
- **Behavior**: pages with these sections stop being horizontally swipeable on mobile; desktop is unaffected (60px container padding easily contains the 24px overhang).
- **Degradation**: browsers without `overflow: clip` support (pre-2022) ignore the declaration and keep today's behavior — no regression, no accidental scroll-container side effects that `overflow-x: hidden` would create.
- **Out of scope**: a global `body { overflow-x }` guard was considered and rejected as masking future bugs; if live verification finds an unrelated second overflow source, it becomes its own change.
