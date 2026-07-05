## 1. Icons: additive registrations

- [x] 1.1 In `snippets/icon.liquid`, add `droplet`, `thermometer`, and `mountain` `when` branches using lucide paths, stroke-styled to match the existing set (`currentColor`, same stroke-width handling); verify `arrow-right`/`feather` output is untouched.

## 2. C Icon features section

- [x] 2.1 Create `sections/c-icon-features.liquid`: `.cif`-scoped markup rendering `feature` blocks as centered columns (icon tile → title → text), icon via `{% render 'icon' %}` with optional `image_picker` override (responsive `image_url` + lazy loading), tile omitted when neither is set.
- [x] 2.2 Add schema: name "C Icon features", `feature` block (icon select incl. droplet/thermometer/feather/mountain, image override, title, text), settings for columns desktop (default 4) / mobile (default 2), color scheme, full width; preset with four design-default features.
- [x] 2.3 Create `assets/c-icon-features.css` (loaded via `lazy-stylesheet-attrs`): responsive grid (4/2 per settings), 64px `#f3f4f6` icon tile, centered typography with `#4b5563` body text; all rules scoped under `.cif`.

## 3. C Content panel section

- [x] 3.1 Create `sections/c-content-panel.liquid`: `.ccp`-scoped panel with `background_color` / `text_color` pickers (defaults: design gray panel), full-width vs constrained mode, rendering `heading`, `text`, `stat`, and `button` blocks in order; consecutive `stat` blocks grouped into one responsive row; `link`-style button rendered as `small-feature-link` + `arrow-right` icon.
- [x] 3.2 Add schema: name "C Content panel", the four block types with theme-conventional setting IDs (`title`, `text`, `button_label`, `button_link`, `button_style`), section settings (colors, full width, content width); preset with heading + text + three stats.
- [x] 3.3 Create `assets/c-content-panel.css`: panel padding per design (`p-8`/`p-12` equivalents), stat columns (3-up desktop, stacked mobile) with 2px `currentColor` left border + left padding, arrow-link gap 8px → 12px hover (200ms, mirroring `.fcc__view-all`); all rules scoped under `.ccp`.

## 4. Technology page template

- [x] 4.1 Create `templates/page.technology.json` with disabled `main-page` and the six instances in design order: `image-with-text-overlay` hero (fixed 720/400, `full image-overlay--bg-shadow`, centered H1 "Technology" + subtitle), `split-content` UDD band (constrained, image right, heading + three paragraphs), `c-icon-features` (four design features), `c-content-panel` Fill Power (gray, heading + two paragraphs + three FP stats), `c-content-panel` Responsible Sourcing (black bg, white text, heading + paragraphs + arrow link to `/pages/about`), `rich-text` CTA (centered, heading + text + primary button to the down-jackets collection). All Figma copy hardcoded as defaults.
- [x] 4.2 Validate the template JSON parses and every referenced section type/setting ID exists in its schema.

## 5. Verify against the design

- [ ] 5.1 Theme editor: assign `page.technology` to a test page; confirm all six bands render in order with the design copy, and each section's settings edit only its own band.
- [ ] 5.2 Compare against `Technology.tsx`: hero tint + centered type, UDD split proportions, 4/2-column feature grid with gray icon tiles, gray stats panel with bordered FP columns, black band with visible arrow-link hover (8px → 12px), centered CTA.
- [x] 5.3 Confirm no regressions: stock `rich-text` / `image-with-text-overlay` / `multi-column`, `split-content`, existing icons via `snippets/icon.liquid`, and existing templates (`index`, `page.story`) unchanged in behavior.
- [ ] 5.4 Performance pass: no new JS, stylesheets lazy-loaded, images responsive + lazy; Lighthouse spot-check on the new page.
