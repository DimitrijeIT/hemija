import { Container, Text, Graphics } from 'pixi.js';
import { COLORS, FONT, DESIGN_WIDTH } from '../core/Constants.js';

export class Toast extends Container {
  constructor({ message, color = COLORS.PRIMARY, duration = 2000 }) {
    super();

    const padding = 16;
    const text = new Text({
      text: message,
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.BODY_SIZE,
        fill: COLORS.TEXT_WHITE,
        align: 'center'
      }
    });
    text.anchor.set(0.5);

    const bg = new Graphics();
    const w = text.width + padding * 2;
    const h = text.height + padding * 2;
    bg.roundRect(-w / 2, -h / 2, w, h, 10);
    bg.fill({ color, alpha: 0.9 });

    this.addChild(bg);
    this.addChild(text);

    this.position.set(DESIGN_WIDTH / 2, 120);
    this.alpha = 0;

    const start = Date.now();
    const fadeIn = 200;
    const hold = duration;
    const fadeOut = 300;

    const animate = () => {
      const elapsed = Date.now() - start;
      if (elapsed < fadeIn) {
        this.alpha = elapsed / fadeIn;
        this.position.y = 120 - (elapsed / fadeIn) * 15;
      } else if (elapsed < fadeIn + hold) {
        this.alpha = 1;
        this.position.y = 105;
      } else if (elapsed < fadeIn + hold + fadeOut) {
        const t = (elapsed - fadeIn - hold) / fadeOut;
        this.alpha = 1 - t;
        this.position.y = 105 - t * 20;
      } else {
        this.destroy();
        return;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
}
