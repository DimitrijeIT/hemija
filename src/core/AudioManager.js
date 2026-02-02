import { Howl } from 'howler';
import { SaveManager } from './SaveManager.js';

let instance = null;

export class AudioManager {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._sounds = {};
    this._music = null;
    this._initialized = false;
  }

  static getInstance() {
    if (!instance) new AudioManager();
    return instance;
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;
    // Placeholder: audio files would be loaded here
    // For now, all playSfx/playMusic calls are no-ops if files are missing
  }

  playSfx(name) {
    const save = SaveManager.getInstance();
    if (!save.getSetting('sound')) return;

    if (this._sounds[name]) {
      this._sounds[name].play();
    }
    // Silent if sound not loaded - graceful degradation
  }

  playMusic(name) {
    const save = SaveManager.getInstance();
    if (!save.getSetting('music')) return;

    if (this._music) {
      this._music.stop();
    }
    // Placeholder for future music loading
  }

  stopMusic() {
    if (this._music) {
      this._music.stop();
      this._music = null;
    }
  }

  updateSettings() {
    const save = SaveManager.getInstance();
    if (!save.getSetting('music') && this._music) {
      this._music.stop();
    }
  }
}
