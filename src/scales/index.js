// Scale registry.
//
// A scale is an object:
//   id      – value of the `scale:` option
//   slot    – 'bottom' (under the value), 'value' (next to the number) or 'none'
//   css     – styles for its markup (added to the card once)
//   html(r, format)      – markup, built when the config changes
//   layout(el)           – optional, runs after a resize (e.g. hide labels that collide)
//   update(el, r, info)  – runs every frame the value moves; info = { v, pos, index, zone,
//                          color, unavailable, changed, text } (changed: zone or rounded value changed)
//
// To add one: create a file next to this, export the object and add it below.
// The editor lists every registered scale; give it a translation key 'scale.<id>'.

import pointer from './pointer.js';
import segments from './segments.js';
import ring from './ring.js';

const SCALES = {};

export function registerScale(s) {
  SCALES[s.id] = s;
}
export function getScale(id) {
  return SCALES[id] || SCALES.pointer;
}
export function hasScale(id) {
  return !!SCALES[id];
}
export function scaleIds() {
  return Object.keys(SCALES);
}
export function scalesCss() {
  return Object.values(SCALES).map((s) => s.css || '').join('\n');
}

[pointer, segments, ring].forEach(registerScale);
registerScale({ id: 'none', slot: 'none', css: '', html: () => '', update() {} });
