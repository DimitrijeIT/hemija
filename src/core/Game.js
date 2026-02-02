import { Application } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT, COLORS } from './Constants.js';

let instance = null;

export class Game {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.app = null;
    this.scale = 1;
    this._screenWidth = DESIGN_WIDTH;
    this.gameContainer = null;
    this._resizeTimer = null;
    this._onResizeCallback = null;
  }

  static getInstance() {
    if (!instance) new Game();
    return instance;
  }

  async init() {
    this.app = new Application();

    const vw = this._getViewportWidth();
    const vh = this._getViewportHeight();

    await this.app.init({
      background: COLORS.BG_DARK,
      width: vw,
      height: vh,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    const container = document.getElementById('game-container');
    container.appendChild(this.app.canvas);

    this.gameContainer = this.app.stage;
    this.resize();

    // Listen to multiple resize signals for mobile reliability
    const doResize = () => this._debouncedResize();
    window.addEventListener('resize', doResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(doResize, 100);
      setTimeout(doResize, 300);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', doResize);
    }

    window.addEventListener('scroll', () => {
      window.scrollTo(0, 0);
      doResize();
    });

    this._setupFullscreen();
  }

  _getViewportWidth() {
    return window.visualViewport ? window.visualViewport.width : window.innerWidth;
  }

  _getViewportHeight() {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  _debouncedResize() {
    if (this._resizeTimer) clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => this.resize(), 50);
    this.resize();
  }

  _setupFullscreen() {
    const tryFullscreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    };
    const handler = () => {
      tryFullscreen();
      window.removeEventListener('pointerup', handler);
      window.removeEventListener('touchend', handler);
    };
    window.addEventListener('pointerup', handler);
    window.addEventListener('touchend', handler);
    document.addEventListener('fullscreenchange', () => this._debouncedResize());
    document.addEventListener('webkitfullscreenchange', () => this._debouncedResize());
  }

  resize() {
    const screenW = this._getViewportWidth();
    const screenH = this._getViewportHeight();

    this.app.renderer.resize(screenW, screenH);

    // Height-based scaling: fill entire screen, no letterboxing
    this.scale = screenH / DESIGN_HEIGHT;
    this._screenWidth = Math.round(screenW / this.scale);
    this.gameContainer.scale.set(this.scale);
    this.gameContainer.position.set(0, 0);

    const canvas = this.app.canvas;
    if (canvas) {
      canvas.style.width = screenW + 'px';
      canvas.style.height = screenH + 'px';
    }

    if (this._onResizeCallback) this._onResizeCallback();
  }

  get screenWidth() {
    return this._screenWidth;
  }

  get ticker() {
    return this.app.ticker;
  }

  get stage() {
    return this.gameContainer;
  }

  get screen() {
    return { width: this._screenWidth, height: DESIGN_HEIGHT };
  }
}
