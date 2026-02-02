import { Container, Graphics } from 'pixi.js';

export class ParticleEffect extends Container {
  constructor({ x, y, color = 0xffd700, count = 20, spread = 100, duration = 800 }) {
    super();
    this.position.set(x, y);

    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = new Graphics();
      const size = 3 + Math.random() * 5;
      p.circle(0, 0, size);
      p.fill({ color });
      this.addChild(p);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1;
      particles.push({
        graphic: p,
        vx: Math.cos(angle) * speed * spread / duration * 16,
        vy: Math.sin(angle) * speed * spread / duration * 16 - 1,
        life: 1
      });
    }

    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const t = elapsed / duration;

      if (t >= 1) {
        this.destroy({ children: true });
        return;
      }

      for (const p of particles) {
        p.graphic.x += p.vx;
        p.graphic.y += p.vy;
        p.vy += 0.15;
        p.graphic.alpha = 1 - t;
        p.graphic.scale.set(1 - t * 0.5);
      }

      requestAnimationFrame(animate);
    };
    animate();
  }
}
