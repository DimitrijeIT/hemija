import { Container, Graphics } from 'pixi.js';
import { COLORS } from '../core/Constants.js';

export class StarDisplay extends Container {
  constructor({ count = 0, total = 3, size = 32, gap = 8 }) {
    super();
    this._stars = [];
    this._count = count;
    this._total = total;
    this._size = size;

    for (let i = 0; i < total; i++) {
      const star = new Graphics();
      this._drawStar(star, size, i < count ? COLORS.GOLD : COLORS.STAR_EMPTY);
      star.position.set(i * (size * 2 + gap), 0);
      this.addChild(star);
      this._stars.push(star);
    }
  }

  _drawStar(g, size, color) {
    g.clear();
    const cx = size;
    const cy = size;
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 2 * 3) + (i * Math.PI / 5);
      const r = i % 2 === 0 ? size : size * 0.45;
      points.push(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    g.poly(points);
    g.fill({ color });
  }

  setStars(count) {
    this._count = count;
    for (let i = 0; i < this._total; i++) {
      this._drawStar(this._stars[i], this._size, i < count ? COLORS.GOLD : COLORS.STAR_EMPTY);
    }
  }

  animateIn() {
    for (let i = 0; i < this._count; i++) {
      const star = this._stars[i];
      star.scale.set(0);
      const delay = i * 200;
      setTimeout(() => {
        const start = Date.now();
        const animate = () => {
          const t = Math.min((Date.now() - start) / 300, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          star.scale.set(ease);
          if (t < 1) requestAnimationFrame(animate);
        };
        animate();
      }, delay);
    }
  }
}
