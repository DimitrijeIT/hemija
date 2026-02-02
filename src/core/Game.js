import { Application } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT, COLORS } from './Constants.js';

let instance = null;

export class Game {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.app = null;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.gameContainer = null;
    this._resizeTimer = null;
  }

  static getInstance() {
    if (!instance) new Game();
    return instance;
  }

  async init() {
    this.app = new Application();

    // Get actual viewport size (works better than resizeTo: window on mobile)
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
      // Orientation change needs a delay - browser hasn't updated dimensions yet
      setTimeout(doResize, 100);
      setTimeout(doResize, 300);
    });

    // visualViewport API is the most reliable on mobile
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', doResize);
    }

    // Handle iOS address bar show/hide
    window.addEventListener('scroll', () => {
      window.scrollTo(0, 0);
      doResize();
    });
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
    // Also do an immediate resize for responsiveness
    this.resize();
  }

  resize() {
    const screenW = this._getViewportWidth();
    const screenH = this._getViewportHeight();

    // Resize the renderer to match actual viewport
    this.app.renderer.resize(screenW, screenH);

    this.scale = Math.min(screenW / DESIGN_WIDTH, screenH / DESIGN_HEIGHT);
    this.offsetX = (screenW - DESIGN_WIDTH * this.scale) / 2;
    this.offsetY = (screenH - DESIGN_HEIGHT * this.scale) / 2;
    this.gameContainer.scale.set(this.scale);
    this.gameContainer.position.set(this.offsetX, this.offsetY);

    // Ensure canvas fills the container
    const canvas = this.app.canvas;
    if (canvas) {
      canvas.style.width = screenW + 'px';
      canvas.style.height = screenH + 'px';
    }
  }

  get ticker() {
    return this.app.ticker;
  }

  get stage() {
    return this.gameContainer;
  }

  get screen() {
    return { width: DESIGN_WIDTH, height: DESIGN_HEIGHT };
  }
}
