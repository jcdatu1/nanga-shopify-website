## Why

The NANGA Figma home design includes a "Split Content" image-with-text band (image on one
half, a colored text panel on the other) that introduces the brand story before the category
banner. The theme's stock `image-with-text` section is a different layout (constrained,
max-width image with overlap/fade decoration, no full-bleed image and no colored text panel)
and is shared by `page.returns` and `page.story`, so it cannot be reshaped without risking
those pages. We need a dedicated section that matches the design and can run either edge-to-edge
or constrained to the page width.

## What Changes

- Add a new custom section `sections/split-content.liquid` ("C Image with text") implementing
  the Figma split layout: a full-bleed `object-cover` image filling one half and a color-scheme
  text panel filling the other, stacking vertically on mobile.
- Provide section settings that mirror existing theme conventions: `full_width` toggle
  (edge-to-edge vs. constrained to page width), `image_position` (left/right), `color_scheme`
  for the text panel, `text_alignment`, and desktop/mobile image height controls.
- Reuse the established block model (heading, subheading, text, button) so editors compose the
  panel content, including a link-style "Our Story →" call to action.
- Add a section preset and a configured instance to `templates/index.json` placed after the
  featured-collection carousels (replacing the leftover stock demo `image-with-text` instance
  in the home flow).
- Leave the stock `sections/image-with-text.liquid` untouched so `page.returns` and `page.story`
  are unaffected.

## Capabilities

### New Capabilities
- `split-content-section`: A reusable image-with-text section presenting a full-bleed image
  beside a color-scheme text panel, with full-width and page-width layout options and
  configurable content blocks.

### Modified Capabilities
<!-- None: stock image-with-text is intentionally left unchanged. -->

## Impact

- **New file**: `sections/split-content.liquid` (section markup + schema + preset).
- **CSS**: reuse existing theme classes/variables (`container`/`container--no-max`,
  `use-color-scheme--*`, flexible layout/column utilities); add only minimal scoped styles for
  the full-bleed image fill and panel padding if existing utilities don't cover it.
- **Template**: `templates/index.json` gains a new section instance in the home order.
- **No new dependencies**, no JS, no impact to stock `image-with-text` or its templates
  (`page.returns`, `page.story`).
