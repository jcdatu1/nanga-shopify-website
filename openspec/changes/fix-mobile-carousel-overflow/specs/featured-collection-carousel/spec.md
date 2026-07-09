## ADDED Requirements

### Requirement: No horizontal page overflow

The section SHALL NOT cause the page to become horizontally scrollable at any viewport width. The floating navigation arrows MAY overhang the carousel edges per the design, but any part of them that would extend past the section's own edge (and thus the viewport, since the section is full-bleed) SHALL be clipped on the horizontal axis without creating a scroll container and without clipping vertical overflow such as button shadows.

#### Scenario: Mobile viewport containment

- **WHEN** the section renders on a mobile viewport where the arrow overhang (half the button width) exceeds the container padding
- **THEN** the page cannot be swiped or scrolled horizontally, and no white gap is revealed beside the layout

#### Scenario: Arrow design preserved

- **WHEN** the arrows render at any breakpoint
- **THEN** they still visually overlap the carousel's left and right edges with their elevation shadow intact, with at most the sliver beyond the viewport edge clipped
