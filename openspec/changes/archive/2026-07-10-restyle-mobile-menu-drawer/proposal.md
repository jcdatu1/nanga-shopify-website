# restyle-mobile-menu-drawer

## Why

The NANGA design's mobile menu (`context/NANGAv1/src/app/components/Header.tsx`) is white-on-black — black panel, white links and icons, dark `gray-800` dividers — with a "🔍 Search" entry at the bottom of the menu behind a top divider. The theme's mobile navigation drawer instead inherits the desktop nav colors (`--main-nav-bg` / `--main-nav-link-col`, currently light), and the search loupe sits in the mobile header bar next to the hamburger rather than inside the menu. Two of the merchant's requested changes land here: white letters on a black drawer (including the search and X icons), and the search loupe moved to the bottom of the drawer.

## What Changes

- **`assets/main.css`** — scoped restyle of `.mobile-navigation-drawer`: override the nav color variables at the drawer root (`--main-nav-bg: #000`, `--main-nav-link-col: #fff`, divider color to the design's dark gray) so the panel, tier-2/3 sub-panels, scroll-fade gradients, X/back icons, and footer content all flip together. Desktop navigation is untouched because the variables are only overridden inside the drawer scope. Plus styles for the new search row (loupe icon + "Search" label, top divider, white).
- **`sections/header.liquid`** — add a search row to the mobile drawer template (the `<script type="text/template">` that `main.js` instantiates), rendered only when the header's search setting is enabled: an `<a href="{{ routes.search_url }}">` with the existing `icon-search` snippet and a translated label, placed after the tier-1 menu at the bottom of the drawer. Also scope the header bar's mobile search loupe to desktop-relevant layouts only (hidden below 768px) — the loupe "moves" into the drawer.
- **`assets/main.js`** — one small delegated click handler where the drawer's other handlers are already wired: tapping the drawer search row closes the drawer and opens the theme's existing search overlay (same behavior the header loupe has today). The drawer lives outside `<page-header>`, so the existing `.show-search-link` delegate cannot pick it up. No-JS fallback: the row is a plain link to the search page.
- **No changes** to desktop navigation colors, the search overlay itself, or `theme.liquid`.

## Capabilities

### New Capabilities

- `mobile-menu-drawer`: the mobile navigation drawer's NANGA presentation — black panel with white text/icons and dark dividers — and its bottom search entry replacing the header-bar loupe on mobile.

### Modified Capabilities

(none — the header/drawer had no existing spec)

## Impact

- **Modified files**: `sections/header.liquid` (drawer template + loupe visibility class), `assets/main.css` (drawer-scoped rules), `assets/main.js` (one delegated handler in the existing drawer wiring).
- **Behavior**: mobile users find search at the bottom of the menu instead of the header bar; the drawer renders black with white content. Desktop header and navigation are visually unchanged.
- **Reuse risk (checked)**: `--main-nav-bg`/`--main-nav-link-col` are shared with the desktop nav — hence variable overrides scoped to `.mobile-navigation-drawer` rather than changing the variables' definitions or theme settings.
- **Merchant setup**: none; follows the existing "Enable search" header setting.
