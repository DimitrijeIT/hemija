import { Container, Graphics } from 'pixi.js';
import { AtomSprite } from './AtomSprite.js';
import { COLORS } from '../core/Constants.js';

export class ReactionSlot extends Container {
  constructor({ size = 72, onTap }) {
    super();
    this._size = size;
    this._atom = null;
    this._element = null;
    this._onTap = onTap;

    this._emptyBg = new Graphics();
    this._drawEmpty();
    this.addChild(this._emptyBg);

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerup', () => {
      if (this._atom && this._onTap) {
        this._onTap(this);
      }
    });
  }

  _drawEmpty() {
    this._emptyBg.clear();
    this._emptyBg.roundRect(-this._size / 2, -this._size / 2, this._size, this._size, 12);
    this._emptyBg.stroke({ color: COLORS.TEXT_DIM, alpha: 0.4, width: 2 });
  }

  get isEmpty() {
    return this._atom === null;
  }

  get element() {
    return this._element;
  }

  placeAtom(element) {
    if (this._atom) this.removeAtom();
    this._element = element;
    this._emptyBg.visible = false;

    this._atom = new AtomSprite({ element, radius: this._size / 2 - 4 });
    this.addChild(this._atom);
    this._atom.popIn();
  }

  async removeAtom() {
    if (!this._atom) return null;
    const el = this._element;
    await this._atom.popOut();
    if (this._atom) {
      this.removeChild(this._atom);
      this._atom.destroy({ children: true });
    }
    this._atom = null;
    this._element = null;
    this._emptyBg.visible = true;
    this._drawEmpty();
    return el;
  }

  clear() {
    if (this._atom) {
      this.removeChild(this._atom);
      this._atom.destroy({ children: true });
      this._atom = null;
    }
    this._element = null;
    this._emptyBg.visible = true;
    this._drawEmpty();
  }

  shake() {
    const origX = this.x;
    const start = Date.now();
    const animate = () => {
      const t = (Date.now() - start) / 400;
      if (t >= 1) {
        this.x = origX;
        return;
      }
      this.x = origX + Math.sin(t * Math.PI * 6) * 8 * (1 - t);
      requestAnimationFrame(animate);
    };
    animate();
  }
}
