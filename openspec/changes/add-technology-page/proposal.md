# add-technology-page

## Why

The NANGA design includes a Technology page (`context/NANGAv1/src/app/pages/Technology.tsx`) that has no counterpart in the theme. Its six bands decompose into four that existing sections already render (hero, text+image split, centered CTA) and two genuinely new patterns — an icon-tile feature grid and a tinted content panel with border-left stat columns — that no current section can produce. Building it as a section-composed page template (like `page.story.json`) makes the hero/CTA recipe directly reusable for the About, Journal, and Knowledge pages that share the same patterns.

## What Changes

- **`sections/c-icon-features.liquid`** ("C Icon features") — new section: a responsive grid of centered feature columns, each with an icon in a light-gray square tile (theme icon select with per-block image override), a title, and short text. Settings follow house conventions: columns (desktop/mobile), color scheme, full width.
- **`sections/c-content-panel.liquid`** ("C Content panel") — new section: a padded panel with per-section background and text color pickers (design needs both a gray-50 panel and a black band; neither maps to a global color scheme without side effects). Content is composed from blocks: heading, text, stat (label + description with the design's 2px left-border treatment, in responsive columns), and button (primary/secondary/arrow-link styles, reusing the `split-content` link idiom).
- **`snippets/icon.liquid`** — additive only: new `droplet`, `thermometer`, and `mountain` icon cases required by the design's feature grid (existing `feather` covers the fourth).
- **`templates/page.technology.json`** — new page template composing: `image-with-text-overlay` hero (config mirroring `page.story.json`: fixed height, full tint, centered H1 + subtitle), `split-content` UDD band (constrained, image right), `c-icon-features` (4 features), `c-content-panel` Fill Power instance (gray panel + 3 stats), `c-content-panel` Responsible Sourcing instance (black band + arrow link), and `rich-text` CTA (centered, primary button). All content hardcoded as defaults from the Figma copy, editable in the theme editor.
- **No edits** to any stock section (`rich-text`, `image-with-text-overlay`, `multi-column`) or to `split-content` — they are reused purely via template settings.

## Capabilities

### New Capabilities
- `icon-features-section`: a reusable icon-tile feature grid section (icon/title/text columns) configurable from the theme editor.
- `content-panel-section`: a reusable padded content panel section with per-section colors and heading/text/stat/button blocks.
- `technology-page`: the composed Technology page template reproducing the design from existing + new sections.

### Modified Capabilities
- `reusable-icon-snippet`: the icon set gains `droplet`, `thermometer`, and `mountain` (additive; existing icons and callers unchanged).

## Impact

- **New files**: `sections/c-icon-features.liquid`, `sections/c-content-panel.liquid`, `templates/page.technology.json`, plus one scoped CSS asset per new section (or shared `assets/main.css` card-style scoped rules — decided in design).
- **Modified files**: `snippets/icon.liquid` (three additive `when` branches only).
- **Shared behavior**: no JS; no changes to stock sections or existing templates; new sections are net-new schema surface with `"C ..."` names and `c-` filenames per repo convention.
- **Merchant setup**: create a "Technology" page in admin and assign the `page.technology` template.
- **Dependencies**: none added. Sequencing note: `add-split-content-section` (active, 17/18) should be archived before or alongside this change since the template references `split-content`.
