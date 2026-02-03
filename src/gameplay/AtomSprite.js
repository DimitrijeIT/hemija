import { Container } from 'pixi.js';
import { createAtomVisual } from '../graphics/AtomGraphics.js';

export class AtomSprite extends Container {
  constructor({ element, radius = 32 }) {
    super();
    this.element = element;
    this.radius = radius;

    const visual = createAtomVisual(element.symbol, element.color, radius, true, element);
    this.addChild(visual);

    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  popIn() {
    this.scale.set(0);
    const start = Date.now();
    const animate = () => {
      const t = Math.min((Date.now() - start) / 200, 1);
      const ease = 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
      this.scale.set(ease);
      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }

  popOut() {
    return new Promise(resolve => {
      const start = Date.now();
      const animate = () => {
        const t = Math.min((Date.now() - start) / 150, 1);
        this.scale.set(1 - t);
        this.alpha = 1 - t;
        if (t < 1) requestAnimationFrame(animate);
        else resolve();
      };
      animate();
    });
  }
}
