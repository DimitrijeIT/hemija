import { Container, Graphics } from 'pixi.js';
import { COLORS } from '../core/Constants.js';

export class Panel extends Container {
  constructor({ width, height, color = COLORS.BG_PANEL, radius = 20, alpha = 0.9 }) {
    super();
    this._bg = new Graphics();
    this._bg.roundRect(0, 0, width, height, radius);
    this._bg.fill({ color, alpha });
    this._bg.roundRect(0, 0, width, height, radius);
    this._bg.stroke({ color: 0xffffff, alpha: 0.08, width: 2 });
    this.addChild(this._bg);
    this._width = width;
    this._height = height;
  }

  get panelWidth() { return this._width; }
  get panelHeight() { return this._height; }
}
