/**
 * Size chart — NANGA (snippets/c-size-chart.liquid, sections/c-main-product.liquid)
 *
 * <c-size-chart>         in/cm toggle (synced across every chart on the page and
 *                        remembered per browser) + highlight of the selected size row.
 * <c-size-chart-drawer>  Size Guide panel: right-hand drawer on desktop, bottom sheet on
 *                        mobile. Opened by any [data-csc-open="<drawer id>"] button —
 *                        delegated, so it survives the variant picker re-rendering.
 */
(() => {
  const STORAGE_KEY = 'nanga:size-unit';
  const UNIT_EVENT = 'csc:unit-change';

  const readUnit = () => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v === 'cm' || v === 'in' ? v : null;
    } catch (e) {
      return null;
    }
  };

  const saveUnit = (unit) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, unit);
    } catch (e) {
      /* storage unavailable — the choice still applies for this page */
    }
  };

  let currentUnit = readUnit() || 'in';

  /** The selected value of the size option in the product form, lower-cased, or ''. */
  const selectedSize = (optionNames) => {
    const names = optionNames.split(',').map((n) => n.trim().toLowerCase()).filter(Boolean);
    const selectors = document.querySelectorAll('.option-selector[data-option]');
    for (const sel of selectors) {
      if (!names.includes(sel.dataset.option.trim().toLowerCase())) continue;
      const checked = sel.querySelector('input.js-option:checked');
      if (checked) return checked.value.trim().toLowerCase();
      const select = sel.querySelector('select');
      if (select && select.value) return select.value.trim().toLowerCase();
    }
    return '';
  };

  if (!customElements.get('c-size-chart')) {
    class SizeChart extends HTMLElement {
      connectedCallback() {
        this.onUnitChange = (e) => this.applyUnit(e.detail.unit);
        this.onFormChange = () => this.highlight();
        document.addEventListener(UNIT_EVENT, this.onUnitChange);
        document.addEventListener('change', this.onFormChange);

        this.querySelectorAll('[data-unit-btn]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const unit = btn.dataset.unitBtn;
            currentUnit = unit;
            saveUnit(unit);
            document.dispatchEvent(new CustomEvent(UNIT_EVENT, { detail: { unit } }));
          });
        });

        this.applyUnit(currentUnit);
        this.highlight();
      }

      disconnectedCallback() {
        document.removeEventListener(UNIT_EVENT, this.onUnitChange);
        document.removeEventListener('change', this.onFormChange);
      }

      applyUnit(unit) {
        this.dataset.unit = unit;
        this.querySelectorAll('[data-unit-btn]').forEach((btn) => {
          btn.setAttribute('aria-pressed', String(btn.dataset.unitBtn === unit));
        });
      }

      highlight() {
        const size = selectedSize(this.dataset.sizeOption || 'Size');
        this.querySelectorAll('tbody tr[data-size]').forEach((tr) => {
          const match = size !== '' && tr.dataset.size === size;
          tr.classList.toggle('is-selected', match);
          if (match) {
            tr.setAttribute('aria-current', 'true');
          } else {
            tr.removeAttribute('aria-current');
          }
        });
      }
    }
    customElements.define('c-size-chart', SizeChart);
  }

  if (!customElements.get('c-size-chart-drawer')) {
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    class SizeChartDrawer extends HTMLElement {
      connectedCallback() {
        this.panel = this.querySelector('.csd__panel');
        this.onKeydown = this.onKeydown.bind(this);
        this.querySelectorAll('[data-csc-close]').forEach((el) => el.addEventListener('click', () => this.close()));
        this.setupSwipe();
      }

      open(opener) {
        if (this.classList.contains('is-open')) return;
        this.opener = opener || document.activeElement;
        this.hidden = false;
        this.querySelectorAll('c-size-chart').forEach((c) => c.highlight());
        // two frames so the browser paints the closed state first and the slide-in transitions
        requestAnimationFrame(() => requestAnimationFrame(() => this.classList.add('is-open')));
        document.documentElement.classList.add('csd-lock');
        document.addEventListener('keydown', this.onKeydown);
        if (this.opener) this.opener.setAttribute('aria-expanded', 'true');
        const closeBtn = this.querySelector('.csd__close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      }

      close() {
        if (!this.classList.contains('is-open')) return;
        this.classList.remove('is-open');
        this.panel.style.transform = '';
        document.documentElement.classList.remove('csd-lock');
        document.removeEventListener('keydown', this.onKeydown);
        const done = () => {
          if (!this.classList.contains('is-open')) this.hidden = true;
        };
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) done(); else setTimeout(done, 300);
        if (this.opener) {
          this.opener.setAttribute('aria-expanded', 'false');
          if (document.contains(this.opener)) this.opener.focus({ preventScroll: true });
        }
      }

      onKeydown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
          return;
        }
        if (e.key !== 'Tab') return;
        const items = [...this.panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      /** Mobile bottom sheet: drag the handle/header down to dismiss. */
      setupSwipe() {
        const handle = this.querySelector('.csd__head');
        if (!handle) return;
        let startY = null;
        let dy = 0;
        handle.addEventListener('pointerdown', (e) => {
          if (!window.matchMedia('(max-width: 767.98px)').matches) return;
          if (e.target.closest('button')) return;
          startY = e.clientY;
          dy = 0;
          handle.setPointerCapture(e.pointerId);
          this.panel.style.transition = 'none';
        });
        handle.addEventListener('pointermove', (e) => {
          if (startY === null) return;
          dy = Math.max(0, e.clientY - startY);
          this.panel.style.transform = `translateY(${dy}px)`;
        });
        const end = () => {
          if (startY === null) return;
          startY = null;
          this.panel.style.transition = '';
          if (dy > 80) {
            this.close();
          } else {
            this.panel.style.transform = '';
          }
        };
        handle.addEventListener('pointerup', end);
        handle.addEventListener('pointercancel', end);
      }
    }
    customElements.define('c-size-chart-drawer', SizeChartDrawer);

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-csc-open]');
      if (!trigger) return;
      const drawer = document.getElementById(trigger.dataset.cscOpen);
      if (!drawer) return;
      e.preventDefault();
      drawer.open(trigger);
    });
  }
})();
