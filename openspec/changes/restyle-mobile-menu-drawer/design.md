# restyle-mobile-menu-drawer — Design

## Context

The drawer's markup is a `<script type="text/template">` inside `sections/header.liquid` (lines ~396–448); `main.js` clones it, appends announcement-bar clones (inline menu, localization, social) into `.mobile-navigation-drawer__footer`, and inserts the drawer **after** `.section-header` — i.e. outside `<page-header>`. Its colors come from `var(--main-nav-bg)` / `var(--main-nav-link-col)` (`assets/main.css:3081-3082`), variables shared with the desktop navigation; the tier-2/3 slide-in panels and scroll-fade gradients derive from the same variables, and the X/back icons already use `color: inherit`. The search overlay is opened by a click delegate for `.show-search-link` bound on `page-header` (`assets/main.js:3912`) — it adds `show-search` to `<body>` and traps focus in the search input. The design reference (`Header.tsx:59-113`) shows the mobile menu as black (`bg-black`), white links, `gray-800` (#1f2937) dividers, and a final "Search" row (small loupe + label) after a top divider.

## Goals / Non-Goals

**Goals:**
- Drawer visually per the design: black panel, white links, icons (X, back chevron, search loupe), and dark dividers — including the tier-2/3 sub-panels and the footer clones.
- Search entry at the bottom of the drawer menu; header-bar loupe hidden on mobile so search lives in one place.
- Tapping the drawer search row behaves like the loupe does today: drawer closes, search overlay opens (with its input focused).
- Zero impact on desktop navigation, desktop search link, or the overlay itself.

**Non-Goals:**
- No restyling of the mobile header bar (logo/hamburger/cart row) — the design's fully black header is a separate decision the merchant hasn't requested.
- No changes to theme settings or their defaults (a settings change would repaint the desktop nav too).
- No redesign of the announcement-bar clones beyond inheriting the new colors.

## Decisions

- **Flip colors by overriding the CSS variables at the drawer root**, not by new per-element rules: `.mobile-navigation-drawer { --main-nav-bg: #000; --main-nav-link-col: #fff; --heading-divider-col: #1f2937; }`. Everything inside — panel background, tier-2/3 panels, fade gradients, header divider, icons via `color: inherit` — follows automatically, and the desktop nav (outside this scope) keeps the original variable values. Alternative rejected: changing the variables' source (theme settings / `:root`) repaints the desktop nav; hand-styling each descendant duplicates what the variables already coordinate.
- **Audit-and-patch pass for hardcoded colors.** Any drawer-scoped rule that hardcodes a light background or dark text (rather than using the variables) gets an explicit override in the same block. Verification includes the localization dropdown and social icons cloned into the footer.
- **Search row lives in the drawer template in `header.liquid`, after the tier-1 nav (before `navigation__mobile-products`/footer), gated on `section.settings.enable_search`.** Putting it in the template (not injected by JS) keeps markup in Liquid where translations (`'sections.header.search' | t`) and the `icon-search` snippet are available, and it participates in the drawer's staged reveal animation like its siblings. Styled as the design's bottom row: top divider (`--heading-divider-col`), loupe + label, white.
- **Dedicated class (e.g. `mobile-nav-search-link`), not `.show-search-link`.** The page-header delegate can't see the drawer (it's outside `page-header`), and reusing the class would only invite confusion about why it doesn't behave the same. A small delegate added in `main.js` where the drawer's back/children-toggle handlers are wired (~line 2128) does: `preventDefault` → close the drawer (same class removals the header-shade handler uses: `reveal-mobile-nav`, then delayed `enable-mobile-nav-transition` cleanup) → open the overlay (add `show-search` to body, `theme.manuallyLoadImages(mainSearch)`, trap focus in the input — mirroring `main.js:3912-3920`).
- **No-JS / failure fallback is navigation.** The row is `<a href="{{ routes.search_url }}">`, so without JS it lands on the search page rather than doing nothing.
- **Hide the header-bar loupe under 768px via CSS** (media query on the existing `.logo-area__left` search link), leaving all desktop layout variants (`inline`, `underneath`) untouched. The right-side search link's `visually-hidden-mobile` text behavior is unaffected.

## Risks / Trade-offs

- [Hardcoded light styles inside drawer descendants survive the variable flip] → The audit task inspects tier-2/3 panels, mobile products strip, localization selector, and social icons in a live drawer; anything off gets a scoped override. Cheap to verify visually.
- [Timing interplay between drawer-close and overlay-open animations] → Reuse the exact sequencing the theme already uses (shade click handler + search delegate); if the combined transition looks broken, open the overlay after the drawer's 750ms cleanup timeout instead.
- [Contrast of `#1f2937` dividers on black] → Matches the design's `border-gray-800` exactly; it's a divider, not text, so WCAG text contrast doesn't apply.
- [Merchant later wants the whole mobile header black] → Out of scope here; the variable-override approach extends naturally if that lands as its own change.

## Migration Plan

Three-file edit shipped together (template + CSS + JS are interdependent: the row needs its styles and handler). Rollback = revert the commit; no settings or content migrations.

## Open Questions

- Should the drawer search row open the overlay (decided here, matching current loupe behavior) or navigate to the search page? If the merchant prefers navigation, the JS delegate is simply dropped and the link works as-is.
