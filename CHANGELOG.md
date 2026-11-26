# Changelog

All notable changes are listed here. The project follows [Semantic Versioning](https://semver.org/).

## [1.1.1] – 2026-11-26

### Documentation
- Breathe Cards is now in the default HACS store: install instructions and badge updated, “Open in HACS” button added.

## [1.1.0] – 2026-11-24

### Added
- 23 more languages: Català, Čeština, Dansk, Deutsch, Ελληνικά, Español, Suomi, Français, Magyar, Italiano, 日本語, 한국어, Norsk bokmål, Nederlands, Polski, Português, Português (Brasil), Română, Slovenčina, Svenska, Türkçe, 简体中文, 繁體中文.
- Language detection by exact code first (pt-BR, zh-Hant), then base language.
- Security policy and Dependabot configuration.

## [1.0.1] – 2026-11-24

### Documentation
- Animated demo, editor screenshot, logo and social preview.
- Languages and troubleshooting sections in the README.

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
