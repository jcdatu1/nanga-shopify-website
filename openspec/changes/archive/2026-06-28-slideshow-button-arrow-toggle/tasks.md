## 1. Reusable icon snippet

- [x] 1.1 Extend the existing `snippets/icon.liquid` (parameter-driven dispatch) with an `arrow-right` case; unknown/empty `icon` still outputs no glyph.
- [x] 1.2 Register `arrow-right` using the lucide `ArrowRight` path, inheriting the wrapper's `fill="none" stroke="currentColor"` so it follows button text color.
- [x] 1.3 Add a backward-compatible optional `stroke_width` override to the shared SVG wrapper (defaults preserve existing size-derived stroke).
- [x] 1.4 Verify `{% render 'icon', icon: 'arrow-right' %}` and `{% render 'icon', icon: 'arrow-right', size: 'small', stroke_width: 2 %}` render correctly.

## 2. Slide block settings

- [x] 2.1 In `sections/slideshow.liquid` schema, add checkbox `show_button_arrow_1` (default `false`) directly under `button_url_1` on the `image` (Slide) block.
- [x] 2.2 Add checkbox `show_button_arrow_2` (default `false`) directly under `button_url_2` on the same block.
- [x] 2.3 Give both settings clear labels ("Show arrow on button 1 / 2").

## 3. Button markup

- [x] 3.1 In the wrapped-link `<span>` button branch, render the arrow icon after `button_label_1` when `show_button_arrow_1` is enabled, and after `button_label_2` when `show_button_arrow_2` is enabled.
- [x] 3.2 In the per-button-URL `<a>` button branch, render the icon after each label under the same toggle guards.
- [x] 3.3 Confirm no arrow renders when a button label is empty (button is not output at all).

## 4. Styling

- [x] 4.1 Add a CSS rule targeting `.text-overlay__button .icon--type-arrow-right` so the icon sits inline after the label, aligns vertically, and inherits the button's color and size.
- [x] 4.2 Confirm no hover animation is introduced (out of scope) and existing button styles are unchanged.

## 5. Verification

- [x] 5.1 With both toggles off (defaults), confirm existing slideshows render identically (no arrows).
- [x] 5.2 Confirm the arrow shows only for the enabled button, in both link-wrapping modes (manual theme-editor check recommended before publish).
- [x] 5.3 Run `openspec validate slideshow-button-arrow-toggle` and confirm the change is valid.
