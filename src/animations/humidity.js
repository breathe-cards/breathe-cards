// Humidity: drifting mist and slowly falling droplets. More humidity, denser mist and more drops.
import { rgba } from '../core/util.js';
import { particles } from './particles.js';

export default {
  id: 'humidity',
  mask: true,
  moving: true,
  draw(ctx, s) {
    if (!s.animate) return;
    const { w, h, t, speed: sp, color: col, f, store } = s, R = Math.random;
    if (!store.fog) store.fog = Array.from({ length: 5 }, (_, k) => ({ x: R() * w, y: 30 + R() * h * 0.45, r: 60 + R() * 60, v: 0.08 + R() * 0.12, ph: k }));
    for (const m of store.fog) {
      m.x += m.v * sp;
      if (m.x - m.r > w) m.x = -m.r;
      const yy = m.y + Math.sin(t * 0.0004 + m.ph) * 6;
      const g = ctx.createRadialGradient(m.x, yy, 0, m.x, yy, m.r);
      g.addColorStop(0, rgba(col, 0.05 + 0.22 * f)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(m.x, yy, m.r, m.r * 0.55, 0, 0, 7); ctx.fill();
    }
    const list = particles(store, Math.round(10 + f * 55), () => ({ x: R() * w, y: R() * h * 0.75, z: 0.5 + R() * 0.8, ph: R() * 6, v: 0.04 + R() * 0.1 }));
    for (const p of list) {
      p.y += p.v * p.z * sp;
      p.x += Math.sin(t * 0.0006 + p.ph) * 0.12 * sp;
      if (p.y > h * 0.75) { p.y = -6; p.x = R() * w; }
      const r = 2.2 * p.z, al = 0.3 + (0.6 * (p.z - 0.5)) / 0.8, x = p.x, y = p.y;
      const g = ctx.createLinearGradient(x, y - r * 1.6, x, y + r);
      g.addColorStop(0, rgba('#ffffff', al * 0.9)); g.addColorStop(1, rgba(col, al * 0.8));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.7);
      ctx.bezierCurveTo(x + r * 0.35, y - r * 0.9, x + r, y - r * 0.25, x + r, y + r * 0.15);
      ctx.arc(x, y + r * 0.15, r, 0, Math.PI);
      ctx.bezierCurveTo(x - r, y - r * 0.25, x - r * 0.35, y - r * 0.9, x, y - r * 1.7);
      ctx.fill();
    }
  },
};
