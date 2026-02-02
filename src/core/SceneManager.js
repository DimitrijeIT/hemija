import { GAME_CONFIG } from './Constants.js';

let instance = null;

export class SceneManager {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._game = null;
    this._scenes = {};
    this._current = null;
    this._transitioning = false;
  }

  static getInstance() {
    if (!instance) new SceneManager();
    return instance;
  }

  init(game) {
    this._game = game;
    game.ticker.add((ticker) => {
      if (this._current && this._current._active) {
        this._current.update(ticker.deltaMS / 1000);
      }
    });
  }

  register(name, SceneClass) {
    this._scenes[name] = SceneClass;
  }

  async switchTo(name, params) {
    if (this._transitioning) return;
    this._transitioning = true;

    const SceneClass = this._scenes[name];
    if (!SceneClass) {
      this._transitioning = false;
      return;
    }

    if (this._current) {
      await this._fadeOut(this._current);
      this._current.onExit();
      this._game.stage.removeChild(this._current);
      this._current.destroy({ children: true });
    }

    const scene = new SceneClass();
    this._game.stage.addChild(scene);
    scene.onEnter(params);
    scene.onResize();
    this._current = scene;

    await this._fadeIn(scene);
    this._transitioning = false;
  }

  _fadeOut(scene) {
    return new Promise(resolve => {
      const duration = GAME_CONFIG.FADE_DURATION;
      const startAlpha = scene.alpha;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        scene.alpha = startAlpha * (1 - t);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    });
  }

  _fadeIn(scene) {
    return new Promise(resolve => {
      const duration = GAME_CONFIG.FADE_DURATION;
      scene.alpha = 0;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        scene.alpha = t;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    });
  }
}
