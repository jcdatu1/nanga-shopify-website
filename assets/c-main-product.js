/**
 * Product gallery for the C Main product section.
 *
 * Clicking a thumbnail previews it in the main image well. Variant changes are
 * handled server-side: variant-picker.js re-renders the [data-dynamic-variant-content]
 * media and thumbnail containers with the new variant's featured media, so this
 * element only handles the client-side preview swap (via event delegation, which
 * survives those container replacements).
 */
if (!customElements.get('cmp-gallery')) {
  class CmpGallery extends HTMLElement {
    connectedCallback() {
      this.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(evt) {
      const thumb = evt.target.closest('.cmp__thumb');
      if (!thumb) return;

      const mainImg = this.querySelector('.cmp__media img');
      if (mainImg) {
        mainImg.src = thumb.dataset.mainSrc;
        if (thumb.dataset.mainSrcset) mainImg.srcset = thumb.dataset.mainSrcset;
        if ('mainAlt' in thumb.dataset) mainImg.alt = thumb.dataset.mainAlt;
      }

      this.querySelectorAll('.cmp__thumb').forEach((el) => {
        el.classList.toggle('is-active', el === thumb);
      });
    }
  }

  customElements.define('cmp-gallery', CmpGallery);
}
