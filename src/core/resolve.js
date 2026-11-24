// Turns a user config + the current sensor state into everything a card renders.
// Pure functions only, so they are covered by unit tests.

import { clamp, hex, mix } from './util.js';
import { LEVELS, PRESETS, ICONS, DEVICE_CLASS_PRESET, guessPreset } from './presets.js';
import { t } from './i18n.js';

const cToF = (c) => Math.round((c * 9) / 5 + 32);

export function presetFor(cfg, stateObj) {
  if (cfg.preset && PRESETS[cfg.preset]) return cfg.preset;
  const dc = stateObj && stateObj.attributes && stateObj.attributes.device_class;
  return (dc && DEVICE_CLASS_PRESET[dc]) || guessPreset(cfg.entity) || 'generic';
}

/** Default zones of a preset with labels in the given language (and °F when the sensor reports °F). */
export function presetZones(key, lang, unitAttr) {
  const p = PRESETS[key] || PRESETS.generic;
  const f = key === 'temperature' && /F/i.test(unitAttr || '');
  return p.zones.map((zz) => ({ to: f ? cToF(zz.to) : zz.to, level: zz.level, label: t(lang, zz.labelKey) }));
}

export function resolve(cfg, stateObj, lang = 'en') {
  const key = presetFor(cfg, stateObj);
  const p = PRESETS[key];
  const unitAttr = stateObj && stateObj.attributes && stateObj.attributes.unit_of_measurement;
  const fahrenheit = key === 'temperature' && /F/i.test(unitAttr || '');

  let zones = Array.isArray(cfg.zones) && cfg.zones.length ? cfg.zones : presetZones(key, lang, unitAttr);
  zones = zones
    .map((q) => ({
      to: Number(q.to),
      level: LEVELS[q.level] ? q.level : 'good',
      label: q.label == null ? '' : String(q.label),
      color: hex(q.color),
    }))
    .filter((q) => Number.isFinite(q.to))
    .sort((a, b) => a.to - b.to);
  if (!zones.length) zones = presetZones(key, lang, unitAttr).map((q) => ({ ...q, color: null }));

  let min = Number(cfg.min);
  if (cfg.min === undefined || cfg.min === null || cfg.min === '' || !Number.isFinite(min)) min = fahrenheit ? cToF(p.min) : p.min;
  if (min >= zones[0].to) min = zones[0].to - Math.max(1, Math.abs(zones[0].to) * 0.5);

  const color = hex(cfg.color) || p.color;
  const background = !hex(cfg.color) && p.background ? p.background : [mix(color, '#0a0f0c', 0.3), mix(color, '#070908', 0.09)];
  const decimals = Number.isInteger(cfg.decimals) ? clamp(cfg.decimals, 0, 3) : p.decimals;
  const presetUnit = p.unitKey ? t(lang, p.unitKey) : fahrenheit ? '°F' : p.unit;
  const friendly = stateObj && stateObj.attributes && stateObj.attributes.friendly_name;

  return {
    preset: key,
    animation: p.animation,
    icon: cfg.icon || null,
    svgIcon: ICONS[p.icon] || ICONS.gauge,
    name: cfg.name || (key !== 'generic' ? t(lang, 'preset.' + key) : '') || friendly || cfg.entity,
    subtitle: cfg.subtitle != null ? String(cfg.subtitle) : t(lang, 'preset.' + key + '.sub'),
    showSubtitle: cfg.show_subtitle !== false,
    unit: cfg.unit != null ? String(cfg.unit) : presetUnit || unitAttr || '',
    min,
    max: zones[zones.length - 1].to,
    zones,
    decimals,
    color,
    background,
    // Any registered scale id; the card falls back to 'pointer' for an unknown one.
    scale: typeof cfg.scale === 'string' && cfg.scale ? cfg.scale : 'pointer',
    showState: cfg.show_state !== false,
    animate: cfg.animation !== false,
    grain: cfg.grain === true,
    tap: (cfg.tap_action && cfg.tap_action.action) || 'more-info',
  };
}

export const zoneIndex = (r, v) => {
  const i = r.zones.findIndex((q) => v <= q.to);
  return i < 0 ? r.zones.length - 1 : i;
};
export const zoneStart = (r, i) => (i ? r.zones[i - 1].to : r.min);
export const zoneColor = (q) => q.color || LEVELS[q.level];

/** Position 0..1 on the scale. Every zone gets the same width, values move linearly inside a zone. */
export function scalePosition(r, v) {
  const n = r.zones.length, i = zoneIndex(r, v), a = zoneStart(r, i), b = r.zones[i].to;
  return clamp((i + clamp((v - a) / (b - a || 1), 0, 1)) / n, 0, 1);
}

/** Linear 0..1 between min and max, used by illustrations. */
export const fraction = (r, v) => clamp((v - r.min) / (r.max - r.min || 1), 0, 1);
