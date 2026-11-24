# Changelog

All notable changes are listed here. The project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] – 2026-11-24

First public release.

### Added
- `breathe-air-card` with presets for CO₂, VOC, PM2.5, PM10, temperature and humidity, plus a generic preset.
- Live illustrations per sensor type; they pause off screen and respect “reduce motion”.
- Scales: pointer with state word, zone segments, ring, none. Zones have equal width.
- Custom zones with limits, levels, colours and labels; option to hide state words.
- Visual editor, English and Ukrainian translations, °F support for temperature.
- Tap opens the Home Assistant history dialog.
- Extension hooks on `window.BreatheCards` for add-on illustrations, scales, presets and languages.
