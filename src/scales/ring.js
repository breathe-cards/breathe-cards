// A small ring next to the number: fill = position on the scale, colour = state. No words.

export default {
  id: 'ring',
  slot: 'value',
  css: `
.ring{margin-left:auto;align-self:center;flex:none}
.ring svg{display:block;width:clamp(30px,18cqw,40px);height:auto}`,
  html() {
    return '';
  },
  update(el, r, info) {
    if (!info.changed) return;
    if (info.unavailable) { el.innerHTML = ''; return; }
    const rr = 16, L = 2 * Math.PI * rr, c = info.color;
    el.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="${rr}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="4"/>
      <circle cx="20" cy="20" r="${rr}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="${(L * Math.max(info.pos, 0.02)).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 20 20)"/>
      <circle cx="20" cy="20" r="5" fill="${c}"/></svg>`;
  },
};
