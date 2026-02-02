const DATA_FILES = {
  elements: 'data/elements.json',
  molecules: 'data/molecules.json',
  chapters: 'data/chapters.json',
  strings_sr: 'data/strings_sr.json',
  strings_sr_cyr: 'data/strings_sr_cyr.json'
};

let instance = null;

export class AssetLoader {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.data = {};
    this.loaded = false;
  }

  static getInstance() {
    if (!instance) new AssetLoader();
    return instance;
  }

  async loadAll(onProgress) {
    const keys = Object.keys(DATA_FILES);
    let loaded = 0;

    for (const key of keys) {
      const resp = await fetch(DATA_FILES[key]);
      this.data[key] = await resp.json();
      loaded++;
      if (onProgress) onProgress(loaded / keys.length);
    }

    this.loaded = true;
    return this.data;
  }

  get(key) {
    return this.data[key];
  }
}
