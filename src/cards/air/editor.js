// Visual editor for breathe-air-card. Plain inputs, no dependency on HA internals,
// so it keeps working across Home Assistant versions.

import { clamp, esc } from '../../core/util.js';
import { language, t } from '../../core/i18n.js';
import { LEVELS, PRESETS } from '../../core/presets.js';
import { resolve, presetZones } from '../../core/resolve.js';
import { scaleIds, hasScale } from '../../scales/index.js';
import { EDITOR_CSS } from './styles.js';

export class BreatheAirCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._last = '';
  }

  setConfig(config) {
    const s = JSON.stringify(config || {});
    this._config = { ...(config || {}) };
    if (s === this._last && this._rendered) return; // our own change coming back: keep focus
    this._render();
  }

  set hass(h) {
    if (!h || !h.states) return;
    const relabel = !this._hass || language(h) !== language(this._hass);
    this._hass = h;
    if (relabel) this._render();
    else this._fillEntities();
  }

  _emit() {
    const c = { ...this._config };
    Object.keys(c).forEach((k) => {
      if (c[k] === '' || c[k] === undefined) delete c[k];
    });
    this._config = c;
    this._last = JSON.stringify(c);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
  }

  _set(k, v, rerender) {
    if (v === undefined || v === '' || v === null) delete this._config[k];
    else this._config[k] = v;
    this._emit();
    if (rerender) this._render();
  }

  _fillEntities() {
    const dl = this.shadowRoot.getElementById('ents');
    if (!dl || !this._hass) return;
    const ids = Object.keys(this._hass.states).filter((e) => e.startsWith('sensor.')).sort();
    if (dl.childElementCount === ids.length) return;
    dl.innerHTML = ids.map((e) => `<option value="${esc(e)}">${esc(this._hass.states[e].attributes.friendly_name || '')}</option>`).join('');
  }

  _render() {
    this._rendered = true;
    const lang = language(this._hass), L = (k, v) => t(lang, k, v);
    const c = this._config;
    const st = this._hass && c.entity ? this._hass.states[c.entity] : null;
    const r = resolve({ entity: c.entity || 'sensor.x', ...c }, st, lang);
    const p = PRESETS[r.preset];
    const unitAttr = st && st.attributes.unit_of_measurement;
    const zones = Array.isArray(c.zones) && c.zones.length ? c.zones : presetZones(r.preset, lang, unitAttr);
    const opt = (val, cur, text) => `<option value="${esc(val)}"${val === cur ? ' selected' : ''}>${esc(text)}</option>`;
    const presetLabel = (k) => L(`preset.${k}.label`) !== `preset.${k}.label` ? L(`preset.${k}.label`) : L(`preset.${k}`);
    const presetName = r.preset !== 'generic' ? L('preset.' + r.preset) : '';

    this.shadowRoot.innerHTML = `<style>${EDITOR_CSS}</style><div class="f">
      <div class="row">
        <label class="fl">${L('ed.entity')}<input type="text" id="entity" list="ents" value="${esc(c.entity || '')}" placeholder="sensor.…"><datalist id="ents"></datalist></label>
        <label class="fl">${L('ed.preset')}<select id="preset">
          ${opt('', c.preset || '', L('ed.auto') + (c.preset ? '' : ` (${presetLabel(r.preset)})`))}
          ${Object.keys(PRESETS).map((k) => opt(k, c.preset || '', presetLabel(k))).join('')}</select></label>
      </div>
      <div class="row">
        <label class="fl">${L('ed.name')}<input type="text" id="name" value="${esc(c.name || '')}" placeholder="${esc(presetName || (st && st.attributes.friendly_name) || '')}"></label>
        <label class="fl">${L('ed.subtitle')}<input type="text" id="subtitle" value="${esc(c.subtitle ?? '')}" placeholder="${esc(L('preset.' + r.preset + '.sub'))}"></label>
      </div>
      <div class="row">
        <label class="fl">${L('ed.icon')}<input type="text" id="icon" value="${esc(c.icon || '')}" placeholder="${esc(L('ed.icon.ph'))}"></label>
        <label class="fl">${L('ed.unit')}<input type="text" id="unit" value="${esc(c.unit ?? '')}" placeholder="${esc(r.unit)}"></label>
      </div>
      <div class="row">
        <div class="fl"><span>${L('ed.color')}</span><div class="col"><input type="color" id="color" value="${esc(r.color)}" aria-label="${esc(L('ed.color'))}"><button id="colreset" type="button">${L('ed.color.reset')}</button></div></div>
        <label class="fl">${L('ed.scale')}<select id="scale">${scaleIds().map((id) => opt(id, hasScale(r.scale) ? r.scale : 'pointer', L('scale.' + id))).join('')}</select></label>
      </div>
      <div class="row">
        <label class="fl">${L('ed.min')}<input type="number" id="min" value="${esc(c.min ?? '')}" placeholder="${esc(r.min)}" step="any"></label>
        <label class="fl">${L('ed.decimals')}<input type="number" id="decimals" value="${esc(c.decimals ?? '')}" placeholder="${esc(p.decimals)}" min="0" max="3" step="1"></label>
      </div>
      <label class="fl">${L('ed.tap')}<select id="tap">${opt('more-info', r.tap, L('ed.tap.more'))}${opt('none', r.tap, L('ed.tap.none'))}</select></label>
      <label class="chk"><input type="checkbox" id="show_state"${r.showState ? ' checked' : ''}>${L('ed.show_state')}</label>
      <label class="chk"><input type="checkbox" id="show_subtitle"${r.showSubtitle ? ' checked' : ''}>${L('ed.show_subtitle')}</label>
      <label class="chk"><input type="checkbox" id="animation"${r.animate ? ' checked' : ''}>${L('ed.animation')}</label>
      <label class="chk"><input type="checkbox" id="grain"${r.grain ? ' checked' : ''}>${L('ed.grain')}</label>
      <h4>${L('ed.zones')}</h4>
      <p class="hint">${L('ed.zones.hint')}${r.showState ? '' : L('ed.zones.off')}</p>
      <div class="zh"><span>${L('ed.zone.to')}</span><span>${L('ed.zone.color')}</span><span>${L('ed.zone.label')}</span><span></span></div>
      <div class="zones">${zones.map((q, j) => `<div class="zr">
        <input type="number" step="any" data-j="${j}" data-k="to" value="${esc(q.to)}" aria-label="${esc(L('ed.zone.to'))} ${j + 1}">
        <select data-j="${j}" data-k="level" aria-label="${esc(L('ed.zone.color'))} ${j + 1}">${Object.keys(LEVELS).map((k) => opt(k, q.level, L('level.' + k))).join('')}</select>
        <input type="text" data-j="${j}" data-k="label" value="${esc(q.label)}" aria-label="${esc(L('ed.zone.label'))} ${j + 1}">
        <button class="x" type="button" data-del="${j}" aria-label="${esc(L('ed.zone.del', { n: j + 1 }))}" ${zones.length < 2 ? 'disabled' : ''}>✕</button></div>`).join('')}</div>
      <div class="btns"><button id="zadd" type="button">${L('ed.zone.add')}</button><button id="zreset" type="button">${L('ed.zone.reset')}</button></div>
    </div>`;
    this._fillEntities();

    const $ = (id) => this.shadowRoot.getElementById(id);
    $('entity').addEventListener('change', (e) => this._set('entity', e.target.value.trim(), true));
    $('preset').addEventListener('change', (e) => {
      delete this._config.zones;
      delete this._config.color;
      this._set('preset', e.target.value, true);
    });
    ['name', 'subtitle', 'icon', 'unit'].forEach((k) => $(k).addEventListener('change', (e) => this._set(k, e.target.value)));
    $('color').addEventListener('input', (e) => this._set('color', e.target.value));
    $('colreset').addEventListener('click', () => this._set('color', undefined, true));
    $('scale').addEventListener('change', (e) => this._set('scale', e.target.value === 'pointer' ? undefined : e.target.value));
    $('min').addEventListener('change', (e) => {
      const n = parseFloat(e.target.value);
      this._set('min', Number.isFinite(n) ? n : undefined);
    });
    $('decimals').addEventListener('change', (e) => {
      const n = parseInt(e.target.value, 10);
      this._set('decimals', Number.isInteger(n) ? clamp(n, 0, 3) : undefined);
    });
    $('tap').addEventListener('change', (e) => this._set('tap_action', e.target.value === 'none' ? { action: 'none' } : undefined));
    // Defaults: show_state / show_subtitle / animation are on, grain is off. Only differences are written.
    $('show_state').addEventListener('change', (e) => this._set('show_state', e.target.checked ? undefined : false));
    $('show_subtitle').addEventListener('change', (e) => this._set('show_subtitle', e.target.checked ? undefined : false));
    $('animation').addEventListener('change', (e) => this._set('animation', e.target.checked ? undefined : false));
    $('grain').addEventListener('change', (e) => this._set('grain', e.target.checked ? true : undefined));

    const current = () => (Array.isArray(this._config.zones) && this._config.zones.length ? this._config.zones : zones)
      .map((q) => ({ to: q.to, level: q.level, label: q.label ?? '' }));
    this.shadowRoot.querySelectorAll('.zr [data-k]').forEach((el) => el.addEventListener('change', (e) => {
      const list = current(), j = +e.target.dataset.j, k = e.target.dataset.k;
      if (k === 'to') {
        const n = parseFloat(e.target.value);
        if (!Number.isFinite(n)) {
          e.target.value = list[j].to;
          return;
        }
        list[j].to = n;
      } else list[j][k] = e.target.value;
      const unsorted = k === 'to' && list.some((q, i) => i && q.to <= list[i - 1].to);
      if (unsorted) list.sort((a, b) => a.to - b.to);
      this._set('zones', list, unsorted);
    }));
    this.shadowRoot.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
      const list = current();
      list.splice(+b.dataset.del, 1);
      this._set('zones', list, true);
    }));
    $('zadd').addEventListener('click', () => {
      const list = current(), last = list[list.length - 1], prev = list.length > 1 ? list[list.length - 2].to : r.min;
      list.push({ to: +(last.to + (last.to - prev || 10)).toFixed(2), level: 'bad', label: '' });
      this._set('zones', list, true);
    });
    $('zreset').addEventListener('click', () => this._set('zones', undefined, true));
  }
}
