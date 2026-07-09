## 1. Drawer black-on-white restyle

- [ ] 1.1 In `assets/main.css`, add a drawer-scoped variable override block: `.mobile-navigation-drawer { --main-nav-bg: #000; --main-nav-link-col: #fff; --heading-divider-col: #1f2937; }`, with a comment noting the NANGA design source and why the override is scoped (variables shared with desktop nav)
- [ ] 1.2 Audit the rendered drawer for descendants that hardcode light backgrounds/dark text instead of using the variables (tier-2/3 panels, `navigation__mobile-products` strip, footer clones: inline menu, localization selector, social icons) and add scoped overrides for any that don't flip
- [ ] 1.3 Verify the X (close), back chevron, and children-toggle icons render white via `color: inherit`, and the mobile-header divider uses the overridden divider color

## 2. Search row at the bottom of the drawer

- [ ] 2.1 In `sections/header.liquid`, add the search row to the mobile drawer template after the tier-1 nav links, gated on `section.settings.enable_search`: `<a class="mobile-nav-search-link" href="{{ routes.search_url }}">` containing `{% render 'icon-search' %}` and the translated `sections.header.search` label
- [ ] 2.2 In `assets/main.css`, style the row per the design: top divider (`--heading-divider-col`), left-aligned loupe + label, white text, tap-target padding consistent with the drawer's tier-1 links; include it in the drawer's staged-reveal rules alongside its siblings
- [ ] 2.3 In `assets/main.js`, where the drawer's delegated handlers are wired, add a `.mobile-nav-search-link` click delegate: prevent default, close the drawer (same class handling as the header-shade close), then open the search overlay (add `show-search`, `theme.manuallyLoadImages`, trap focus in `.main-search__input`, mirroring the existing `.show-search-link` delegate)

## 3. Header-bar loupe on mobile

- [ ] 3.1 Hide the `.logo-area__left` search link below 768px in `assets/main.css`, scoped so desktop inline/underneath layouts keep their current search link; confirm the right-side (`.logo-area__right`) search link's mobile behavior is unchanged

## 4. Verification

- [ ] 4.1 With `shopify theme dev` on a mobile viewport: open the drawer — black panel, white links/icons, dark dividers, including tier-2/3 panels and footer clones; search row at the bottom; tapping it closes the drawer and opens the search overlay with the input focused; Esc/close returns cleanly
- [ ] 4.2 Confirm no mobile loupe in the header bar, desktop header and navigation are pixel-identical, and the drawer with JS-disabled search row navigates to the search page
