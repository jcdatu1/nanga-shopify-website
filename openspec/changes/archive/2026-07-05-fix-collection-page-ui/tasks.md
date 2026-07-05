## 1. Sort dropdown icon overlap

- [x] 1.1 In `assets/c-main-collection.css`, update `.cmc__sort .link-dropdown__button`: keep `padding: 8px 16px` but restore `padding-inline-end: 40px` for the absolutely-positioned chevron; remove the no-op `gap: 8px`.

## 2. Pagination below the product grid

- [x] 2.1 In `sections/c-main-collection.liquid`, move the `.cmc__pagination` wrapper (with `{% render 'pagination-control', paginate: paginate %}`) from after `</filter-container>` to the end of the `.filters-adjacent[data-ajax-container]` div (after the grid / empty state), removing its `data-ajax-container` attribute.
- [x] 2.2 Add a `.cmc__pagination` spacing rule in `assets/c-main-collection.css` if needed (top margin above the pager inside the product column).

## 3. Page header contextual fallback

- [x] 3.1 In `sections/c-page-header.liquid`, resolve the heading text as `section.settings.title`, falling back to `collection.title` then `page.title` when blank; resolve the subtitle as `section.settings.subtitle`, falling back to `collection.description` when blank on a collection; update the header comment. No output when both title sources are blank stays clean.

## 4. Collection template header instances

- [x] 4.1 In `templates/collection.json`, add a `c-page-header` instance ordered before the grid: `title: ""`, `use_h1: true`, `subtitle: ""`, `background_color: "#f9fafb"`, `show_border: true`.
- [x] 4.2 In `templates/collection.new-arrival.json`, add the same instance with `background_color: "rgba(0,0,0,0)"` and `show_border: false`.
- [x] 4.3 Validate both template JSONs parse and all referenced setting IDs exist in the `c-page-header` schema.

## 5. Verify on the live theme

- [ ] 5.1 Collection page: sort dropdown label ("Most Relevant" etc.) no longer touches the chevron; dropdown still opens/animates correctly.
- [ ] 5.2 Pagination appears directly under the product grid in the product column; filter, sort, and pagination still update via AJAX without full reloads, and back/forward restores state.
- [ ] 5.3 Default collection shows the gray bordered header with the collection's title/description; a new-arrival-template collection shows the plain header; Knowledge page header unchanged.
