import { Container, Graphics } from 'pixi.js';

const CONFETTI_COLORS = [0xffd700, 0xff6b6b, 0x48dbfb, 0x2ecc71, 0xff9ff3, 0xffa502, 0x00d2d3, 0xff4757];

export class ConfettiEffect extends Container {
  constructor({ x = 0, y = 0, width = 400, count = 60, duration = 3000 }) {
    super();
    this.position.set(x, y);

    const pieces = [];
    for (let i = 0; i < count; i++) {
      const p = new Graphics();
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const w = 4 + Math.random() * 6;
      const h = 3 + Math.random() * 4;

      if (Math.random() > 0.5) {
        p.rect(-w / 2, -h / 2, w, h);
      } else {
        p.circle(0, 0, w / 2);
      }
      p.fill({ color });
      this.addChild(p);

      pieces.push({
        graphic: p,
        x: (Math.random() - 0.5) * width,
        y: -Math.random() * 50,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 6,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.08 + Math.random() * 0.04,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 2 + Math.random() * 3
      });
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration || this.destroyed) {
        if (!this.destroyed) this.destroy({ children: true });
        return;
      }

      const fadeT = Math.max(0, (elapsed - duration * 0.7) / (duration * 0.3));

      for (const p of pieces) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;

        // Wobble side to side
        const wobbleOffset = Math.sin(elapsed / 1000 * p.wobbleSpeed + p.wobble) * 2;
        p.graphic.position.set(p.x + wobbleOffset, p.y);
        p.graphic.rotation += p.rotSpeed;
        p.graphic.alpha = 1 - fadeT;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }
}
