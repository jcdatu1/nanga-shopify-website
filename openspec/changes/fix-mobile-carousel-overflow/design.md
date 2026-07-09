# fix-mobile-carousel-overflow — Design

## Context

Both NANGA carousels (`.fcc` in `assets/featured-collection-carousel.css`, `.clc` in `assets/collection-list-carousel.css`) render prev/next as floating circular buttons absolutely positioned against the `<carousel-slider>` element, overhanging its left/right edges by 50% of the button width (mobile: 40px button → 20px overhang; desktop: 48px → 24px). The carousel sits inside `.container`, whose horizontal padding is `--container-pad-x`: 16px on mobile, 30–60px from 768px up (`assets/main.css:437-460`). Mobile is therefore the only breakpoint where the overhang (20px) exceeds the padding (16px), pushing ~4px of each button past the viewport. The `.slider` element scrolls its own content (`overflow-x: auto`), but the buttons are siblings of the slider, and no ancestor — section root, `#content`, or `body` — clips horizontal overflow.

## Goals / Non-Goals

**Goals:**
- Eliminate horizontal page scroll caused by these two sections on mobile.
- Preserve the design's overlapping-arrow look at every breakpoint.
- Smallest possible surface: CSS only, scoped to the two section stylesheets.

**Non-Goals:**
- No global `body`/`html` overflow guard.
- No repositioning of the arrows (the design intends the overlap).
- No changes to the shared slider engine, `.container` padding, or `main.css`.

## Decisions

- **`overflow-x: clip` on the section roots (`.fcc`, `.clc`).** The section root is full-bleed (100% of the body), so its border edge coincides with the viewport edge; clipping there cuts exactly and only the part of the arrows that would widen the page. `clip`, unlike `hidden`, does not turn the element into a scroll container, so there is no risk of trapping scroll gestures, breaking `position: sticky` descendants, or the section becoming programmatically scrollable. Alternatives rejected:
  - *Tuck the arrows inside the edge on mobile* — changes the visual design and needs breakpoint-specific transforms in two files.
  - *Global `body { overflow-x: clip }`* — fixes everything invisibly, including bugs we would rather see and fix at the source.
  - *`overflow-x: hidden`* — creates a scroll container; a stray wide child would become silently scrollable inside the section instead of visibly broken.
- **Clip only the x-axis.** The buttons carry a `shadow-lg` elevation that extends vertically; `overflow-x: clip` keeps vertical overflow (shadows, focus rings above/below) intact. Note browsers pair an axis `clip` with `visible` on the other axis correctly (unlike `hidden`).
- **No fallback declaration for old browsers.** Unsupported `clip` is ignored, leaving today's behavior — a 4px cosmetic overflow in legacy browsers is acceptable; a `hidden` fallback line would reintroduce the scroll-container risk exactly where we can't test.

## Risks / Trade-offs

- [The reported white-space gap might have a second cause elsewhere] → The user report ("entire display swipes") may describe more than 4px. The verification task sweeps the live mobile viewport (`[...document.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > innerWidth || el.getBoundingClientRect().left < 0)`) after the fix; any remaining offender is raised as a separate change rather than widening this one.
- [Arrows visually flat-cut by ~4px at the mobile viewport edge] → Negligible sliver on a circular button; identical to how the design renders inside any clipped preview frame.
- [Future sections copying the floating-arrow pattern reintroduce the bug] → The pattern now carries the containment rule in both reference stylesheets; new carousels should copy `.fcc` wholesale.

## Migration Plan

Two one-line CSS additions; deploy with the theme. Rollback = remove the two rules.

## Open Questions

- Which page did the merchant observe the overflow on? Assumed home (both carousels present). Verification should also spot-check collection and product pages at 375px width.
