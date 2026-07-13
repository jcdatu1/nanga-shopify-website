## MODIFIED Requirements

### Requirement: Mobile filter drawer and button row

On mobile, the section SHALL reuse the theme's native off-canvas filter drawer unchanged, for filters only. A single-button row (Filter) SHALL appear above the grid; the Filter button SHALL open the native drawer. The filter drawer SHALL NOT contain any sort control — sort is provided exclusively by the standalone sort dropdown described under "Sort control consistency across breakpoints".

#### Scenario: Mobile Filter button opens the native drawer

- **WHEN** a mobile shopper taps the Filter button
- **THEN** the theme's native filter drawer opens
- **AND** applying a filter updates the grid via fetch without a full reload

#### Scenario: Filter drawer has no sort UI

- **WHEN** a mobile shopper opens the filter drawer
- **THEN** no sort options are present inside it

## ADDED Requirements

### Requirement: Sort control consistency across breakpoints

The sort control SHALL be a single self-contained dropdown (attached directly to its own trigger button, not routed through the filter drawer) that renders identically in mechanism at every breakpoint. Selecting an option SHALL update the grid via the existing AJAX engine without opening the filter drawer.

#### Scenario: Mobile sort via dropdown

- **WHEN** a mobile shopper taps the Sort button
- **THEN** a dropdown of sort options opens directly from that button
- **AND** selecting an option reorders the grid via fetch without a full reload and without opening the filter drawer

#### Scenario: Desktop sort unchanged

- **WHEN** a desktop shopper uses the sort control
- **THEN** it behaves exactly as before — a dropdown attached to the sort button in the product column toolbar

### Requirement: Filter order mirrors Search & Discovery

The NANGA filter UI (`snippets/cmc-filters.liquid`) SHALL render filters, including the price filter, in the same order `filter_context.filters` provides — i.e. the order configured in the Search & Discovery app — rather than forcing any filter type to a fixed position.

#### Scenario: Price filter respects admin order

- **WHEN** Search & Discovery is configured with a non-price filter (e.g. Gender) ordered above the Price filter
- **THEN** the storefront filter sidebar/drawer shows that filter above the price-bracket controls, matching the admin order

#### Scenario: Price filter first when configured first

- **WHEN** Search & Discovery is configured with the Price filter first
- **THEN** the storefront filter sidebar/drawer shows the price-bracket controls first, unchanged from current behavior
