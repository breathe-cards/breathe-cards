// Community translations. English and Ukrainian live in src/core/i18n.js.
// Add a language: copy a file here, translate the values, keep the keys, add it below.
import { registerStrings } from '../core/i18n.js';
import ca from './ca.js';
import cs from './cs.js';
import da from './da.js';
import de from './de.js';
import el from './el.js';
import es from './es.js';
import fi from './fi.js';
import fr from './fr.js';
import hu from './hu.js';
import it from './it.js';
import ja from './ja.js';
import ko from './ko.js';
import nb from './nb.js';
import nl from './nl.js';
import pl from './pl.js';
import pt from './pt.js';
import pt_BR from './pt-BR.js';
import ro from './ro.js';
import sk from './sk.js';
import sv from './sv.js';
import tr from './tr.js';
import zh_Hans from './zh-Hans.js';
import zh_Hant from './zh-Hant.js';

const TRANSLATIONS = {
  "ca": ca,
  "cs": cs,
  "da": da,
  "de": de,
  "el": el,
  "es": es,
  "fi": fi,
  "fr": fr,
  "hu": hu,
  "it": it,
  "ja": ja,
  "ko": ko,
  "nb": nb,
  "nl": nl,
  "pl": pl,
  "pt": pt,
  "pt-BR": pt_BR,
  "ro": ro,
  "sk": sk,
  "sv": sv,
  "tr": tr,
  "zh-Hans": zh_Hans,
  "zh-Hant": zh_Hant,
};

for (const [code, strings] of Object.entries(TRANSLATIONS)) registerStrings(code, strings);
