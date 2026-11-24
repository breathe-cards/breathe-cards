// One place for the project name and the element prefix.
// __VERSION__ is filled in by the build from package.json.

/* global __VERSION__ */
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';
export const PROJECT = 'Breathe Cards';
export const PREFIX = 'breathe';

/** Registers a card in the Home Assistant card picker. */
export function announceCard({ type, name, description, preview = true }) {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === type)) {
    window.customCards.push({
      type,
      name,
      description,
      preview,
      documentationURL: 'https://github.com/breathe-cards/breathe-cards#readme',
    });
  }
}

/** Defines a custom element once (safe if the file is loaded twice). */
export function define(tag, cls) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
}
