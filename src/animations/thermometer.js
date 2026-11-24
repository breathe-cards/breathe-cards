// Temperature: a glass thermometer with ticks and a comfort band; the liquid takes the zone colour.
// Drawn even with animation off (it is part of the reading); the warm haze is the animated part.
import { rgba } from '../core/util.js';
import { LEVELS } from '../core/presets.js';
import { fraction, zoneStart } from '../core/resolve.js';

export default {
  id: 'thermometer',
  mask: false,
  moving: false,
  draw(ctx, s) {
    const { w, h, r, compact } = s;
    const x = w - 26, top = compact ? 50 : 58, bot = h - (compact ? 112 : 128);
    if (bot - top < 30 || w < 140) return;
    const zc = s.unavailable ? '#8a8f96' : s.zoneColor;
    const ty = (d) => bot - (bot - top) * fraction(r, d);
    const yv = s.unavailable ? bot : ty(s.v);

    if (!s.unavailable && s.animate) {
      const g = ctx.createRadialGradient(x, bot, 4, x, bot, w * 0.9);
      g.addColorStop(0, rgba(zc, 0.1 + 0.25 * s.f)); g.addColorStop(1, rgba(zc, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    const good = r.zones.map((q, i) => [q, i]).filter(([q]) => q.level === 'good');
    if (good.length) {
      const lo = zoneStart(r, good[0][1]), hi = good[good.length - 1][0].to;
      ctx.fillStyle = rgba(LEVELS.good, 0.55);
      ctx.beginPath(); ctx.roundRect(x - 23, ty(hi), 3, ty(lo) - ty(hi), 1.5); ctx.fill();
    }

    const span = r.max - r.min;
    const step = span <= 20 ? 1 : span <= 50 ? 5 : Math.pow(10, Math.floor(Math.log10(span / 10)));
    const px = (bot - top) / (span / step), every = Math.max(2, Math.ceil(18 / px / 2) * 2);
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    let k = 0;
    for (let d = Math.ceil(r.min / step) * step; d <= r.max + 1e-9; d += step, k++) {
      const y = ty(d), major = k % 2 === 0, L = major ? 7 : 3;
      ctx.strokeStyle = major ? 'rgba(245,242,234,.5)' : 'rgba(245,242,234,.25)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 11 - L, y); ctx.lineTo(x - 11, y); ctx.stroke();
      if (k % every === 0 && !compact) {
        ctx.fillStyle = 'rgba(245,242,234,.45)';
        ctx.fillText(s.format(d, true) + '°', x - 28, y + 3.5);
      }
    }

    const tube = ctx.createLinearGradient(x - 7, 0, x + 7, 0);
    tube.addColorStop(0, 'rgba(255,255,255,.10)'); tube.addColorStop(0.5, 'rgba(255,255,255,.22)'); tube.addColorStop(1, 'rgba(255,255,255,.06)');
    ctx.fillStyle = tube;
    ctx.beginPath(); ctx.roundRect(x - 7, top - 8, 14, bot - top + 16, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x, bot + 18, 13, 0, 7); ctx.fill();
    const liq = ctx.createLinearGradient(0, yv, 0, bot + 30);
    liq.addColorStop(0, '#ffffff'); liq.addColorStop(1, zc);
    ctx.fillStyle = liq;
    ctx.beginPath(); ctx.roundRect(x - 3.5, yv, 7, Math.max(0, bot + 12 - yv), 3.5); ctx.fill();
    ctx.beginPath(); ctx.arc(x, bot + 18, 9, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath(); ctx.arc(x - 3, bot + 14, 2.6, 0, 7); ctx.fill();
  },
};
