import { Container } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT } from './Constants.js';

export class Scene extends Container {
  constructor() {
    super();
    this._active = false;
  }

  get designWidth() { return DESIGN_WIDTH; }
  get designHeight() { return DESIGN_HEIGHT; }

  onEnter(_params) {
    this._active = true;
  }

  onExit() {
    this._active = false;
  }

  onResize() {}

  update(_dt) {}
}
