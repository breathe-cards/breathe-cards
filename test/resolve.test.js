import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, presetFor, presetZones, zoneIndex, scalePosition, fraction } from '../src/core/resolve.js';
import { guessPreset, PRESETS } from '../src/core/presets.js';
import { language, t, languages, ENGLISH_KEYS, hasString } from '../src/core/i18n.js';
import '../src/translations/index.js';
import { getScale, registerScale } from '../src/scales/index.js';

const st = (state, attrs = {}) => ({ state: String(state), attributes: attrs });

test('preset comes from config, then device class, then entity id, then generic', () => {
  assert.equal(presetFor({ entity: 'sensor.x', preset: 'pm10' }, st(1, { device_class: 'pm25' })), 'pm10');
  assert.equal(presetFor({ entity: 'sensor.x' }, st(1, { device_class: 'carbon_dioxide' })), 'co2');
  assert.equal(presetFor({ entity: 'sensor.room_tvoc_density' }, st(1)), 'voc');
  assert.equal(presetFor({ entity: 'sensor.room_pm2_5' }, st(1)), 'pm25');
  assert.equal(presetFor({ entity: 'sensor.something' }, st(1)), 'generic');
  assert.equal(presetFor({ entity: 'sensor.x', preset: 'nope' }, null), 'generic');
});

test('guessPreset recognises common names', () => {
  assert.equal(guessPreset('sensor.office_co2'), 'co2');
  assert.equal(guessPreset('sensor.bedroom_humidity'), 'humidity');
  assert.equal(guessPreset('sensor.kitchen_temperature'), 'temperature');
  assert.equal(guessPreset('sensor.pm10_density'), 'pm10');
  assert.equal(guessPreset(undefined), null);
});

test('defaults: pointer scale, state words, animation on, grain off', () => {
  const r = resolve({ entity: 'sensor.co2', preset: 'co2' }, st(800), 'en');
  assert.equal(r.scale, 'pointer');
  assert.equal(r.showState, true);
  assert.equal(r.animate, true);
  assert.equal(r.grain, false);
  assert.equal(r.tap, 'more-info');
  assert.equal(r.min, 400);
  assert.equal(r.max, 2000);
  assert.equal(r.zones[0].label, 'Excellent');
});

test('labels follow the language', () => {
  const r = resolve({ entity: 'sensor.t', preset: 'temperature' }, st(21), 'uk');
  assert.equal(r.zones[2].label, 'Комфортно');
  assert.equal(r.name, 'Температура');
});

test('custom zones are sorted, invalid ones dropped, colours validated', () => {
  const r = resolve({
    entity: 'sensor.x',
    zones: [{ to: 30, level: 'bad', label: 'C' }, { to: 'oops' }, { to: 10, level: 'unknown', label: 'A', color: 'red' }, { to: 20, level: 'fair', color: '#123456' }],
  }, st(5), 'en');
  assert.deepEqual(r.zones.map((z) => z.to), [10, 20, 30]);
  assert.equal(r.zones[0].level, 'good');
  assert.equal(r.zones[0].color, null);
  assert.equal(r.zones[1].color, '#123456');
  assert.equal(r.zones[1].label, '');
});

test('min below the first zone is enforced', () => {
  const r = resolve({ entity: 'sensor.x', preset: 'co2', min: 5000 }, st(1), 'en');
  assert.ok(r.min < r.zones[0].to);
});

test('options can be switched off', () => {
  const r = resolve({ entity: 'sensor.x', preset: 'co2', show_state: false, animation: false, grain: true, scale: 'ring', tap_action: { action: 'none' } }, st(1), 'en');
  assert.equal(r.showState, false);
  assert.equal(r.animate, false);
  assert.equal(r.grain, true);
  assert.equal(r.scale, 'ring');
  assert.equal(r.tap, 'none');
  assert.equal(resolve({ entity: 'sensor.x' }, null, 'en').scale, 'pointer');
  assert.equal(getScale(resolve({ entity: 'sensor.x', scale: 'weird' }, null, 'en').scale).id, 'pointer');
});

test('custom colour builds a background, preset colour keeps the hand-picked one', () => {
  const a = resolve({ entity: 'sensor.x', preset: 'co2' }, null, 'en');
  assert.deepEqual(a.background, PRESETS.co2.background);
  const b = resolve({ entity: 'sensor.x', preset: 'co2', color: '#ff0000' }, null, 'en');
  assert.equal(b.color, '#ff0000');
  assert.match(b.background[0], /^#[0-9a-f]{6}$/);
});

test('temperature presets switch to Fahrenheit when the sensor reports °F', () => {
  const r = resolve({ entity: 'sensor.t', preset: 'temperature' }, st(70, { unit_of_measurement: '°F' }), 'en');
  assert.equal(r.unit, '°F');
  assert.equal(r.zones[2].to, 75);
  assert.equal(r.min, 57);
  assert.equal(presetZones('temperature', 'en', '°C')[2].to, 24);
});

test('zone lookup and equal-width scale position', () => {
  const r = resolve({ entity: 'sensor.co2', preset: 'co2' }, null, 'en');
  assert.equal(zoneIndex(r, 400), 0);
  assert.equal(zoneIndex(r, 800), 0);
  assert.equal(zoneIndex(r, 801), 1);
  assert.equal(zoneIndex(r, 99999), 3);
  assert.equal(scalePosition(r, 400), 0);
  assert.equal(scalePosition(r, 800), 0.25);
  assert.equal(scalePosition(r, 900), 0.375);
  assert.equal(scalePosition(r, 2000), 1);
  assert.equal(scalePosition(r, 5000), 1);
  assert.equal(scalePosition(r, 0), 0);
  assert.equal(fraction(r, 1200), 0.5);
});

test('every language defines every key (no silent English fallback)', () => {
  const neutral = new Set(['preset.co2', 'preset.voc', 'preset.pm25', 'preset.pm10', 'preset.generic.sub']);
  assert.ok(languages().length >= 25, 'expected 25+ languages');
  assert.ok(!languages().includes('ru'));
  for (const lang of languages()) {
    for (const k of ENGLISH_KEYS) {
      if (!neutral.has(k)) assert.ok(hasString(lang, k), `${lang} misses ${k}`);
    }
    assert.ok(t(lang, 'ed.zone.del', { n: 3 }).includes('3'), `${lang}: {n} placeholder lost`);
  }
});

test('language detection: exact code, base language, aliases, English fallback', () => {
  assert.equal(language({ locale: { language: 'uk' } }), 'uk');
  assert.equal(language({ language: 'uk-UA' }), 'uk');
  assert.equal(language({ locale: { language: 'de' } }), 'de');
  assert.equal(language({ locale: { language: 'de-AT' } }), 'de');
  assert.equal(language({ locale: { language: 'pt-BR' } }), 'pt-BR');
  assert.equal(language({ locale: { language: 'pt' } }), 'pt');
  assert.equal(language({ locale: { language: 'zh-Hant' } }), 'zh-Hant');
  assert.equal(language({ locale: { language: 'zh-TW' } }), 'zh-Hant');
  assert.equal(language({ locale: { language: 'zh' } }), 'zh-Hans');
  assert.equal(language({ locale: { language: 'no' } }), 'nb');
  assert.equal(language({ locale: { language: 'ru' } }), 'en');
  assert.equal(language({ locale: { language: 'xx' } }), 'en');
});

test('every preset has ascending zones and known levels', () => {
  for (const [k, p] of Object.entries(PRESETS)) {
    p.zones.forEach((z, i) => {
      if (i) assert.ok(z.to > p.zones[i - 1].to, `${k} zones not ascending`);
      assert.ok(['good', 'fair', 'bad', 'cold', 'wet'].includes(z.level), `${k} unknown level`);
    });
    assert.ok(p.min < p.zones[0].to, `${k} min too high`);
  }
});

test('a registered add-on scale is used by name', () => {
  registerScale({ id: 'dots', slot: 'bottom', css: '', html: () => '', update() {} });
  assert.equal(getScale(resolve({ entity: 'sensor.x', scale: 'dots' }, null, 'en').scale).id, 'dots');
});
