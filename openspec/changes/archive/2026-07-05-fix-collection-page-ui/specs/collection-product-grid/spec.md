## MODIFIED Requirements

### Requirement: Desktop layout faithful to Figma

On desktop, when filtering is enabled, the filters SHALL be permanently visible as a left sidebar with no Filter toggle button. The product count and the sort control SHALL sit in a row inside the product column (to the right of the sidebar), above the grid — not in a full-width bar spanning across the sidebar. The sort control SHALL reserve horizontal space for its dropdown icon so the selected option's label never overlaps the icon, regardless of label length.

#### Scenario: Desktop sidebar always visible

- **WHEN** a desktop shopper views the section with filtering enabled
- **THEN** the filters are shown as a left sidebar without requiring a toggle click

#### Scenario: Count and sort sit in the product column

- **WHEN** a desktop shopper views the section
- **THEN** the product count and sort control appear in a row above the grid within the product column, not spanning the sidebar width

#### Scenario: Sort label does not overlap the icon

- **WHEN** the selected sort option has a long label (e.g. "Most Relevant")
- **THEN** the label text ends before the dropdown icon's reserved space and does not render underneath it

### Requirement: Dynamic filter, sort, and pagination

Filter changes, sort changes, and pagination SHALL update the grid and filters dynamically via fetch, without a full page reload, by reusing the theme's existing `<filter-container>` AJAX engine (`data-ajax-filtering`, `data-filter-section-id`, `[data-ajax-container]`). The section SHALL NOT introduce new JavaScript. Browser back/forward SHALL restore prior filter/sort/page state. The pagination controls SHALL render inside the product column, directly below the product grid, as part of the grid's AJAX container markup (not as a separate sibling container), so they sit visibly under the products and refresh with the grid.

#### Scenario: Applying a filter does not reload the page

- **WHEN** the shopper selects a filter value
- **THEN** the grid and filter UI update via a background fetch scoped by `section_id`
- **AND** the page does not perform a full reload
- **AND** the URL is updated so the state is shareable and bookmarkable

#### Scenario: Sorting updates dynamically

- **WHEN** the shopper chooses a sort option
- **THEN** the grid reorders via a background fetch without a full reload

#### Scenario: Paginating updates dynamically

- **WHEN** the shopper clicks a pagination link
- **THEN** the next page of products loads into the grid via a background fetch without a full reload

#### Scenario: Pagination sits below the grid

- **WHEN** the collection has more products than the page size
- **THEN** the pagination renders in the product column immediately after the product grid (not below the filter sidebar's full height)
- **AND** after an AJAX filter/sort/page update, the pagination reflects the new state

#### Scenario: Back button restores state

- **WHEN** the shopper presses the browser back button after filtering or paginating
- **THEN** the previous filter/sort/page state is restored without a full reload

## ADDED Requirements

### Requirement: Collection page title header

The collection templates SHALL include a `c-page-header` instance above the grid section that renders the current collection's title and description dynamically (via the header section's contextual fallback). The default collection template (`templates/collection.json`) SHALL show the design's gray variant (light-gray background, bottom border) by default; the New Arrival template (`templates/collection.new-arrival.json`) SHALL show the plain variant (no tint, no border), matching the design.

#### Scenario: Default collection header

- **WHEN** a shopper views a collection using the default template
- **THEN** a gray, bottom-bordered header band shows that collection's title (H1) and description above the filter/grid layout

#### Scenario: New Arrival header

- **WHEN** a shopper views a collection assigned the new-arrival template
- **THEN** the header shows the collection's title and description with no tinted background and no border

#### Scenario: Per-template appearance control

- **WHEN** the merchant edits a template's header instance settings (background color, border)
- **THEN** only collections using that template reflect the change
