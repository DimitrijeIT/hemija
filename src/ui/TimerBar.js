import { Container, Graphics, Text } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';

export class TimerBar extends Container {
  constructor({ width = 300, height = 24, totalTime }) {
    super();
    this._totalTime = totalTime;
    this._remaining = totalTime;
    this._barWidth = width;
    this._barHeight = height;
    this._running = false;

    this._bgBar = new Graphics();
    this._bgBar.roundRect(0, 0, width, height, height / 2);
    this._bgBar.fill({ color: 0x222244 });
    this.addChild(this._bgBar);

    this._fillBar = new Graphics();
    this.addChild(this._fillBar);

    this._label = new Text({
      text: this._formatTime(totalTime),
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.SMALL_SIZE,
        fontWeight: 'bold',
        fill: COLORS.TEXT_WHITE
      }
    });
    this._label.anchor.set(0.5);
    this._label.position.set(width / 2, height / 2);
    this.addChild(this._label);

    this._drawFill(1);
  }

  _getColor(ratio) {
    if (ratio > 0.5) return COLORS.TIMER_GREEN;
    if (ratio > 0.25) return COLORS.TIMER_YELLOW;
    return COLORS.TIMER_RED;
  }

  _drawFill(ratio) {
    this._fillBar.clear();
    if (ratio > 0) {
      const w = this._barWidth * Math.max(ratio, 0);
      this._fillBar.roundRect(0, 0, w, this._barHeight, this._barHeight / 2);
      this._fillBar.fill({ color: this._getColor(ratio) });
    }
  }

  _formatTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`;
  }

  start() { this._running = true; }
  stop() { this._running = false; }

  update(dt) {
    if (!this._running) return;
    this._remaining -= dt;
    if (this._remaining < 0) this._remaining = 0;
    const ratio = this._remaining / this._totalTime;
    this._drawFill(ratio);
    this._label.text = this._formatTime(this._remaining);
  }

  get remaining() { return this._remaining; }
  get isExpired() { return this._remaining <= 0; }

  get elapsedRatio() {
    return 1 - (this._remaining / this._totalTime);
  }

  reset(totalTime) {
    this._totalTime = totalTime || this._totalTime;
    this._remaining = this._totalTime;
    this._drawFill(1);
    this._label.text = this._formatTime(this._totalTime);
  }
}
