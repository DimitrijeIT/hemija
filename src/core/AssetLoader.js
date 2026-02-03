import { Assets } from 'pixi.js';
import { getElementImagePath, getElementHouseholdImagePath, getMoleculeImagePath, getExperimentImagePath, getAllImagePaths } from '../data/ImageManifest.js';

const DATA_FILES = {
  elements: 'data/elements.json',
  molecules: 'data/molecules.json',
  chapters: 'data/chapters.json',
  strings_sr: 'data/strings_sr.json',
  strings_sr_cyr: 'data/strings_sr_cyr.json',
  experiments: 'data/experiments.json'
};

let instance = null;

export class AssetLoader {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.data = {};
    this.textures = {};
    this.loaded = false;
  }

  static getInstance() {
    if (!instance) new AssetLoader();
    return instance;
  }

  async loadAll(onProgress) {
    const keys = Object.keys(DATA_FILES);
    let loaded = 0;
    const totalSteps = keys.length + 1; // +1 for image loading step

    for (const key of keys) {
      const resp = await fetch(DATA_FILES[key]);
      this.data[key] = await resp.json();
      loaded++;
      if (onProgress) onProgress(loaded / totalSteps);
    }

    // Preload all real images (silent failures)
    const imagePaths = getAllImagePaths();
    const imagePromises = imagePaths.map(async (path) => {
      try {
        const texture = await Assets.load(path);
        this.textures[path] = texture;
      } catch (_) {
        // Graceful fallback - image not available
      }
    });
    await Promise.all(imagePromises);
    loaded++;
    if (onProgress) onProgress(loaded / totalSteps);

    this.loaded = true;
    return this.data;
  }

  get(key) {
    return this.data[key];
  }

  getElementTexture(symbol) {
    const path = getElementImagePath(symbol);
    return path ? this.textures[path] || null : null;
  }

  getElementHouseholdTexture(symbol) {
    const path = getElementHouseholdImagePath(symbol);
    return path ? this.textures[path] || null : null;
  }

  getMoleculeTexture(moleculeId) {
    const path = getMoleculeImagePath(moleculeId);
    return path ? this.textures[path] || null : null;
  }

  getExperimentTexture(experimentId) {
    const path = getExperimentImagePath(experimentId);
    return path ? this.textures[path] || null : null;
  }
}
