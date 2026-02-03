import { Container } from 'pixi.js';
import { createJarVisual } from '../graphics/JarGraphics.js';

export class ElementJar extends Container {
  constructor({ element, onTap }) {
    super();
    this.element = element;
    this._onTap = onTap;

    const visual = createJarVisual(element.symbol, element.color);
    this.addChild(visual);

    this.eventMode = 'static';
    this.cursor = 'pointer';

    // Idle wobble - lighter elements wobble faster
    const mass = element.atomic_mass || 10;
    const wobbleSpeed = 2.0 - (Math.min(mass, 56) / 56) * 1.4;  // H(1.008)~2.0, Fe(55.845)~0.6
    const wobbleAmp = 0.05 - (Math.min(mass, 56) / 56) * 0.03;  // H~0.05, Fe~0.02
    const startTime = Date.now() + Math.random() * 5000;
    const wobble = () => {
      if (this.destroyed) return;
      const t = (Date.now() - startTime) / 1000;
      this.rotation = Math.sin(t * wobbleSpeed) * wobbleAmp;
      requestAnimationFrame(wobble);
    };
    wobble();

    this.on('pointerdown', () => {
      // Squash effect
      this.scale.set(0.9, 1.05);
    });
    this.on('pointerup', () => {
      // Spring back with bounce
      this._bounceBack();
      if (this._onTap) this._onTap(this.element);
    });
    this.on('pointerupoutside', () => {
      this.scale.set(1);
    });
  }

  _bounceBack() {
    const start = Date.now();
    const tick = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - start) / 300, 1);
      // Elastic bounce
      const elastic = 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) * 0.2;
      this.scale.set(elastic);
      if (t < 1) requestAnimationFrame(tick);
      else this.scale.set(1);
    };
    tick();
  }
}
