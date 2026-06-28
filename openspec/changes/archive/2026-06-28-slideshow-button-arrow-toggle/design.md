## Context

The Symmetry "Slideshow" section ([sections/slideshow.liquid](../../../sections/slideshow.liquid)) renders up to 8 `Slide` blocks. Each slide can have two CTA buttons (`button_label_1`/`button_url_1`, `button_label_2`/`button_url_2`). Buttons render with class `text-overlay__button btn btn--secondary` in one of two branches depending on `wrap_slide_with_link`:

- `<span class="text-overlay__button …">label</span>` when the whole slide is wrapped in a single `<a>` link.
- `<a class="text-overlay__button …" href="…">label</a>` when each button has its own URL.

The hero figma reference ([context/NANGAv1/src/app/pages/Home.tsx](../../../context/NANGAv1/src/app/pages/Home.tsx)) shows a CTA with a trailing line-arrow `→` (lucide `ArrowRight`) and a hover nudge. The theme already ships `snippets/icon-chevron-right.liquid`, but that is a chevron (`›`), visually different from the figma's line-arrow, and the existing icon snippets are one-file-per-glyph.

## Goals / Non-Goals

**Goals:**
- Per-button toggle to show a right-arrow icon inside Slideshow CTA buttons.
- A reusable `icon` snippet keyed by an `icon` parameter, so future icons live in one file.
- Match the hero's line-arrow `→` glyph.
- Zero visual change to existing slideshows (default off).
- Smallest precise footprint: only the Slideshow section, one new snippet, and minor CSS.

**Non-Goals:**
- Replacing or consolidating the existing `icon-chevron-*` snippets.
- Adding the arrow to any section other than Slideshow.
- The hover micro-interaction (gap-grow / arrow slide) — optional polish, not required by the spec.
- Adding more than the `arrow-right` icon in this change (the snippet is built to extend, but only `arrow-right` is registered now).

## Decisions

### Decision: Extend the existing `icon` snippet (discovered during apply)

The theme already ships `snippets/icon.liquid` — a reusable snippet that `case`s on an `icon` parameter, renders a single inline SVG wrapper, and emits `icon icon--<size> icon--type-<icon>` classes (~40 Tabler-style icons registered). It already satisfies the "reusable, parameter-driven icon snippet" intent, so we **extend it** rather than create a new file:

- Add an `arrow-right` case using the lucide `ArrowRight` path (`M5 12h14` + `m12 5 7 7 -7 7`), inheriting the wrapper's `fill="none" stroke="currentColor"` so it picks up button text color.
- Add an optional `stroke_width` override to the shared wrapper (`{% if stroke_width %}…{% elsif size == 'small' %}1.5{% else %}1{% endif %}`) — backward compatible since no existing caller passes it. The arrow is rendered with `stroke_width: 2` to match the figma's lucide weight.

- **Why not a new `icon-arrow-right.liquid`**: it would duplicate the mechanism that already exists; extending is strictly smaller.
- **Why not extend/replace `icon-chevron-*`**: those one-off snippets are referenced by existing nav markup; leaving them untouched keeps the blast radius minimal.
- **`size`/`class` note**: the existing snippet's `size` is a keyword (`small`/`medium`) controlling a class + stroke, not a numeric px, and it has no `class` passthrough. We work within that convention — styling is done via the emitted `icon--type-arrow-right` class instead of a passthrough.

### Decision: Two independent per-button checkboxes, default off

Add `show_button_arrow_1` and `show_button_arrow_2` to the Slide block schema, each placed directly under its button's URL field so the relationship is obvious. Default `false`.

- **Why per-button over per-block**: the user wants independent control; a slide's primary vs secondary CTA may differ.
- **Why default off**: preserves the current appearance of every existing slideshow — no breaking visual change.

### Decision: Render the icon in both button branches

In [sections/slideshow.liquid:156-174](../../../sections/slideshow.liquid#L156-L174), after each button's escaped label, conditionally render `{% render 'icon', icon: 'arrow-right' %}` guarded by the matching toggle — in both the `<span>` and `<a>` branches so behavior is identical regardless of link wrapping.

### Decision: Minimal CSS for spacing/alignment

Add a small rule (icon class + inline-flex alignment + left margin/gap) to the theme stylesheet so the icon sits inline after the label and inherits color/size. No hover animation in scope.

## Risks / Trade-offs

- **Inconsistency with existing chevron icon style** → Accept: the figma is the source of truth and specifies a line-arrow; the chevron snippet stays for nav controls.
- **Schema setting sprawl (2 new settings × block)** → Low impact; placed contextually under each button to stay legible.
- **Icon color/size not matching button** → Mitigated by `stroke="currentColor"` and a CSS rule tied to the button's font-size.
- **Theme updates from Shopify could overwrite `slideshow.liquid`** → Out of scope here; the change is additive and re-appliable.

## Open Questions

- None blocking. Hover micro-interaction can be added later if desired.
