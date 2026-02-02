import { SAVE_KEY } from './Constants.js';

let instance = null;

const DEFAULT_SAVE = {
  version: 1,
  settings: {
    sound: true,
    music: true,
    script: 'cyrillic'
  },
  progress: {
    levels: {},
    totalStars: 0,
    totalCoins: 0,
    discoveredElements: [],
    discoveredMolecules: [],
    chaptersCompleted: []
  }
};

export class SaveManager {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._data = null;
  }

  static getInstance() {
    if (!instance) new SaveManager();
    return instance;
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        this._data = JSON.parse(raw);
        if (!this._data.settings) this._data.settings = { ...DEFAULT_SAVE.settings };
        if (!this._data.progress) this._data.progress = { ...DEFAULT_SAVE.progress };
      } else {
        this._data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
      }
    } catch {
      this._data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
    return this._data;
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this._data));
    } catch {
      // silent fail
    }
  }

  get data() {
    if (!this._data) this.load();
    return this._data;
  }

  getSetting(key) {
    return this.data.settings[key];
  }

  setSetting(key, value) {
    this.data.settings[key] = value;
    this.save();
  }

  reset() {
    this._data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}
