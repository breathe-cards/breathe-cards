// Zone track with equal-width zones, boundary values above it, a caret under the current
// value and the state word hanging from the caret.
import { clamp, esc } from '../core/util.js';
import { zoneColor } from '../core/resolve.js';

export default {
  id: 'pointer',
  slot: 'bottom',
  css: `
.sA{position:relative;padding-top:14px}
.sA .nums{position:absolute;top:0;left:0;right:0;height:12px;font-size:10px;color:rgba(245,242,234,.42)}
.sA .nums span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.sA .nums span.s{transform:none}.sA .nums span.e{transform:translateX(-100%)}
.sA .trk{display:flex;gap:2px;height:4px}
.sA .trk i{flex:1;border-radius:2px;background:var(--z);opacity:.3;transition:opacity .4s}
.sA .trk i.on{opacity:1}
.sA .mk{position:absolute;top:21px;width:0;height:0;margin-left:-5px;border:5px solid transparent;border-top:0;border-bottom:6px solid #F5F2EA;transition:opacity .3s}
.sA .lab{position:relative;height:18px;margin-top:9px}
.sA.nolab .lab{height:0;margin-top:6px}
.sA .lab span{position:absolute;top:0;font-size:12.5px;font-weight:500;white-space:nowrap;color:var(--sc)}
.compact .sA{padding-top:0}.compact .sA .nums{display:none}.compact .sA .mk{top:7px}
.unavail .sA .mk{opacity:0}`,
  html(r, format) {
    const n = r.zones.length, marks = [r.min, ...r.zones.map((q) => q.to)];
    return `<div class="sA${r.showState ? '' : ' nolab'}">
      <div class="nums">${marks.map((m, k) => `<span class="${k === 0 ? 's' : k === n ? 'e' : ''}" style="left:${((k / n) * 100).toFixed(2)}%">${esc(format(m, true))}</span>`).join('')}</div>
      <div class="trk">${r.zones.map((q) => `<i style="--z:${zoneColor(q)}"></i>`).join('')}</div>
      <span class="mk"></span><div class="lab"><span></span></div></div>`;
  },
  layout(el) {
    const sp = [...el.querySelectorAll('.nums span')];
    if (!sp.length) return;
    sp.forEach((e) => (e.style.visibility = ''));
    const box = sp.map((e) => e.getBoundingClientRect()), last = box[box.length - 1];
    let prev = box[0];
    for (let i = 1; i < sp.length - 1; i++) {
      if (box[i].left < prev.right + 4 || box[i].right > last.left - 4) sp[i].style.visibility = 'hidden';
      else prev = box[i];
    }
  },
  update(el, r, info) {
    const root = el.firstElementChild;
    if (!root) return;
    const lb = root.querySelector('.lab span');
    if (info.unavailable) {
      if (info.changed) {
        root.querySelectorAll('.trk i').forEach((g) => g.classList.remove('on'));
        if (r.showState) { lb.textContent = info.text; lb.style.setProperty('--sc', 'rgba(245,242,234,.45)'); lb.style.left = '0px'; }
      }
      return;
    }
    root.querySelector('.mk').style.left = (info.pos * 100).toFixed(2) + '%';
    if (info.changed) root.querySelectorAll('.trk i').forEach((g, j) => g.classList.toggle('on', j === info.index));
    if (r.showState) {
      if (lb.textContent !== info.zone.label) lb.textContent = info.zone.label;
      lb.style.setProperty('--sc', info.color);
      const W = root.clientWidth, lw = lb.offsetWidth;
      lb.style.left = clamp(info.pos * W - lw / 2, 0, Math.max(0, W - lw)).toFixed(1) + 'px';
    }
  },
};
