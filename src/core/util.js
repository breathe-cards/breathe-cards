// Small, dependency-free helpers shared by every card.

export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Returns a normalised "#rrggbb" or null. */
export const hex = (h) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h ?? '').trim());
  return m ? '#' + m[1].toLowerCase() : null;
};

export const rgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgba = (h, a) => {
  const [r, g, b] = rgb(h);
  return `rgba(${r},${g},${b},${a})`;
};

/** Linear mix of two hex colours, k = share of the first one. */
export const mix = (a, b, k) => {
  const x = rgb(a), y = rgb(b);
  return '#' + x.map((v, i) => Math.round(v * k + y[i] * (1 - k)).toString(16).padStart(2, '0')).join('');
};

export const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let noiseUrl = null;
/** A tiny grain texture, generated once. Empty string when canvas is unavailable. */
export function noise() {
  if (noiseUrl !== null) return noiseUrl;
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 140;
    const x = c.getContext('2d'), d = x.createImageData(140, 140);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    x.putImageData(d, 0, 0);
    noiseUrl = c.toDataURL();
  } catch (e) {
    noiseUrl = '';
  }
  return noiseUrl;
}
