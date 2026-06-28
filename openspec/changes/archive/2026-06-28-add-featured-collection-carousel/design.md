## Context

The theme already ships a native, no-library carousel: the `<carousel-slider>` custom element defined in `assets/slider.js` (and `assets/main.js:3353`), used by `featured-collection.liquid`, `gallery.liquid`, media gallery, etc. It provides scroll-snap, prev/next buttons, lazy init via `window.initLazyScript`, automatic slide-span measurement, RTL support, and a `setCarouselState(false)` fallback when there are too few slides.

Two assets are reused verbatim:
- `snippets/product-card.liquid` — the lean NANGA card. It already accepts `badge_bg` / `badge_text` (for tag style), `show_vendor`, `show_border`, `image_fit`, and renders a 0.75 (3:4) aspect image with lazy loading. Its comment explicitly says to use it instead of `product-block` for this lean look.
- `snippets/icon-chevron-left.liquid` / `icon-chevron-right.liquid` — existing chevron icons.

The Figma reference (`context/NANGAv1/src/app/components/ProductCarousel.tsx` + `pages/Home.tsx`) uses Embla with `slidesToScroll` 1/2/3 and slide widths 80%/45%/30% (edge peek), `gap-6 sm:gap-8`, floating circular white arrows with shadow at ~1/3 height, a left heading + subtext, and a right-aligned "View All →" link. Embla itself is a prototype detail and is **not** ported.

The existing `featured-collection.liquid` differs from the design (centered heading, inline arrows beside the title, renders the feature-rich `product-block`). Per `CLAUDE.md`, shared/standard sections should not be mutated; a new variant section is the correct surface.

## Goals / Non-Goals

**Goals:**
- A new `sections/featured-collection-carousel.liquid` that matches the Figma layout using `product-card`.
- Reuse the existing `<carousel-slider>` engine — zero new JS, zero third-party libraries.
- Faithful heading (left + subtext), "View All" link (right on desktop, below on mobile), and floating circular arrows.
- Responsive cards-per-view with next-card peek and scroll-snap, configurable for desktop/mobile.
- Clean, scoped CSS that reuses existing variables/classes; no bloat.

**Non-Goals:**
- Modifying `featured-collection.liquid`, `product-card.liquid`, or `slider.js`.
- Porting Embla or adding any JS dependency.
- Adding quick-buy, swatches, hover image-swap, or reviews (those live in `product-block`).
- Building a new generic carousel component.

## Decisions

### Decision: New section instead of editing `featured-collection.liquid`
Create `sections/featured-collection-carousel.liquid`. **Why:** the existing section renders `product-block` and is a shared standard section used elsewhere; swapping its card or heading would be invasive and risk regressions (CLAUDE.md "add a variant rather than mutate the shared path"). A separate section also keeps both looks available to merchants.
**Alternatives considered:** add a "card style" toggle to the existing section — rejected as it forks heading/arrow/markup logic inside a shared file and complicates its schema.

### Decision: Reuse `<carousel-slider>` markup contract
Wrap the grid in `<carousel-slider class="carousel ...">` and follow the established DOM contract the engine expects: an outer `.slider`, inner `.slider__grid` (with `product-grid product-grid--per-row-N product-grid--carousel`), each card in a `.slider__item`, and a `.slider-nav` containing `button[name="prev"]` / `button[name="next"]`. This is exactly the structure `featured-collection.liquid` uses, so `slider.js` drives it with no JS changes.
**Why:** the engine already handles measurement, snap, bounds, lazy init, and the <2-slide fallback. **Alternatives considered:** hand-rolled scroll-snap + custom JS — rejected (duplicates working code, adds bloat).

### Decision: Cards rendered via `product-card` with section-level tag style
Loop the collection (limited, e.g. 20 for carousel) and call `{% render 'product-card', product: product, badge_bg: ..., badge_text: ..., show_vendor: section.settings.show_vendor %}`. Map the `tag_style` setting to badge colors: dark → `badge_bg:#000 badge_text:#fff`, light → `badge_bg:#fff badge_text:#000`. The product's own `c_product_badge` metafield still supplies the badge text.
**Why:** keeps the card snippet authoritative; section only passes presentation params it already supports.

### Decision: Floating circular arrows via scoped CSS, reusing `.slider-nav` buttons
Keep the engine's `button[name="prev"]/[next]` inside `.slider-nav`, but position them as absolute, circular, white, shadowed buttons overlapping the carousel's left/right edges at ~⅓ height — scoped to this section's class so other sliders are unaffected. Lean on the theme's existing floating-arrow precedent (`.slider-nav--floating`, `--slider-nav-btn-x-offset`, `main.css:7934`/`6327`) for variable names where helpful.
**Why:** matches Figma without new JS; scoping prevents leaking styles to other carousels.

### Decision: Peek + responsive via per-row classes and gap variables
Use `product-grid--per-row-{desktop}` and a mobile per-row setting plus `slider--edge-peek` / `slider--mobile-container-pad` (already in the codebase) so the next card peeks. Match the Figma gap (24px mobile / 32px desktop) through the grid gap CSS variable, scoped to the section.
**Why:** reuses existing peek/pad mechanics; the slider auto-measures slide span so per-row + gap is enough.

### Decision: Heading layout via flex row + responsive View All
Heading row is a flex container: left column (heading `h2` + description `p`), right column (`View All →` link, hidden on mobile). A second "View All" link renders below the carousel, shown only on mobile — mirroring `Home.tsx`. Scoped CSS handles the desktop/mobile visibility swap.

## Risks / Trade-offs

- **Engine DOM contract drift** → Mitigation: copy the exact class/attribute structure from the working `featured-collection.liquid` so `slider.js` binds correctly; verify in theme editor and on a real collection.
- **Arrow overlap covering card content / clipping** → Mitigation: arrows sit over the image area (~⅓ height) with adequate z-index and container padding; verify they don't overlap text or get clipped by `overflow` on the slider; ensure tap targets ≥40px.
- **Style leakage to other carousels** → Mitigation: all new CSS is scoped under the section's root class (`.section-id-{{ section.id }}` or a dedicated section class); reuse variables rather than overriding global `.slider-nav`.
- **Few-product edge case** → Mitigation: rely on the engine's `setCarouselState(false)` (<2 slides) and confirm the static-row layout still looks correct.
- **CSS delivery/bloat** → Mitigation: add a small dedicated stylesheet loaded only by this section (lazy/deferred per theme convention) or a tightly scoped block; reuse existing classes/vars; no duplicate rules.
- **Accessibility** → Mitigation: visually-hidden labels on arrows (reuse `general.slider.previous/next` locale keys), focusable buttons, card links keep semantic order.

## Open Questions

- Should `cards-per-row` reuse the global `settings.prod_thumb_mob_per_row` for mobile (as `featured-collection.liquid` does) or expose a dedicated section-level mobile setting? (Leaning dedicated for design fidelity.)
- Preferred CSS home: a new `assets/featured-collection-carousel.css` loaded by the section, vs. appending a scoped block to an existing stylesheet. (Leaning new scoped asset for isolation and lazy loading.)
