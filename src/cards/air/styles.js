// Styles of the air card. The card keeps its own dark look in light and dark HA themes,
// so the illustration and the zone colours read the same everywhere.

export const CARD_CSS = `
:host{display:block;height:100%}
ha-card{position:relative;display:block;height:100%;min-height:200px;overflow:hidden;isolation:isolate;border:none;
  border-radius:var(--ha-card-border-radius,24px);color:#F5F2EA;cursor:pointer;-webkit-tap-highlight-color:transparent;
  background:radial-gradient(120% 70% at 100% 0%,var(--bc-glow),transparent 60%),linear-gradient(170deg,var(--bc-b1),var(--bc-b2));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.09),inset 0 0 0 1px rgba(255,255,255,.05),0 14px 30px -12px rgba(0,0,0,.45)}
ha-card.static{cursor:default}
ha-card:focus-visible{outline:2px solid rgba(245,242,234,.7);outline-offset:2px}
ha-card::after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background-image:var(--bc-noise);opacity:.07;mix-blend-mode:overlay}
ha-card.nograin::after{display:none}
canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
canvas.mask{-webkit-mask-image:linear-gradient(to bottom,transparent 12%,#000 30%,#000 46%,transparent 72%);mask-image:linear-gradient(to bottom,transparent 12%,#000 30%,#000 46%,transparent 72%)}
.ct{position:relative;z-index:1;height:100%;box-sizing:border-box;padding:16px 16px 14px;display:flex;flex-direction:column;container-type:inline-size;
  font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif));font-variant-numeric:tabular-nums}
.hd{display:flex;align-items:center;gap:10px;min-width:0}
.ico{width:32px;height:32px;border-radius:11px;display:grid;place-items:center;flex:none;color:var(--bc-acc);
  background:color-mix(in srgb,var(--bc-acc) 18%,rgba(0,0,0,.25));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--bc-acc) 25%,transparent)}
.ico svg{width:18px;height:18px}
.ico ha-icon{--mdc-icon-size:18px}
.nm{min-width:0;line-height:1.2}
.nm b{display:block;font-weight:500;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm span{display:block;font-size:12px;color:rgba(245,242,234,.42);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.grow{flex:1;min-height:4px}
.val{display:flex;align-items:baseline;gap:5px;min-width:0}
.num{font-weight:300;font-size:clamp(30px,23cqw,60px);letter-spacing:-.04em;line-height:.95;white-space:nowrap}
.u{color:rgba(245,242,234,.66);font-size:clamp(12px,6.5cqw,15px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.scl{margin-top:12px}
.scl:empty{display:none}
.compact .nm span{display:none}
.compact .ct{padding:12px 14px 10px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

export const EDITOR_CSS = `
:host{display:block}
.f{display:flex;flex-direction:column;gap:14px;font-family:var(--ha-font-family-body,system-ui,sans-serif);color:var(--primary-text-color)}
.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.fl{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--secondary-text-color)}
input[type=text],input[type=number],select{font:inherit;font-size:14px;color:var(--primary-text-color);background:var(--input-fill-color,var(--secondary-background-color,rgba(127,127,127,.08)));
  border:1px solid var(--divider-color,rgba(127,127,127,.3));border-radius:8px;padding:9px 10px;min-width:0;width:100%;box-sizing:border-box}
input:focus,select:focus{outline:2px solid var(--primary-color);outline-offset:-1px}
.chk{display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}
.chk input{width:18px;height:18px;accent-color:var(--primary-color);margin:0;flex:none}
.col{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.col input[type=color]{width:44px;height:36px;border:1px solid var(--divider-color,rgba(127,127,127,.3));border-radius:8px;padding:2px;background:none;cursor:pointer}
button{font:inherit;font-size:13px;color:var(--primary-color);background:none;border:1px solid var(--divider-color,rgba(127,127,127,.3));border-radius:8px;padding:7px 12px;cursor:pointer}
button:hover{background:rgba(127,127,127,.08)}
button:disabled{opacity:.4;cursor:default}
h4{margin:6px 0 0;font-size:14px;font-weight:500}
.hint{font-size:12px;color:var(--secondary-text-color);margin:-6px 0 0}
.zh,.zr{display:grid;grid-template-columns:minmax(64px,90px) minmax(110px,1fr) minmax(90px,1.4fr) 36px;gap:6px;align-items:center}
.zh{font-size:11px;color:var(--secondary-text-color)}
.zr .x{padding:0;width:36px;height:36px;color:var(--error-color,#db4437)}
.zones{display:flex;flex-direction:column;gap:6px}
.btns{display:flex;gap:8px;flex-wrap:wrap}
`;
