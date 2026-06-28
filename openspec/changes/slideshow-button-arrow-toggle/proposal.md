## Why

The Symmetry "Slideshow" section renders up to two call-to-action buttons per slide, but they are plain text buttons. The NANGA hero design (figma reference) shows CTA buttons with a trailing right-arrow (`→`) glyph that signals "go". Merchants currently cannot reproduce that look on slideshow buttons, so the homepage hero and the slideshow are visually inconsistent.

## What Changes

- Add a per-button toggle on each Slideshow `Slide` block — `show_button_arrow_1` and `show_button_arrow_2` — that controls whether a right-arrow icon is rendered after the button label.
- When a toggle is on, render a right-arrow SVG inside that button, matching the hero figma's line-arrow (`→`).
- Register an `arrow-right` icon in the theme's existing reusable `icon` snippet (`snippets/icon.liquid`), which already dispatches on an `icon` parameter — extending it rather than adding a new file.
- Default both toggles to **off** so existing slideshows render unchanged (no breaking visual change).

## Capabilities

### New Capabilities
- `slideshow-button-arrow`: Per-button arrow-icon toggles on Slideshow slide blocks, rendering a right-arrow inside the CTA button when enabled.
- `reusable-icon-snippet`: Registering `arrow-right` (lucide path) in the theme's existing parameter-driven `icon` snippet, plus an optional `stroke_width` override, so the arrow is reusable across the theme.

### Modified Capabilities
<!-- None: no existing OpenSpec specs to amend (openspec/specs/ is empty). -->

## Impact

- `sections/slideshow.liquid`: schema gains two checkbox settings on the `image` (Slide) block; button markup renders the icon in both button-render branches (the `<span>` wrapped-link branch and the `<a>` per-button-URL branch).
- `snippets/icon.liquid`: existing reusable snippet extended with an `arrow-right` case and an optional `stroke_width` override (backward compatible).
- A small CSS addition (existing theme stylesheet) for icon spacing/alignment inside the button.
- No data, API, or dependency changes. Existing slideshows are unaffected because both toggles default off.
