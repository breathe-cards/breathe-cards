// CO₂: slow rising bubbles, the larger ones carry the "CO₂" label. More CO₂, more bubbles.
import { clamp, rgba } from '../core/util.js';
import { particles } from './particles.js';

export default {
  id: 'co2',
  mask: true,
  moving: true,
  draw(ctx, s) {
    if (!s.animate) return;
    const { w, h, t, speed: sp, color: col } = s, R = Math.random;
    const n = Math.round(9 + clamp(s.v - 400, 0, 2000) / 40);
    const list = particles(s.store, n, () => {
      const r = R() < 0.38 ? 9 + R() * 5 : 1.6 + R() * 3.4;
      return { x: R() * w, y: R() * h, r, v: 0.05 + R() * 0.08 - (r > 8 ? 0.02 : 0), ph: R() * 6 };
    });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const p of list) {
      p.y -= p.v * sp;
      p.x += Math.sin(t * 0.0006 + p.ph) * 0.07 * sp;
      if (p.y < -p.r - 4) { p.y = h + p.r + 4; p.x = R() * w; }
      const big = p.r > 8, a = big ? 0.75 : 0.5;
      ctx.fillStyle = rgba(col, big ? 0.12 : 0.07);
      ctx.strokeStyle = rgba(col, a);
      ctx.lineWidth = big ? 1.2 : 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.stroke();
      if (big) {
        ctx.fillStyle = 'rgba(245,242,234,.85)';
        ctx.font = `500 ${(p.r * 0.62).toFixed(1)}px system-ui, sans-serif`;
        ctx.fillText('CO₂', p.x, p.y + 0.5);
      } else {
        ctx.fillStyle = rgba('#ffffff', a * 0.8);
        ctx.beginPath(); ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.38, Math.max(0.6, p.r * 0.22), 0, 7); ctx.fill();
      }
    }
  },
};
