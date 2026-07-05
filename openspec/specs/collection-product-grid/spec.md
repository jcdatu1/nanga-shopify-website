# collection-product-grid Specification

## Purpose

Provide a title-less collection section (`sections/c-main-collection.liquid`) that renders faceted filters and a responsive grid of the lean `product-card`, with dynamic (AJAX) filter, sort, and pagination via the theme's existing `<filter-container>` engine. Desktop is faithful to the NANGA Figma (left filter sidebar + product column with count/sort); mobile uses the theme's native filter drawer plus a Filter/Sort button row. Filter/sort/count visibility and desktop/mobile/per-page counts are configurable.

## Requirements

### Requirement: Title-less collection grid section

The theme SHALL provide a collection section (`c-main-collection`) that renders only the faceted filters and the product grid, with no collection title, heading image, description, or related-collections markup. The section SHALL be assignable as the `main` section of `templates/collection.json` and SHALL render the products of the current `collection` object within a `{% paginate %}` block.

#### Scenario: Section renders without a title

- **WHEN** the section is rendered on a collection page
- **THEN** no collection title, heading image, description, or related-collections markup is output
- **AND** the faceted filters and a grid of the collection's products are output

#### Scenario: Empty collection

- **WHEN** the current collection has no products (e.g. all filtered out)
- **THEN** the section renders the theme's empty-collection message instead of an empty grid

### Requirement: Reuse the lean product-card

The section SHALL render each product using the `product-card` snippet (not `product-block`), through the snippet's parameter contract. It SHALL expose card-controlling settings equivalent to the carousel section — tag style, tag position, card border, image style, category-line toggle, and spec-line toggle — and pass them to `product-card` via `badge_bg` / `badge_text`, `badge_position`, `show_border`, `image_fit`, `show_type`, and `show_value_props`. Defaults SHALL match the design's category grid: Lifestyle image style (cover on gray), category line off, spec line on, light tag, no border.

#### Scenario: Card settings flow to the snippet

- **WHEN** the merchant sets any card setting in the section
- **THEN** each rendered `product-card` reflects it via the snippet's parameter contract

#### Scenario: Design-default category grid card

- **WHEN** the section renders with default settings
- **THEN** cards show a cover-cropped image on the gray-tinted frame, no category line, the spec line (when the `c_card_value_prop` metafield is present), and a light tag

#### Scenario: New Arrival grid variant

- **WHEN** the section is configured with filters, sort, and count off, border on, dark tag, Product image style, category line on, and spec line off
- **THEN** the rendered page reproduces the design's New Arrival grid using this same section

### Requirement: Visibility settings

The section SHALL provide independent toggles for: Display Filter (filter UI), Display Sort (sort control), and Display page count (product total). Each toggle SHALL control only its own element. When filtering is disabled or the collection exposes no filters, the filter UI SHALL NOT render.

#### Scenario: Hide sort only

- **WHEN** Display Sort is off and Display Filter and Display page count are on
- **THEN** the sort control is absent
- **AND** the filter UI and the product count remain visible

#### Scenario: No filters available

- **WHEN** Display Filter is on but the collection exposes no filters
- **THEN** the filter UI does not render and the grid still displays

### Requirement: Configurable grid and page size

The section SHALL provide settings for products per row on desktop, products per row on mobile, and products per page. The desktop and mobile counts SHALL drive the grid columns independently of any global theme product-per-row setting. The products-per-page count SHALL drive the `{% paginate %}` page size.

#### Scenario: Independent desktop and mobile columns

- **WHEN** desktop per-row is set to 3 and mobile per-row is set to 2
- **THEN** the grid shows 3 columns on desktop and 2 columns on mobile
- **AND** the global product-per-row theme setting does not override these

#### Scenario: Page size controls pagination

- **WHEN** products per page is set to N and the collection has more than N products
- **THEN** the grid shows N products and a pager is rendered for the remainder

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

### Requirement: Mobile filter drawer and button row

On mobile, the section SHALL reuse the theme's native off-canvas filter drawer unchanged. A two-button row (Filter and Sort) SHALL appear above the grid; the Filter button SHALL open the native drawer and the Sort button SHALL expose the sort options. Both SHALL operate through the existing AJAX engine.

#### Scenario: Mobile Filter button opens the native drawer

- **WHEN** a mobile shopper taps the Filter button
- **THEN** the theme's native filter drawer opens
- **AND** applying a filter updates the grid via fetch without a full reload

#### Scenario: Mobile Sort button

- **WHEN** a mobile shopper taps the Sort button and selects an option
- **THEN** the grid reorders via fetch without a full reload

### Requirement: No regressions to shared collection assets

The change SHALL NOT modify `snippets/product-card.liquid`, `snippets/faceted-filters.liquid`, `snippets/pagination-control.liquid`, or the `<filter-container>` engine in `assets/main.js`. The existing `main-collection.liquid` section SHALL remain functional and unchanged so it can serve as a fallback.

#### Scenario: Shared snippets and engine untouched

- **WHEN** the change is implemented
- **THEN** the shared filter/card/pagination snippets and the AJAX engine are reused without edits
- **AND** the existing `main-collection` section continues to render correctly if reselected

### Requirement: New Arrival alternate template

The theme SHALL provide `templates/collection.new-arrival.json` using the `c-main-collection` section preconfigured to the design's New Arrival grid: filters off, sort off, product count off, card border on, dark tags, Product image style, category line on, spec line off.

#### Scenario: Assigning the template

- **WHEN** a merchant assigns the "new-arrival" template to a collection
- **THEN** the collection page renders the bordered, contain-fit card grid with no filter/sort/count chrome, matching the design's New Arrival page
