# add-about-page-template — Tasks

## 1. Extend c-content-panel with subheading block

- [x] 1.1 Add a `subheading` block case to `sections/c-content-panel.liquid` rendering `<h3 class="ccp__subheading">` with escaped text, and the matching schema block entry (name "Subheading", single `title` text setting)
- [x] 1.2 Add the scoped `.ccp__subheading` rule to `assets/c-content-panel.css` (panel text color via `--ccp-text`, sized between `.ccp__heading` and body per design h3 `text-xl sm:text-2xl`, spacing consistent with existing ccp rhythm)
- [x] 1.3 Verify `page.technology.json` panels render unchanged (no subheading blocks — markup identical)

## 2. Build the About page template

- [x] 2.1 Create `templates/page.about.json` with `main` (`main-page`, disabled) and section keys `about_hero`, `about_story`, `about_video`, `about_quality`, `about_cta` in design order
- [x] 2.2 Configure `about_hero` (`image-with-text-overlay`): fixed height 720/480, full-width, center/center, `full image-overlay--bg-shadow` overlay, H1 heading "ABOUT NANGA" (60/40, `use_h1: true`) + enlarged tagline text block, mirroring `tech_hero`
- [x] 2.3 Configure `about_story` (`c-content-panel`): full-width band, white background (#ffffff, text #000000, body #4b5563), heading "Passion to Challenge the Impossible" + text block with the design's two founding-story paragraphs
- [x] 2.4 Configure `about_video` (`video`): external video `https://www.youtube.com/watch?v=1TCP8EZ1gAU`, `full_width: false`, screen-reader `video_description`, play-button block only (no heading/text)
- [x] 2.5 Configure `about_quality` (`c-content-panel`): full-width white band with heading "JAPAN QUALITY", four subheading+text pairs (Relentless Pursuit of Quality; Commitment to Domestic Washing; Manufacturing by Skilled Artisans; Precise and Prompt After-Care) with the design copy, and a link-style button "Explore Our Technology" → `/pages/technology`
- [x] 2.6 Configure `about_cta` (`rich-text`): centered, `color_scheme: "1"`, heading "Experience NANGA", supporting text, primary button "Shop Collection" → `/collections/down-jackets`, mirroring `tech_cta`

## 3. Verify

- [x] 3.1 Run `shopify theme check` (or theme-check) — no new offenses in changed files
- [x] 3.2 Validate template JSON parses and section/block keys are unique and referenced in `order`/`block_order`
- [x] 3.3 Confirm heading hierarchy: one h1 (hero), h2 band headings, h3 subsections in Japan Quality; YouTube iframe absent from initial page HTML (deferred behind play button)
