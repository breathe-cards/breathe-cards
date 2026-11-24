// VOC: rising wisps of vapour. More VOC, more wisps.
import { clamp, rgba } from '../core/util.js';

export default {
  id: 'voc',
  mask: true,
  moving: true,
  draw(ctx, s) {
    if (!s.animate) return;
    const { w, h, t, speed: sp, color: col } = s;
    const n = Math.round(3 + clamp(s.v, 0, 500) / 38), base = h * 0.85;
    for (let k = 0; k < n; k++) {
      const x0 = w * (0.3 + (0.62 * (k + 0.5)) / n), lw = [1, 2.2, 4][k % 3];
      const g = ctx.createLinearGradient(0, base, 0, 0);
      g.addColorStop(0, rgba(col, 0));
      g.addColorStop(0.25, rgba(col, lw > 3 ? 0.22 : 0.75));
      g.addColorStop(1, rgba(col, 0));
      ctx.strokeStyle = g; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath();
      for (let y = base; y >= 0; y -= 3) {
        const q = base - y;
        const x = x0 + Math.sin(y * 0.035 - t * 0.0009 * sp + k * 2.1) * (4 + q * 0.09) + Math.sin(y * 0.011 + k) * 6;
        if (y === base) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },
};
