import { SaveManager } from './SaveManager.js';
import { latinToCyrillic } from '../utils/transliterate.js';

let instance = null;

export class Localization {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._strings = {};
    this._stringsCyr = {};
  }

  static getInstance() {
    if (!instance) new Localization();
    return instance;
  }

  init(latinData, cyrillicData) {
    this._strings = latinData.strings || {};
    this._stringsCyr = cyrillicData.strings || {};
  }

  get(path, vars) {
    const save = SaveManager.getInstance();
    const script = save.getSetting('script');
    const source = script === 'cyrillic' ? this._stringsCyr : this._strings;
    let value = this._resolve(source, path);
    if (value === undefined) {
      value = this._resolve(this._strings, path);
    }
    if (value === undefined) return `[${path}]`;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
    }
    return value;
  }

  /** Transliterate any Latin Serbian text to match current script setting */
  t(text) {
    if (!text) return text;
    const script = SaveManager.getInstance().getSetting('script');
    return script === 'cyrillic' ? latinToCyrillic(text) : text;
  }

  get isCyrillic() {
    return SaveManager.getInstance().getSetting('script') === 'cyrillic';
  }

  _resolve(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }
}
