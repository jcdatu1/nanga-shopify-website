# slideshow-button-arrow Specification

## Purpose

Allow each Slideshow `Slide` block to optionally render a right-arrow icon inside its buttons via per-button toggles, in both anchor and span button markup branches.

## Requirements

### Requirement: Per-button arrow toggle on Slide blocks

Each Slideshow `Slide` block SHALL expose two independent checkbox settings, `show_button_arrow_1` and `show_button_arrow_2`, controlling whether a right-arrow icon is rendered inside button 1 and button 2 respectively. Both settings SHALL default to `false` so existing slideshows render unchanged.

#### Scenario: Toggle enabled for a button

- **WHEN** a Slide block has `show_button_arrow_1` enabled and `button_label_1` is non-empty
- **THEN** button 1 renders its label followed by a right-arrow icon

#### Scenario: Toggle disabled for a button

- **WHEN** a Slide block has `show_button_arrow_2` disabled
- **THEN** button 2 renders its label with no arrow icon

#### Scenario: Toggles are independent

- **WHEN** `show_button_arrow_1` is enabled and `show_button_arrow_2` is disabled on the same slide
- **THEN** button 1 shows the arrow and button 2 does not

#### Scenario: No button label

- **WHEN** a button's label is empty
- **THEN** neither the button nor its arrow icon is rendered, regardless of the toggle value

### Requirement: Arrow renders in both button markup branches

The arrow icon SHALL render whether the button is output as an anchor (`<a>`, when the button has its own URL) or as a span (`<span>`, when the whole slide is wrapped in a single link). The icon SHALL appear after the button label text in both cases.

#### Scenario: Button rendered as anchor

- **WHEN** a slide uses per-button URLs (`button_url_1`) and `show_button_arrow_1` is enabled
- **THEN** the arrow icon is rendered inside the `<a>` button after its label

#### Scenario: Button rendered as span inside a wrapped slide link

- **WHEN** the whole slide is wrapped in a single link and the button is rendered as a `<span>` and its arrow toggle is enabled
- **THEN** the arrow icon is rendered inside the `<span>` button after its label
