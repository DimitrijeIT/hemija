import { Container, Graphics, Text } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';

export class Button extends Container {
  constructor({ label, width = 280, height = 64, color = COLORS.BUTTON_BLUE, fontSize = FONT.BUTTON_SIZE, onClick }) {
    super();
    this._baseColor = color;
    this._width = width;
    this._height = height;
    this._onClick = onClick;
    this._disabled = false;
    this._pressing = false;

    this._bg = new Graphics();
    this._drawBg(color);
    this.addChild(this._bg);

    // Shine overlay
    this._shine = new Graphics();
    this._shine.roundRect(0, 0, width, height / 2, 16);
    this._shine.fill({ color: 0xffffff, alpha: 0.06 });
    this.addChild(this._shine);

    this._label = new Text({
      text: label,
      style: {
        fontFamily: FONT.FAMILY,
        fontSize,
        fontWeight: 'bold',
        fill: COLORS.TEXT_WHITE,
        align: 'center'
      }
    });
    this._label.anchor.set(0.5);
    this._label.position.set(width / 2, height / 2);
    this.addChild(this._label);

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', this._onPress, this);
    this.on('pointerup', this._onRelease, this);
    this.on('pointerupoutside', this._onCancel, this);

    // Idle hover pulse - subtle
    this._startIdleAnim();
  }

  _drawBg(color) {
    this._bg.clear();
    // Shadow
    this._bg.roundRect(2, 4, this._width, this._height, 16);
    this._bg.fill({ color: 0x000000, alpha: 0.2 });
    // Main button
    this._bg.roundRect(0, 0, this._width, this._height, 16);
    this._bg.fill({ color });
    // Border
    this._bg.roundRect(0, 0, this._width, this._height, 16);
    this._bg.stroke({ color: 0xffffff, alpha: 0.12, width: 2 });
  }

  _startIdleAnim() {
    const start = Date.now() + Math.random() * 3000;
    const tick = () => {
      if (this.destroyed || this._pressing) return;
      const t = (Date.now() - start) / 1000;
      // Very subtle floating feel
      this._bg.y = Math.sin(t * 1.5) * 1;
      this._label.y = this._height / 2 + Math.sin(t * 1.5) * 1;
      this._shine.y = Math.sin(t * 1.5) * 1;
      requestAnimationFrame(tick);
    };
    tick();
  }

  _onPress() {
    if (this._disabled) return;
    this._pressing = true;
    // Squish effect
    this.scale.set(0.93, 0.97);
    this._bg.y = 2;
    this._label.y = this._height / 2 + 2;
  }

  _onRelease() {
    if (this._disabled) return;
    this._pressing = false;

    // Bounce back
    this.scale.set(1.05);
    const start = Date.now();
    const bounce = () => {
      const t = Math.min((Date.now() - start) / 200, 1);
      const s = 1.05 - 0.05 * t + Math.sin(t * Math.PI) * 0.02;
      this.scale.set(s);
      if (t < 1) requestAnimationFrame(bounce);
      else this.scale.set(1);
    };
    bounce();

    this._bg.y = 0;
    this._label.y = this._height / 2;
    if (this._onClick) this._onClick();
  }

  _onCancel() {
    if (this._disabled) return;
    this._pressing = false;
    this.scale.set(1);
    this._bg.y = 0;
    this._label.y = this._height / 2;
  }

  set label(text) {
    this._label.text = text;
  }

  set disabled(val) {
    this._disabled = val;
    this.alpha = val ? 0.5 : 1;
    this.cursor = val ? 'default' : 'pointer';
  }

  get disabled() { return this._disabled; }
}
