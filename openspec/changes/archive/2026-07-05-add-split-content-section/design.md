## Context

The NANGA theme is the Clean Canvas "Symmetry" Online Store 2.0 theme. The Figma home design
(`context/NANGAv1/src/app/pages/Home.tsx`, lines 178–205) includes a "Split Content" band: a
full-bleed `object-cover` image on one half and a `bg-gray-50` text panel on the other, stacking
on mobile, with a heading, two paragraphs, and an "Our Story →" link.

The theme already ships `sections/image-with-text.liquid`, but it is a different layout (a
`max-width`-constrained image with overlap/fade decoration inside `.container`, no full-bleed
fill, no colored panel) and is shared by `templates/page.returns.json` and
`templates/page.story.json`. CLAUDE.md mandates minimally-invasive, reuse-safe changes, so we
must not reshape the shared stock section. The repo already establishes the right pattern: the
home carousels are a custom section (`featured-collection-carousel`, named "C Featured
collection") built to match the design while the stock `featured-collection` stays untouched.

Existing theme conventions we reuse:
- `full_width` → `container container--no-max` vs `container` (used by slideshow, carousel,
  image-with-text-overlay).
- `use-color-scheme use-color-scheme--{1,2}` for panel backgrounds; scheme 1's
  `color_scheme_1_col` is `#f7f7f7` (≈ Tailwind `gray-50`), matching the design panel.
- Flexible layout / column utilities (`flexible-layout`, `column column--half`,
  `column--order-push-desktop`) for the side-by-side + reversible layout.
- Block model (heading / subheading / text / button) and the `link` button style that renders as
  `small-feature-link` with an arrow.

## Goals / Non-Goals

**Goals:**
- A new `sections/split-content.liquid` ("C Image with text") matching the Figma split layout.
- Full-bleed `object-cover` image filling its half; color-scheme text panel filling the other.
- `full_width` toggle for edge-to-edge vs page-width; reversible image position; mobile stack.
- Reuse existing CSS variables/classes; add only minimal scoped CSS for the image fill/panel.
- A preset and a configured instance wired into `templates/index.json`.

**Non-Goals:**
- Modifying the stock `sections/image-with-text.liquid` or its templates.
- The stock section's second/overlapping image, fade decoration, or countdown/icon/image blocks.
- New JS, frameworks, or dependencies.

## Decisions

**1. New section file instead of editing the stock one.**
The stock `image-with-text` is shared by two page templates and has a materially different
layout. Reshaping it would risk those pages and violate the reuse rule. Building a sibling
section mirrors the existing "C" carousel precedent and keeps blast radius to the new file plus
one `index.json` instance. *Alternatives considered:* (a) add a "layout style" toggle to the
stock section — rejected as it bloats a shared file and increases regression risk on
returns/story; (b) reuse `image-with-text-overlay` — rejected, that overlays text on the image
rather than a side-by-side split.

**2. Full-bleed image via column + object-cover, not the `image-overlap` wrapper.**
The design needs the image to fill its half edge-to-edge. We render the image directly in a
half column with `object-cover` (and `loading="lazy"` for this below-the-fold band), instead of
the stock `image-overlap` max-width wrapper. Minimal scoped CSS handles the fill and equal-height
behavior. *Alternative:* CSS `background-image` on the column — rejected to keep responsive
`image_url`/`srcset` and proper `<img>` semantics per CLAUDE.md performance rules.

**3. Color scheme drives the panel; default to scheme 1.**
Reusing `use-color-scheme--*` means the panel background/typography are editor-controlled via the
theme's global schemes (scheme 1 ≈ `#f7f7f7` matches `bg-gray-50`). This avoids per-section color
pickers and keeps the section consistent with the rest of the theme.

**4. Reuse the block model (heading / subheading / text / button), trimmed.**
Editors compose the panel exactly like the design (H2 + paragraphs + link CTA) using familiar
blocks. We drop the stock section's icon / inline-image / countdown blocks as out of scope for
this band, keeping the schema lean.

**5. Layout via existing flexible-layout/column utilities.**
`flexible-layout` + `column column--half` gives the 50/50 split and mobile stack for free, and
`column--order-push-desktop` provides the reversible image position — same primitives the stock
section already uses, so behavior is predictable.

## Risks / Trade-offs

- **Equal-height image/panel on desktop** → the half-column + `object-cover` must stretch to the
  panel's content height. Mitigation: scoped CSS making the image column/img `height:100%` within
  the flex row; verify in the theme editor with short and long panel copy.
- **Full-bleed image on very wide viewports may over-crop** → mitigation: request appropriately
  wide `srcset` candidates and rely on `object-cover` centering; expose mobile height so editors
  can tune the stacked crop.
- **Scoped CSS leaking to other sections** → mitigation: namespace styles under a
  section-specific class/`#section-id-{{ section.id }}` as other sections do; reuse existing
  utilities first and add the minimum new CSS.
- **Leftover stock demo `image-with-text` instances in `index.json`** → the home order still
  carries original demo sections; we only add our instance (and may remove the redundant stock
  home instance) without touching `page.returns` / `page.story`.

## Migration Plan

1. Add `sections/split-content.liquid` (markup + schema + preset). No effect until referenced.
2. Add a configured instance to `templates/index.json` after the featured carousels; optionally
   remove the redundant stock `image-with-text` home instance from the order.
3. Validate in the theme editor: full-width vs page-width, image left/right, mobile stack,
   color scheme, and that `page.returns` / `page.story` are visually unchanged.
4. Rollback: remove the section instance from `index.json` (and the file); stock section and
   other templates are untouched throughout.

## Open Questions

- Final default `color_scheme` value (assume scheme 1 unless design tokens dictate otherwise).
- Whether to also offer a fixed desktop image height in addition to "adapt to panel".
- Whether to remove the leftover stock `image-with-text` home instance now or in a later cleanup.
