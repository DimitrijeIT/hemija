import { Container } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT } from './Constants.js';
import { Game } from './Game.js';

export class Scene extends Container {
  constructor() {
    super();
    this._active = false;
  }

  get designWidth() { return DESIGN_WIDTH; }
  get designHeight() { return DESIGN_HEIGHT; }
  get screenWidth() { return Game.getInstance().screenWidth; }

  onEnter(_params) {
    this._active = true;
  }

  onExit() {
    this._active = false;
  }

  onResize() {}

  update(_dt) {}
}
