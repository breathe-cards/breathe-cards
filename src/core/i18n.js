// Translations. Add a language by adding one more block with the same keys;
// anything missing falls back to English.

const STRINGS = {
  en: {
    'preset.co2': 'CO₂', 'preset.co2.sub': 'Carbon dioxide',
    'preset.voc': 'VOC', 'preset.voc.sub': 'Volatile organics', 'preset.voc.label': 'VOC (volatile organic compounds)',
    'preset.pm25': 'PM2.5', 'preset.pm25.sub': 'Fine dust', 'preset.pm25.label': 'PM2.5 (fine dust)',
    'preset.pm10': 'PM10', 'preset.pm10.sub': 'Coarse dust', 'preset.pm10.label': 'PM10 (coarse dust)',
    'preset.temperature': 'Temperature', 'preset.temperature.sub': 'Air',
    'preset.humidity': 'Humidity', 'preset.humidity.sub': 'Relative',
    'preset.generic': 'Other sensor', 'preset.generic.sub': '',
    'unit.index': 'index',
    'zone.excellent': 'Excellent', 'zone.good': 'Good', 'zone.stuffy': 'Stuffy', 'zone.ventilate': 'Ventilate',
    'zone.clean': 'Clean', 'zone.normal': 'Normal', 'zone.elevated': 'Elevated', 'zone.high': 'High',
    'zone.moderate': 'Moderate', 'zone.unhealthy': 'Unhealthy',
    'zone.cold': 'Cold', 'zone.cool': 'Cool', 'zone.comfortable': 'Comfortable', 'zone.warm': 'Warm', 'zone.hot': 'Hot',
    'zone.very_dry': 'Very dry', 'zone.dry': 'Dry', 'zone.humid': 'Humid', 'zone.damp': 'Damp',
    'zone.attention': 'Attention', 'zone.poor': 'Poor',
    'level.good': 'Good (green)', 'level.fair': 'Fair (yellow)', 'level.bad': 'Bad (red)', 'level.cold': 'Cold (blue)', 'level.wet': 'Wet (cyan)',
    'state.unavailable': 'Unavailable',
    'scale.pointer': 'Pointer with label', 'scale.segments': 'Zone segments', 'scale.ring': 'Ring next to value', 'scale.none': 'No scale',
    'error.entity': 'Set a sensor (entity)',
    'ed.entity': 'Sensor', 'ed.preset': 'Sensor type', 'ed.auto': 'Automatic', 'ed.name': 'Name', 'ed.subtitle': 'Subtitle',
    'ed.icon': 'Icon (optional)', 'ed.icon.ph': 'mdi:molecule-co2, otherwise built-in', 'ed.unit': 'Unit',
    'ed.color': 'Card colour', 'ed.color.reset': 'Same as sensor type', 'ed.scale': 'Scale',
    'ed.min': 'Scale start', 'ed.decimals': 'Decimal places', 'ed.tap': 'On tap',
    'ed.tap.more': 'Open sensor history', 'ed.tap.none': 'Do nothing',
    'ed.show_state': 'Show state as words (for example “Comfortable”)', 'ed.show_subtitle': 'Show subtitle',
    'ed.animation': 'Animation', 'ed.grain': 'Grain on the card background',
    'ed.zones': 'Zones', 'ed.zones.hint': 'Each zone applies up to and including its value. The last zone sets the end of the scale. The label is what the card shows for values in that zone.',
    'ed.zones.off': ' (words are turned off now)',
    'ed.zone.to': 'up to', 'ed.zone.color': 'colour', 'ed.zone.label': 'label',
    'ed.zone.add': 'Add zone', 'ed.zone.reset': 'Zones from sensor type', 'ed.zone.del': 'Delete zone {n}',
    'card.description': 'Air quality card with a live illustration and a zone scale',
  },
  uk: {
    'preset.co2': 'CO₂', 'preset.co2.sub': 'Вуглекислий газ',
    'preset.voc': 'VOC', 'preset.voc.sub': 'Органічні речовини', 'preset.voc.label': 'VOC (леткі органічні речовини)',
    'preset.pm25': 'PM2.5', 'preset.pm25.sub': 'Дрібний пил', 'preset.pm25.label': 'PM2.5 (дрібний пил)',
    'preset.pm10': 'PM10', 'preset.pm10.sub': 'Крупний пил', 'preset.pm10.label': 'PM10 (крупний пил)',
    'preset.temperature': 'Температура', 'preset.temperature.sub': 'Повітря',
    'preset.humidity': 'Вологість', 'preset.humidity.sub': 'Відносна',
    'preset.generic': 'Інший датчик', 'preset.generic.sub': '',
    'unit.index': 'індекс',
    'zone.excellent': 'Відмінно', 'zone.good': 'Добре', 'zone.stuffy': 'Задушливо', 'zone.ventilate': 'Провітріть',
    'zone.clean': 'Чисто', 'zone.normal': 'Норма', 'zone.elevated': 'Підвищено', 'zone.high': 'Високо',
    'zone.moderate': 'Помірно', 'zone.unhealthy': 'Шкідливо',
    'zone.cold': 'Холодно', 'zone.cool': 'Прохолодно', 'zone.comfortable': 'Комфортно', 'zone.warm': 'Тепло', 'zone.hot': 'Спекотно',
    'zone.very_dry': 'Дуже сухо', 'zone.dry': 'Сухувато', 'zone.humid': 'Волого', 'zone.damp': 'Сиро',
    'zone.attention': 'Увага', 'zone.poor': 'Погано',
    'level.good': 'Норма (зелений)', 'level.fair': 'Увага (жовтий)', 'level.bad': 'Погано (червоний)', 'level.cold': 'Холод (синій)', 'level.wet': 'Волого (блакитний)',
    'state.unavailable': 'Недоступно',
    'scale.pointer': 'Позначка з підписом', 'scale.segments': 'Сегменти зон', 'scale.ring': 'Кільце біля числа', 'scale.none': 'Без шкали',
    'error.entity': 'Вкажіть датчик (entity)',
    'ed.entity': 'Датчик', 'ed.preset': 'Тип датчика', 'ed.auto': 'Автоматично', 'ed.name': 'Назва', 'ed.subtitle': 'Підпис під назвою',
    'ed.icon': 'Іконка (необов’язково)', 'ed.icon.ph': 'mdi:molecule-co2, інакше вбудована', 'ed.unit': 'Одиниця виміру',
    'ed.color': 'Колір картки', 'ed.color.reset': 'Як у типі датчика', 'ed.scale': 'Шкала',
    'ed.min': 'Початок шкали', 'ed.decimals': 'Знаків після коми', 'ed.tap': 'Натискання на картку',
    'ed.tap.more': 'Відкрити історію датчика', 'ed.tap.none': 'Нічого не робити',
    'ed.show_state': 'Показувати стан словами (наприклад «Комфортно»)', 'ed.show_subtitle': 'Показувати підпис під назвою',
    'ed.animation': 'Анімація', 'ed.grain': 'Зерно на фоні картки',
    'ed.zones': 'Зони', 'ed.zones.hint': 'Кожна зона діє до вказаного значення включно. Остання зона задає кінець шкали. Підпис — те, що картка пише при значеннях у цій зоні.',
    'ed.zones.off': ' (зараз слова вимкнені)',
    'ed.zone.to': 'до значення', 'ed.zone.color': 'колір', 'ed.zone.label': 'підпис',
    'ed.zone.add': 'Додати зону', 'ed.zone.reset': 'Зони як у типі датчика', 'ed.zone.del': 'Видалити зону {n}',
    'card.description': 'Картка якості повітря з живою ілюстрацією та шкалою зон',
  },
};

export const LANGUAGES = Object.keys(STRINGS);

/** Picks the card language from Home Assistant, then the browser. */
export function language(hass) {
  const l = String(
    (hass && hass.locale && hass.locale.language) || (hass && hass.language) ||
    (typeof navigator !== 'undefined' && navigator.language) || 'en',
  ).toLowerCase();
  const base = l.split(/[-_]/)[0];
  return STRINGS[base] ? base : 'en';
}

export function t(lang, key, vars) {
  let s = (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.en[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, vars[k]);
  return s;
}

/** Lets a separate file add or override strings, e.g. registerStrings('de', {...}). */
export function registerStrings(lang, strings) {
  STRINGS[lang] = { ...(STRINGS[lang] || {}), ...strings };
}
