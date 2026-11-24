// breathe-air-card: one card per sensor (CO₂, VOC, PM2.5, PM10, temperature, humidity or any other).

import { esc, rgba, noise, reducedMotion } from '../../core/util.js';
import { language, t } from '../../core/i18n.js';
import { resolve, zoneIndex, zoneColor, scalePosition, fraction } from '../../core/resolve.js';
import { getAnimation } from '../../animations/index.js';
import { getScale, scalesCss } from '../../scales/index.js';
import { CARD_CSS } from './styles.js';

export const AIR_CARD_TAG = 'breathe-air-card';

export class BreatheAirCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement(AIR_CARD_TAG + '-editor');
  }

  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states).filter((e) => e.startsWith('sensor.')) : [];
    const co2 = ids.find((e) => hass.states[e].attributes.device_class === 'carbon_dioxide');
    return co2 ? { entity: co2, preset: 'co2' } : { entity: ids[0] || 'sensor.example' };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._store = {};
    this._cur = null;
    this._target = null;
    this._tw = null;
    this._visible = true;
    this._raf = 0;
    this._key = '';
    this._w = 0;
    this._h = 0;
    this._unavail = true;
    this._loop = this._loop.bind(this);
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error(t(language(this._hass), 'error.entity'));
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    if (!hass || !hass.states) return;
    const langChanged = language(hass) !== language(this._hass);
    this._hass = hass;
    const st = this._config ? hass.states[this._config.entity] : null;
    if (st === this._stateObj && !langChanged) return;
    const firstState = !this._stateObj && st;
    this._stateObj = st;
    if (firstState || langChanged) this._render();
    this._setValue();
  }

  getCardSize() {
    return 5;
  }

  getGridOptions() {
    return { columns: 6, rows: 4, min_columns: 3, min_rows: 3 };
  }

  connectedCallback() {
    this._connected = true;
    this._observe();
    this._kick();
  }

  disconnectedCallback() {
    this._connected = false;
    cancelAnimationFrame(this._raf);
    this._raf = 0;
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    this._ro = this._io = null;
  }

  /* ---------- rendering ---------- */

  _render() {
    if (!this._config) return;
    const lang = language(this._hass);
    const r = (this._r = resolve(this._config, this._stateObj, lang));
    this._anim = getAnimation(r.animation);
    this._scale = getScale(r.scale);
    this._text = { unavailable: t(lang, 'state.unavailable') };
    const icon = r.icon
      ? `<ha-icon icon="${esc(r.icon)}"></ha-icon>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${r.svgIcon}</svg>`;
    const scaleHtml = this._scale.html(r, (v, m) => this._fmt(v, m));
    this.shadowRoot.innerHTML = `<style>${CARD_CSS}${scalesCss()}</style>
      <ha-card tabindex="0" role="button" aria-label="${esc(r.name)}">
        <canvas aria-hidden="true"></canvas>
        <div class="ct">
          <div class="hd"><span class="ico">${icon}</span>
            <span class="nm"><b>${esc(r.name)}</b>${r.showSubtitle && r.subtitle ? `<span>${esc(r.subtitle)}</span>` : ''}</span></div>
          <div class="grow"></div>
          <div class="val"><span class="num">—</span><span class="u">${esc(r.unit)}</span>${this._scale.slot === 'value' ? '<span class="ring scl-slot"></span>' : ''}</div>
          ${this._scale.slot === 'bottom' ? `<div class="scl scl-slot">${scaleHtml}</div>` : ''}
        </div>
      </ha-card>`;
    const card = (this._card = this.shadowRoot.querySelector('ha-card'));
    card.style.setProperty('--bc-acc', r.color);
    card.style.setProperty('--bc-glow', rgba(r.color, 0.2));
    card.style.setProperty('--bc-b1', r.background[0]);
    card.style.setProperty('--bc-b2', r.background[1]);
    if (r.grain) {
      const n = noise();
      if (n) card.style.setProperty('--bc-noise', `url(${n})`);
    }
    card.classList.toggle('nograin', !r.grain);
    card.classList.toggle('static', r.tap === 'none');
    card.classList.toggle('unavail', this._unavail);
    this._canvas = card.querySelector('canvas');
    this._canvas.classList.toggle('mask', !!this._anim.mask);
    this._ctx = this._canvas.getContext('2d');
    this._num = card.querySelector('.num');
    this._slot = card.querySelector('.scl-slot');
    this._store = {};
    this._key = '';
    card.addEventListener('click', () => this._tap());
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._tap();
      }
    });
    this._observe();
    this._resize();
    this._kick();
  }

  _observe() {
    if (!this._connected || !this._card) return;
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this._card);
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries.some((e) => e.isIntersecting);
      this._kick();
    });
    this._io.observe(this._card);
  }

  _resize() {
    if (!this._card) return;
    const rect = this._card.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    if (!rect.width || !rect.height) return;
    this._w = rect.width;
    this._h = rect.height;
    this._canvas.width = Math.round(rect.width * d);
    this._canvas.height = Math.round(rect.height * d);
    this._ctx.setTransform(d, 0, 0, d, 0, 0);
    this._card.classList.toggle('compact', rect.height < 215 || rect.width < 150);
    if (this._scale.layout && this._slot) this._scale.layout(this._slot);
    this._key = '';
    this._frame(performance.now(), true);
  }

  _fmt(v, mark) {
    const lang = (this._hass && this._hass.locale && this._hass.locale.language) || (this._hass && this._hass.language) || undefined;
    const d = mark ? (Number.isInteger(v) ? 0 : Math.min(this._r.decimals, 2)) : this._r.decimals;
    try {
      return new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false }).format(v);
    } catch (e) {
      return v.toFixed(d);
    }
  }

  /* ---------- value ---------- */

  _setValue() {
    if (!this._r) return;
    const v = this._stateObj ? parseFloat(this._stateObj.state) : NaN;
    const ok = Number.isFinite(v);
    this._unavail = !ok;
    if (this._card) this._card.classList.toggle('unavail', !ok);
    if (ok) {
      const jump = this._cur == null || reducedMotion() || !this._visible || !this._connected || document.hidden;
      if (jump) {
        this._cur = v;
        this._tw = null;
      } else if (v !== this._target) {
        this._tw = { from: this._cur, to: v, t0: performance.now(), d: 900 };
      }
      this._target = v;
    }
    this._key = '';
    this._kick();
    this._frame(performance.now(), true);
  }

  _tap() {
    if (!this._r || this._r.tap === 'none') return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: this._config.entity } }));
  }

  /* ---------- frame loop: runs only while visible and something moves ---------- */

  _animating() {
    if (!this._connected || !this._visible || document.hidden || !this._r) return false;
    return !!this._tw || (this._r.animate && this._anim.moving && !reducedMotion());
  }

  _kick() {
    if (!this._raf && this._animating()) this._raf = requestAnimationFrame(this._loop);
  }

  _loop(time) {
    this._raf = 0;
    if (!this._animating()) return;
    this._frame(time, false);
    this._raf = requestAnimationFrame(this._loop);
  }

  _frame(time, still) {
    if (!this._r || !this._ctx) return;
    if (this._tw) {
      const k = Math.min(1, (time - this._tw.t0) / this._tw.d), e = 1 - Math.pow(1 - k, 3);
      this._cur = this._tw.from + (this._tw.to - this._tw.from) * e;
      if (k >= 1) this._tw = null;
    }
    const r = this._r, v = this._unavail ? r.min : this._cur ?? r.min;
    const index = zoneIndex(r, v), zone = r.zones[index], color = zoneColor(zone);
    if (this._w && this._h) {
      this._ctx.clearRect(0, 0, this._w, this._h);
      this._anim.draw(this._ctx, {
        w: this._w, h: this._h, t: time, speed: r.animate && !still && !reducedMotion() ? 1 : 0,
        v, f: fraction(r, v), color: r.color, zoneColor: color, store: this._store, animate: r.animate,
        unavailable: this._unavail, compact: this._card.classList.contains('compact'), r,
        format: (x, m) => this._fmt(x, m),
      });
    }
    const key = this._unavail ? 'na' : this._fmt(v) + '|' + index;
    const changed = key !== this._key;
    this._key = key;
    if (changed) {
      this._num.textContent = this._unavail ? '—' : this._fmt(v);
      this._card.setAttribute('aria-label', this._unavail
        ? `${r.name}: ${this._text.unavailable}`
        : `${r.name}: ${this._fmt(v)} ${r.unit}${r.showState && zone.label ? ', ' + zone.label : ''}`);
    }
    if (this._slot) {
      this._scale.update(this._slot, r, {
        v, pos: scalePosition(r, v), index, zone, color, unavailable: this._unavail, changed, text: this._text.unavailable,
      });
    }
  }
}

