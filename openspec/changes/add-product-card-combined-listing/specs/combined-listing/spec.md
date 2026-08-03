## ADDED Requirements

### Requirement: Card-mode rendering

`snippets/combined-listing.liquid` SHALL accept an optional `card_mode` boolean parameter (default `false`) and an `entry_limit` number parameter (default `4`, consulted only when `card_mode` is true). All existing resolution behavior (set lookup, visible-member filtering, image-vs-text-row detection, current-product and sold-out state) SHALL be unchanged and shared between the two modes. When `card_mode` is true, the snippet SHALL NOT render the row's label line (no `variant_label` text, no current-name text, for either row type) and SHALL wrap entries in a plain container element instead of the `<combined-listing>` custom element, requiring no `section_id` parameter. When `card_mode` is false (the default, including all existing PDP usage), output SHALL be byte-identical to before this change.

#### Scenario: Card mode omits the label

- **WHEN** the snippet is rendered with `card_mode: true` for a product in a 2+ member set
- **THEN** the row renders the member entries with no label line above them

#### Scenario: Card mode requires no section-rendering wiring

- **WHEN** the snippet is rendered with `card_mode: true`
- **THEN** no `<combined-listing>` custom element, `data-section-id` attribute, or dependency on `assets/combined-listing.js` is present in the output

#### Scenario: PDP mode unaffected

- **WHEN** the snippet is rendered without `card_mode` (or with it explicitly `false`), as `sections/c-main-product.liquid` does today
- **THEN** the rendered markup is identical to before this change

### Requirement: Capped entries with overflow marker in card mode

When `card_mode` is true, the snippet SHALL render at most `entry_limit` visible member entries. Any additional visible members beyond that limit SHALL be represented by a single non-interactive overflow marker showing the remaining count, rather than additional entries.

#### Scenario: Set larger than the cap

- **WHEN** `card_mode` is true, `entry_limit` is 4, and the set has 6 visible members
- **THEN** 4 entries render as normal links and a single non-interactive marker shows "+2"

#### Scenario: Set within the cap

- **WHEN** `card_mode` is true and the set has 3 visible members with `entry_limit` at 4
- **THEN** all 3 entries render as normal links with no overflow marker
