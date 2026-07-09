# mobile-menu-drawer Specification

## Purpose

Give the theme's mobile navigation drawer the NANGA design's presentation: a black panel with white text and icons and dark dividers, and a search entry at the bottom of the menu that replaces the header-bar loupe on mobile — without affecting the desktop navigation, which shares the drawer's color variables.

## Requirements

### Requirement: White-on-black drawer presentation

The mobile navigation drawer SHALL render as a black panel with white navigation links, white icons (close X, back chevron, children toggles, search loupe), and dividers in the design's dark gray (`#1f2937`). The restyle SHALL apply to the entire drawer including tier-2/tier-3 sub-panels, scroll-fade gradients, and footer content cloned from the announcement bar. The restyle SHALL be scoped to the drawer so the desktop navigation's colors are unchanged.

#### Scenario: Opening the drawer

- **WHEN** a user opens the mobile menu drawer
- **THEN** the panel background is black, links and the X icon are white, and dividers render dark gray

#### Scenario: Navigating into a submenu

- **WHEN** a user opens a child menu (tier 2 or 3) inside the drawer
- **THEN** the sub-panel, its back chevron, title, and links render with the same black/white treatment

#### Scenario: Desktop navigation unaffected

- **WHEN** the desktop navigation or its dropdowns render
- **THEN** their background and link colors are identical to before this change

### Requirement: Search entry at the bottom of the drawer

When the header's search setting is enabled, the drawer SHALL display a search entry at the bottom of the menu — below the tier-1 links, separated by a top divider — consisting of the theme's search loupe icon and a translated "Search" label in white. Activating it SHALL close the drawer and open the theme's search overlay with the search input focused. Without JavaScript, the entry SHALL navigate to the search page. When the header's search setting is disabled, no search entry SHALL render in the drawer.

#### Scenario: Tapping the drawer search entry

- **WHEN** a user taps the search entry at the bottom of the open drawer
- **THEN** the drawer closes and the search overlay opens with the input focused

#### Scenario: JavaScript unavailable

- **WHEN** the search entry is activated with JavaScript disabled
- **THEN** the browser navigates to the theme's search page

#### Scenario: Search disabled in header settings

- **WHEN** the header section's "Enable search" setting is off
- **THEN** the drawer renders no search entry

### Requirement: Header-bar loupe hidden on mobile

On mobile viewports (below 768px), the header bar SHALL NOT display the search loupe next to the menu toggle; search access on mobile lives in the drawer. Desktop header layouts SHALL keep their existing search links unchanged.

#### Scenario: Mobile header bar

- **WHEN** the header renders on a viewport below 768px with search enabled
- **THEN** no search loupe appears in the header bar, and the drawer contains the search entry

#### Scenario: Desktop header bar

- **WHEN** the header renders at 768px or wider
- **THEN** the search link(s) render exactly as before this change
