// Breathe Cards — entry point. Every card of the collection registers itself here.
// Adding a new card: create src/cards/<name>/ with card.js (+ editor.js) and add it below.

import { VERSION, PROJECT, announceCard, define } from './core/meta.js';
import { t, language, registerStrings } from './core/i18n.js';
import { registerPreset } from './core/presets.js';
import { registerAnimation } from './animations/index.js';
import { registerScale } from './scales/index.js';
import { BreatheAirCard, AIR_CARD_TAG } from './cards/air/card.js';
import { BreatheAirCardEditor } from './cards/air/editor.js';

define(AIR_CARD_TAG, BreatheAirCard);
define(AIR_CARD_TAG + '-editor', BreatheAirCardEditor);
announceCard({ type: AIR_CARD_TAG, name: 'Breathe Air Card', description: t(language(null), 'card.description') });

// Public hooks for add-on files: window.BreatheCards.registerAnimation(...) etc.
// Set on window explicitly: Home Assistant loads resources as ES modules, where top-level vars stay local.
window.BreatheCards = { version: VERSION, registerAnimation, registerScale, registerPreset, registerStrings };

console.info(`%c ${PROJECT.toUpperCase()} %c ${VERSION} `, 'background:#1a4f5c;color:#7ADBE6;font-weight:600', 'background:#10161f;color:#F5F2EA');
