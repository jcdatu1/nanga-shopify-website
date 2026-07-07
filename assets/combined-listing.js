/**
 * Combined listing selector for the C Main product section.
 *
 * Entries rendered by snippets/combined-listing.liquid are real links to
 * sibling products. This element intercepts clicks and swaps the whole
 * section (plus any variant-dependent sections) via the Section Rendering
 * API instead of navigating, with hover preloading through theme.fetchCache.
 * On any doubt (fetch error, sibling rendered on another template) it falls
 * back to full navigation, and links work unchanged without JS.
 *
 * Dependencies:
 * - Fetch cache (theme.fetchCache)
 */

if (!customElements.get('combined-listing')) {
  let didSwap = false;

  // A swap rewrites the URL via pushState; going back must restore the
  // previous product's page, so reload once combined-listing history is involved.
  window.addEventListener('popstate', (evt) => {
    if (didSwap || (evt.state && evt.state.clSwap)) window.location.reload();
  });

  class CombinedListing extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      this.requestId = 0;
      this.addEventListener('click', this.handleClick.bind(this));

      this.boundHandleEntryMouseEnter = this.handleEntryMouseEnter.bind(this);
      this.querySelectorAll('.cl-entry:not([aria-current])').forEach((el) => {
        el.addEventListener('mouseenter', this.boundHandleEntryMouseEnter);
        el.addEventListener('touchstart', this.boundHandleEntryMouseEnter, { passive: true, once: true });
        el.addEventListener('mouseleave', CombinedListing.handleEntryMouseLeave);
      });
    }

    /**
     * Create the Section Rendering API URL for a sibling product.
     * @param {string} productUrl - Sibling product URL.
     * @returns {URL} Sections request URL.
     */
    constructSectionsUrl(productUrl) {
      const url = new URL(productUrl, window.location.origin);
      const sectionIds = [this.sectionId];
      document.querySelectorAll('.cc-variant-dependent-section [data-section-id]').forEach((el) => {
        sectionIds.push(el.dataset.sectionId);
      });
      url.searchParams.set('sections', sectionIds.join(','));
      return url;
    }

    /**
     * Handles 'mouseenter' events on entries. Preloads the sibling's sections.
     * @param {object} evt - Event object.
     */
    handleEntryMouseEnter(evt) {
      const entry = evt.currentTarget;
      if (entry.dataset.preloaded) return;
      if (entry.dataset.preloadTimeout) return;

      // Wait to predict click-intent before preloading
      entry.dataset.preloadTimeout = setTimeout(() => {
        entry.dataset.preloaded = true;
        entry.removeAttribute('data-preload-timeout');
        theme.fetchCache.preload(this.constructSectionsUrl(entry.href).toString());
      }, 250);
    }

    /**
     * Handles 'mouseleave' events on entries. Cancels the preload if in/out fast.
     * @param {object} evt - Event object.
     */
    static handleEntryMouseLeave(evt) {
      const entry = evt.currentTarget;
      clearTimeout(entry.dataset.preloadTimeout);
      entry.removeAttribute('data-preload-timeout');
    }

    /**
     * Handles 'click' events on the element. Swaps sections to the sibling product.
     * @param {object} evt - Event object.
     */
    handleClick(evt) {
      const entry = evt.target.closest('.cl-entry');
      if (!entry) return;
      evt.preventDefault();
      if (entry.getAttribute('aria-current') === 'true') return;

      const productUrl = entry.href;
      this.requestId += 1;
      const currentRequestId = this.requestId;
      this.setAttribute('aria-busy', 'true');
      this.classList.add('is-loading');

      theme.fetchCache.fetch(this.constructSectionsUrl(productUrl).toString())
        .then((responseText) => {
          if (currentRequestId !== this.requestId) return;

          const responseData = JSON.parse(responseText);
          const target = document.getElementById(`shopify-section-${this.sectionId}`);
          const mainHtml = responseData[this.sectionId];
          const newMain = mainHtml
            ? new DOMParser().parseFromString(mainHtml, 'text/html').getElementById(`shopify-section-${this.sectionId}`)
            : null;

          // Sibling not rendered by this section (e.g. alternate template) - navigate
          if (!target || !newMain || !newMain.firstElementChild) {
            window.location = productUrl;
            return;
          }

          Object.entries(responseData).forEach(([sectionId, htmlStr]) => {
            if (sectionId === this.sectionId || !htmlStr) return;
            const other = document.getElementById(`shopify-section-${sectionId}`);
            const newOther = new DOMParser().parseFromString(htmlStr, 'text/html').getElementById(`shopify-section-${sectionId}`);
            if (other && newOther) other.innerHTML = newOther.innerHTML;
          });
          target.innerHTML = newMain.innerHTML;

          didSwap = true;
          window.history.pushState({ clSwap: true }, '', productUrl);

          // The clicked sibling is now the current product - restore focus there
          target.querySelector('combined-listing .cl-entry[aria-current="true"]')?.focus();
        })
        .catch(() => {
          window.location = productUrl;
        });
    }
  }

  customElements.define('combined-listing', CombinedListing);
}
