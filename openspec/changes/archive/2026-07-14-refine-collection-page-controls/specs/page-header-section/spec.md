## ADDED Requirements

### Requirement: Configurable vertical spacing

The section SHALL expose four range settings controlling the header band's vertical padding independently for mobile and desktop: top padding (mobile), top padding (desktop), bottom padding (mobile), bottom padding (desktop). Defaults SHALL match the section's existing fixed spacing (48px mobile, 64px desktop, applied to both top and bottom) so existing instances render unchanged until a merchant edits the settings.

#### Scenario: Default spacing unchanged

- **WHEN** a section instance uses the default padding settings
- **THEN** the header band renders with 48px top/bottom padding on mobile and 64px top/bottom padding on desktop, matching prior fixed behavior

#### Scenario: Merchant adjusts spacing

- **WHEN** a merchant sets a non-default value for any of the four padding settings
- **THEN** the header band's padding reflects that value at the corresponding breakpoint, independent of the other three settings
