// One bar per zone; the current zone opens up and shows its name.
import { esc } from '../core/util.js';
import { zoneColor } from '../core/resolve.js';

export default {
  id: 'segments',
  slot: 'bottom',
  css: `
.sB{display:flex;align-items:center;gap:4px;height:24px}
.sB i{flex:1 1 0;height:5px;min-width:6px;border-radius:3px;background:var(--z);opacity:.3;overflow:hidden;display:flex;align-items:center;justify-content:center;font-style:normal;transition:all .4s}
.sB i span{font-size:11.5px;color:var(--z);white-space:nowrap;display:none}
.sB i.on{opacity:1}
.sB:not(.nolab) i.on{flex:0 1 auto;height:24px;padding:0 10px;border-radius:8px;background:color-mix(in srgb,var(--z) 18%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--z) 50%,transparent)}
.sB:not(.nolab) i.on span{display:block;overflow:hidden;text-overflow:ellipsis}
.sB.nolab i.on{height:8px}`,
  html(r) {
    return `<div class="sB${r.showState ? '' : ' nolab'}">${r.zones.map((q) => `<i style="--z:${zoneColor(q)}"><span>${esc(q.label)}</span></i>`).join('')}</div>`;
  },
  update(el, r, info) {
    if (!info.changed) return;
    el.querySelectorAll('.sB i').forEach((g, j) => g.classList.toggle('on', !info.unavailable && j === info.index));
  },
};
