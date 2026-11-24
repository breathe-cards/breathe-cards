# Contributing

Thanks for helping. The project is built so that new looks and new cards are added as separate files, without touching the rest.

## Setup

```bash
npm install
npm run watch                 # rebuilds dist/breathe-cards.js on save
python3 -m http.server 8000   # then open http://localhost:8000/demo/
npm test                      # before every pull request
```

`dist/breathe-cards.js` is committed, because HACS installs that file. Run `npm run build` and commit the result together with your source change; CI checks that they match.

## Layout

```
src/
  index.js              entry point, registers every card
  core/
    meta.js             project name, element prefix, card-picker registration
    i18n.js             translations (en, uk)
    presets.js          sensor types: colour, icon, unit, default zones
    resolve.js          config → what the card renders (pure, unit-tested)
    util.js             helpers
  animations/           one file per illustration + registry (index.js)
  scales/               one file per scale + registry (index.js)
  cards/air/            breathe-air-card: card.js, editor.js, styles.js
test/                   node:test unit tests
demo/                   demo and screenshot pages with simulated sensors
```

## Add an illustration

1. Create `src/animations/my-anim.js` exporting `{ id, mask, moving, draw(ctx, s) }`. The contract is described at the top of `src/animations/index.js`.
2. Import it in `src/animations/index.js` and add it to the list.
3. Use it from a preset (`animation: 'my-anim'`).

## Add a scale

1. Create `src/scales/my-scale.js` exporting `{ id, slot, css, html, update }` (see `src/scales/index.js`).
2. Register it in `src/scales/index.js`.
3. Add the label `scale.my-scale` to every language in `src/core/i18n.js`. The editor lists it automatically.

## Add a sensor type

Add an entry to `PRESETS` in `src/core/presets.js` and its texts (`preset.<id>`, `preset.<id>.sub`, zone labels) to `src/core/i18n.js`. If Home Assistant has a device class for it, map it in `DEVICE_CLASS_PRESET`.

## Add a language

Copy the `en` block in `src/core/i18n.js`, translate the values and keep the keys. Missing keys fall back to English. The unit test checks the main keys exist.

## Add a new card

1. Create `src/cards/<name>/` with `card.js` (a custom element with `setConfig`, `set hass`, `getCardSize`, `getGridOptions`) and, if it has options, `editor.js`.
2. Name the element `breathe-<name>-card`.
3. Register it in `src/index.js` with `define(...)` and `announceCard(...)`.
4. Reuse `core/`, `animations/` and `scales/` where it makes sense.

## Extending without a rebuild

The bundle exposes `window.BreatheCards` with `registerAnimation`, `registerScale`, `registerPreset` and `registerStrings`, so a separate resource loaded after `breathe-cards.js` can add its own looks.

## Pull requests

- One change per pull request, with a screenshot when the look changes.
- Keep presets based on published guidance and mention the source.
- Test on a phone width (the demo page has one) and with “reduce motion” on.
