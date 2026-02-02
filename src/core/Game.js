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
  }

  static getInstance() {
    if (!instance) new Game();
    return instance;
  }

  async init() {
    this.app = new Application();
    await this.app.init({
      background: COLORS.BG_DARK,
      resizeTo: window,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    const container = document.getElementById('game-container');
    container.appendChild(this.app.canvas);

    this.gameContainer = this.app.stage;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    this.scale = Math.min(screenW / DESIGN_WIDTH, screenH / DESIGN_HEIGHT);
    this.offsetX = (screenW - DESIGN_WIDTH * this.scale) / 2;
    this.offsetY = (screenH - DESIGN_HEIGHT * this.scale) / 2;
    this.gameContainer.scale.set(this.scale);
    this.gameContainer.position.set(this.offsetX, this.offsetY);
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
