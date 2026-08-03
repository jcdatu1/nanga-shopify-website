## ADDED Requirements

### Requirement: Card-mode rendering

`snippets/combined-listing.liquid` SHALL accept an optional `card_mode` boolean parameter (default `false`). All existing resolution behavior (set lookup, visible-member filtering, image-vs-text-row detection, current-product and sold-out state) SHALL be unchanged and shared between the two modes. When `card_mode` is true, the snippet SHALL NOT render the row's label line (no `variant_label` text, no current-name text, for either row type) and SHALL wrap entries in a plain container element instead of the `<combined-listing>` custom element, requiring no `section_id` parameter. When `card_mode` is false (the default, including all existing PDP usage), output SHALL be byte-identical to before this change.

#### Scenario: Card mode omits the label

- **WHEN** the snippet is rendered with `card_mode: true` for a product in a 2+ member set
- **THEN** the row renders the member entries with no label line above them

#### Scenario: Card mode requires no section-rendering wiring

- **WHEN** the snippet is rendered with `card_mode: true`
- **THEN** no `<combined-listing>` custom element, `data-section-id` attribute, or dependency on `assets/combined-listing.js` is present in the output

#### Scenario: PDP mode unaffected

- **WHEN** the snippet is rendered without `card_mode` (or with it explicitly `false`), as `sections/c-main-product.liquid` does today
- **THEN** the rendered markup is identical to before this change

### Requirement: All visible members render in card mode

In card mode, the snippet SHALL render every visible member — no cap and no overflow marker. Presenting a large set within a limited width (e.g. scrolling) is the caller's responsibility, not the snippet's.

#### Scenario: Set larger than the caller's display width

- **WHEN** `card_mode` is true and the set has 8 visible members
- **THEN** all 8 entries render as normal links; the snippet renders no truncation or count marker

### Requirement: Image entries omit visible name text in card mode

In card mode, an image-row entry (a member with a featured image, in a set whose axis matches the swatch option name) SHALL render only its thumbnail image — the member's name text SHALL be present in the markup as a visually-hidden element (preserving the entry's accessible name) rather than shown. A text-row entry (no matching image) SHALL continue to show its name as visible text, in both modes, since it has no image to substitute.

#### Scenario: Image entry in card mode

- **WHEN** `card_mode` is true and a member renders as an image-row entry
- **THEN** the entry shows only the thumbnail image; the member's name is present in the markup but not visually shown

#### Scenario: Text-pill entry in card mode

- **WHEN** `card_mode` is true and a member renders as a text-row entry (no image)
- **THEN** the entry's name text is visible, unchanged from PDP mode

#### Scenario: PDP mode unaffected

- **WHEN** `card_mode` is false
- **THEN** every entry's name text is visible, exactly as before this change
