# add-about-page-template

## Why

The NANGA design includes an About page (`context/NANGAv1/src/app/pages/About.tsx`) with no counterpart in the theme — and the Technology template already links to `/pages/about` (`tech_sourcing` button), so the link is currently dead. The page decomposes almost entirely into the section vocabulary proven on the Technology and Knowledge templates; the only gap is that its "Japan Quality" band needs h3 subheadings under an h2, which `c-content-panel` cannot yet express (its heading block renders only `<h2>`, and Shopify `richtext` settings strip heading tags).

## What Changes

- **`templates/page.about.json`** — new page template composing: `image-with-text-overlay` hero (fixed height, full tint, centered "ABOUT NANGA" H1 + tagline, mirroring `page.technology.json`), `c-content-panel` story band (white full-width band: "Passion to Challenge the Impossible" heading + two paragraphs), stock `video` section (external YouTube brand video `1TCP8EZ1gAU`, click-to-play with cover image — deferred load instead of the design's raw iframe), `c-content-panel` Japan Quality band (white band: h2 + four h3 subsections with paragraphs + "Explore Our Technology" arrow link to `/pages/technology`), and `rich-text` CTA (centered, color scheme 1 gray band ≈ design `bg-gray-50`, primary button to the shop collection). All copy hardcoded as defaults from the design, editable in the theme editor.
- **`sections/c-content-panel.liquid`** — additive only: new `subheading` block type rendering `<h3 class="ccp__subheading">`, composable between text blocks. Existing block types, settings, and the Technology template's instances are unchanged.
- **`assets/c-content-panel.css`** — one scoped `.ccp__subheading` rule matching the design's h3 treatment.
- **No edits** to any stock section (`image-with-text-overlay`, `video`, `rich-text`) — reused purely via template settings.

## Capabilities

### New Capabilities
- `about-page`: the composed About page template reproducing the design from existing sections plus the extended content panel.

### Modified Capabilities
- `content-panel-section`: the composable block set gains a `subheading` (h3) block so panels can express multi-level long-form content (additive; existing blocks and instances unchanged).

## Impact

- **New files**: `templates/page.about.json`.
- **Modified files**: `sections/c-content-panel.liquid` (one additive block case + schema entry), `assets/c-content-panel.css` (one scoped rule).
- **Shared behavior**: `c-content-panel` is also used by `page.technology.json` — the change is additive block surface only, so existing instances render identically. No JS added; no stock sections touched.
- **Merchant setup**: create an "About" page in admin, assign the `page.about` template, and set the hero image and video cover image in the theme editor. The existing `page.story.json` demo template remains untouched.
