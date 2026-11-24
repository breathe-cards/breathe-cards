// Animation registry.
//
// An animation is an object:
//   id      – name used by presets (e.g. 'co2')
//   mask    – true: fade it out under the header and the value (particles);
//             false: draw over the whole card (e.g. the thermometer)
//   moving  – true when it needs a frame loop; false draws only when the value changes
//   draw(ctx, s) – s = { w, h, t, speed, v, f, color, zoneColor, store, animate,
//                        unavailable, compact, r, format }
//                  speed is 0 for a still frame and 1 while animating;
//                  store is a per-card object for particles that survives frames.
//
// To add one: create a file next to this, export the object, and add it below.

import co2 from './co2.js';
import voc from './voc.js';
import { pm25, pm10 } from './dust.js';
import humidity from './humidity.js';
import thermometer from './thermometer.js';

const ANIMATIONS = {};

export function registerAnimation(a) {
  ANIMATIONS[a.id] = a;
}

export function getAnimation(id) {
  return ANIMATIONS[id] || ANIMATIONS.none;
}

registerAnimation({ id: 'none', mask: false, moving: false, draw() {} });
[co2, voc, pm25, pm10, humidity, thermometer].forEach(registerAnimation);


export { particles } from './particles.js';
