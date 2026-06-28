## 1. Section scaffold

- [x] 1.1 Create `sections/split-content.liquid` with the Liquid markup skeleton (section wrapper, container/full-width handling, two halves: image column + text panel column)
- [x] 1.2 Add the `{% schema %}` block with name "C Image with text", `class`, and `disabled_on` aside group (mirroring stock section conventions)

## 2. Layout & image

- [x] 2.1 Implement the `full_width` toggle: wrap content in `container` when off, `container container--no-max` when on
- [x] 2.2 Implement the side-by-side split with `flexible-layout valign-middle` + `column column--half`, stacking on mobile
- [x] 2.3 Implement reversible image position with `column--order-push-desktop` driven by `image_position`
- [x] 2.4 Render the image full-bleed via the existing `container__breakout img-fill-half-section` pattern (responsive `image` snippet, placeholder when no image is set)
- [x] 2.5 Reuse existing CSS (no new CSS): `img-fill-half-section` already provides desktop equal-height fill; mobile renders the stacked image at natural aspect ratio. (Per-section height controls dropped as unnecessary bloat — see design/spec update.)

## 3. Text panel & blocks

- [x] 3.1 Apply the color-scheme classes (`use-color-scheme use-color-scheme--{{ color_scheme }}`) to the text panel with appropriate padding (`fully-padded-row--medium` / `feature-text-paired(-wide)`)
- [x] 3.2 Implement block rendering for heading, subheading, text, and button (including the `link` button style with `small-feature-link` arrow affordance)
- [x] 3.3 Apply `text_alignment` to the panel content

## 4. Settings & preset

- [x] 4.1 Define section settings: `image`, `image_link`, `full_width`, `image_position`, `color_scheme` (default 1), `text_alignment` (default left). (Desktop/mobile height settings dropped — handled by the half-fill pattern.)
- [x] 4.2 Define the block settings (heading w/ `use_h1`, subheading, text w/ enlarge option, button w/ label/link/style defaulting to `link`)
- [x] 4.3 Add a `presets` entry seeding heading + text + button blocks

## 5. Home template wiring

- [x] 5.1 Add a configured `split-content` section instance to `templates/index.json` after the featured-collection carousels, with default content reflecting the Figma copy
- [x] 5.2 Remove the redundant leftover stock `image-with-text` home instance from the order (replaced by the new instance)

## 6. Verification

- [x] 6.1 Validate `templates/index.json` parses and the new instance sits after the carousels; theme-check reports no offenses for `sections/split-content.liquid`
- [x] 6.2 Confirm `page.returns` and `page.story` (stock `image-with-text`) and the stock section file are untouched (git status)
- [ ] 6.3 Visual QA in the theme editor: full-width vs page-width, image left/right, mobile stack, color scheme, and link CTA (requires running theme — pending user)
