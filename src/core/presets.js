// Sensor types. A preset gives a card its look and sensible default zones.
// Thresholds: CO₂ and VOC follow common indoor-air guidance; PM2.5/PM10 follow the
// WHO 2021 air quality guidelines; temperature and humidity use typical comfort ranges.
// Every value can be overridden per card in the editor or YAML.

export const LEVELS = {
  good: '#6FD6A4',
  fair: '#F2C25C',
  bad: '#F47E6C',
  cold: '#86B6F7',
  wet: '#62C8E2',
};

export const ICONS = {
  molecule: '<circle cx="12" cy="12" r="3.2"/><circle cx="4.6" cy="12" r="2.4"/><circle cx="19.4" cy="12" r="2.4"/><path d="M7 10.9h1.8M7 13.1h1.8M15.2 10.9h1.8M15.2 13.1h1.8"/>',
  wisp: '<path d="M8 20c-2-3 2-5 0-8s2-5 0-8M13 20c-2-3 2-5 0-8s2-5 0-8M18 20c-2-3 2-5 0-8"/>',
  dust: '<circle cx="7" cy="8" r="1.2"/><circle cx="14" cy="6" r="1"/><circle cx="17" cy="12" r="1.3"/><circle cx="10" cy="13" r="1"/><circle cx="6" cy="17" r="1.1"/><circle cx="14" cy="18" r="1"/>',
  grain: '<path d="M6 7.5l2-1.5 2 1-.5 2.2-2.2.6z"/><path d="M14 5l2.6.4.6 2.4-2 1.4-1.8-1.2z"/><path d="M11 14l2.4-.8 1.8 1.8-1 2.2-2.6-.4z"/><path d="M5 16.5l1.6-.6 1 1.4-1 1.3-1.5-.4z"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
  drop: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l3.5-5"/>',
};

const z = (to, level, key) => ({ to, level, labelKey: 'zone.' + key });

export const PRESETS = {
  co2: {
    icon: 'molecule', animation: 'co2', unit: 'ppm', min: 400, decimals: 0,
    color: '#7ADBE6', background: ['#1a4f5c', '#0b252c'],
    zones: [z(800, 'good', 'excellent'), z(1000, 'good', 'good'), z(1400, 'fair', 'stuffy'), z(2000, 'bad', 'ventilate')],
  },
  voc: {
    icon: 'wisp', animation: 'voc', unitKey: 'unit.index', min: 0, decimals: 0,
    color: '#C7B3FF', background: ['#3a2d6b', '#171230'],
    zones: [z(100, 'good', 'clean'), z(150, 'good', 'normal'), z(250, 'fair', 'elevated'), z(500, 'bad', 'high')],
  },
  pm25: {
    icon: 'dust', animation: 'pm25', unit: 'µg/m³', min: 0, decimals: 1,
    color: '#A9C0E0', background: ['#2c3a4d', '#10161f'],
    zones: [z(5, 'good', 'excellent'), z(15, 'good', 'good'), z(35, 'fair', 'moderate'), z(75, 'bad', 'unhealthy')],
  },
  pm10: {
    icon: 'grain', animation: 'pm10', unit: 'µg/m³', min: 0, decimals: 0,
    color: '#D6CDBE', background: ['#3b3a37', '#171716'],
    zones: [z(15, 'good', 'excellent'), z(45, 'good', 'good'), z(100, 'fair', 'moderate'), z(150, 'bad', 'unhealthy')],
  },
  temperature: {
    icon: 'thermo', animation: 'thermometer', unit: '°C', min: 14, decimals: 1,
    color: '#C9D3E6', background: ['#2b3241', '#10141b'],
    zones: [z(18, 'cold', 'cold'), z(20, 'cold', 'cool'), z(24, 'good', 'comfortable'), z(26, 'fair', 'warm'), z(30, 'bad', 'hot')],
  },
  humidity: {
    icon: 'drop', animation: 'humidity', unit: '%', min: 20, decimals: 1,
    color: '#8CC2FF', background: ['#1d3c6e', '#0c1a33'],
    zones: [z(30, 'bad', 'very_dry'), z(40, 'fair', 'dry'), z(60, 'good', 'comfortable'), z(70, 'wet', 'humid'), z(80, 'bad', 'damp')],
  },
  generic: {
    icon: 'gauge', animation: 'none', unit: '', min: 0, decimals: 1,
    color: '#9FC2AE', background: null,
    zones: [z(50, 'good', 'normal'), z(80, 'fair', 'attention'), z(100, 'bad', 'poor')],
  },
};

export const DEVICE_CLASS_PRESET = {
  carbon_dioxide: 'co2',
  volatile_organic_compounds: 'voc',
  volatile_organic_compounds_parts: 'voc',
  pm25: 'pm25',
  pm10: 'pm10',
  temperature: 'temperature',
  humidity: 'humidity',
};

/** Guesses a preset from the entity id when the sensor has no device class. */
export function guessPreset(entityId) {
  const s = String(entityId || '').toLowerCase();
  if (/co2|carbon_dioxide/.test(s)) return 'co2';
  if (/voc/.test(s)) return 'voc';
  if (/pm2_?5|pm25/.test(s)) return 'pm25';
  if (/pm10/.test(s)) return 'pm10';
  if (/temp/.test(s)) return 'temperature';
  if (/humid/.test(s)) return 'humidity';
  return null;
}

/** Lets an add-on file add a new sensor type. */
export function registerPreset(id, preset) {
  PRESETS[id] = preset;
}
