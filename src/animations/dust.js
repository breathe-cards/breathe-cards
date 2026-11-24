// Dust: particles drifting in the air with a light haze.
// PM2.5 – many fine twinkling specks; PM10 – fewer, much larger soft particles that slowly settle.
import { clamp, rgba } from '../core/util.js';
import { particles } from './particles.js';

function haze(ctx, s, count, spread, strength) {
  const { w, h, t, speed: sp, color: col, f } = s;
  for (let k = 0; k < count; k++) {
    const hx = w * (0.25 + spread * k), hy = h * (0.27 + 0.11 * Math.sin(t * 0.0003 * sp + k * 2)), hr = w * 0.58;
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
    g.addColorStop(0, rgba(col, 0.03 + strength * f));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
}

export const pm25 = {
  id: 'pm25',
  mask: true,
  moving: true,
  draw(ctx, s) {
    if (!s.animate) return;
    const { w, h, t, speed: sp, color: col } = s, R = Math.random;
    haze(ctx, s, 3, 0.35, 0.16);
    const list = particles(s.store, Math.round(110 + clamp(s.v, 0, 150) * 7), () => ({ x: R() * w, y: R() * h, z: 0.4 + R() * 0.9, ph: R() * 6 }));
    for (const p of list) {
      p.x = (p.x + (Math.sin(t * 0.0008 + p.ph) * 0.18 + 0.05) * p.z * sp + w) % w;
      p.y = (p.y + Math.cos(t * 0.001 + p.ph * 1.3) * 0.16 * p.z * sp + h) % h;
      const tw = 0.55 + 0.45 * Math.sin(t * 0.003 * sp + p.ph * 5);
      ctx.fillStyle = rgba(col, (0.25 + (0.65 * (p.z - 0.4)) / 0.9) * tw);
      ctx.beginPath(); ctx.arc(p.x, p.y, 0.7 * p.z + 0.25, 0, 7); ctx.fill();
    }
  },
};

export const pm10 = {
  id: 'pm10',
  mask: true,
  moving: true,
  draw(ctx, s) {
    if (!s.animate) return;
    const { w, h, t, speed: sp, color: col } = s, R = Math.random;
    haze(ctx, s, 2, 0.4, 0.12);
    const list = particles(s.store, Math.round(30 + clamp(s.v, 0, 300) * 1.4), () => ({ x: R() * w, y: R() * h, z: 0.4 + R() * 0.9, ph: R() * 6 }));
    for (const p of list) {
      p.x = (p.x + (Math.sin(t * 0.0006 + p.ph) * 0.13 + 0.035) * p.z * sp + w) % w;
      p.y = (p.y + (0.035 + Math.cos(t * 0.0008 + p.ph * 1.3) * 0.08) * p.z * sp + h) % h;
      const tw = 0.8 + 0.2 * Math.sin(t * 0.0015 * sp + p.ph * 5);
      const al = (0.3 + (0.6 * (p.z - 0.4)) / 0.9) * tw, rad = (0.7 * p.z + 0.25) * 5.5;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      g.addColorStop(0, rgba(col, al)); g.addColorStop(0.6, rgba(col, al * 0.8)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 7); ctx.fill();
    }
  },
};
