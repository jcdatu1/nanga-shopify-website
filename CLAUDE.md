# NANGA — Shopify Theme

This is a Shopify (Online Store 2.0) theme: Liquid `sections/`, `snippets/`, `blocks/`, `templates/`,
`layout/`, with `assets/`, `config/`, and `locales/`.

## Design reference

The intended design lives in [context/NANGAv1/](context/NANGAv1/) — a Figma→React (shadcn/Tailwind)
export that is the **visual source of truth**, NOT code to ship.

- Treat it as a spec for layout, spacing, typography, color, and component behavior.
- Map its tokens/styles to this theme's existing Liquid/CSS — do **not** import React, shadcn,
  Tailwind, or its build tooling into the theme.
- Page-level intent: [src/app/pages/](context/NANGAv1/src/app/pages/) ·
  components: [src/app/components/](context/NANGAv1/src/app/components/) ·
  tokens/styles: [src/styles/](context/NANGAv1/src/styles/) ·
  written rules: [guidelines/Guidelines.md](context/NANGAv1/guidelines/Guidelines.md)

## How to make changes

1. **Minimally invasive & precise.** Change the smallest surface that achieves the goal. Prefer
   editing the specific section/snippet/block over broad refactors. Don't reformat or touch
   unrelated code.
2. **Assume reuse.** Before editing any `snippet`, `block`, or shared CSS class, check who renders
   it (`{% render %}` / `{% include %}` callers, shared classes in `assets/`). A change here can
   affect other sections — scope changes via section settings or new modifiers rather than altering
   shared behavior. When in doubt, ask or add a variant instead of mutating the shared path.
3. **Performance first — no bloat.**
   - No new JS/CSS frameworks or dependencies. Work within the theme's existing assets.
   - Keep Liquid lean; avoid expensive loops and redundant `{% render %}` in hot paths.
   - Use responsive images (`image_url` + `width`/`srcset`/`sizes`), `loading="lazy"` for
     below-the-fold media, and existing icon/snippet patterns (e.g. `snippets/icon.liquid`).
   - Don't add render-blocking `<script>`/`<link>`; defer/async and only load what a section needs.
   - Reuse existing CSS variables/classes before introducing new ones; avoid dead or duplicated CSS.
4. **Match the surrounding code** — naming, structure, comment density, and Liquid idioms already
   in the file.

When a request is ambiguous on any of the above (especially reuse impact), surface it rather than
guessing.
