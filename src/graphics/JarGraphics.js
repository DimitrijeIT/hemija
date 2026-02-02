import { Graphics, Text, Container } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';

export function createJarVisual(symbol, colorHex, width = 70, height = 90) {
  const container = new Container();
  const color = typeof colorHex === 'string' ? parseInt(colorHex.replace('#', ''), 16) : colorHex;

  // Jar body
  const jar = new Graphics();
  jar.roundRect(-width / 2, -height / 2, width, height, 10);
  jar.fill({ color: 0x88aacc, alpha: 0.15 });
  jar.roundRect(-width / 2, -height / 2, width, height, 10);
  jar.stroke({ color: 0x88aacc, alpha: 0.3, width: 2 });
  container.addChild(jar);

  // Colored liquid fill
  const liquid = new Graphics();
  const liquidH = height * 0.55;
  liquid.roundRect(-width / 2 + 4, height / 2 - liquidH - 4, width - 8, liquidH, 6);
  liquid.fill({ color, alpha: 0.4 });
  container.addChild(liquid);

  // Jar neck
  const neck = new Graphics();
  const neckW = width * 0.5;
  neck.roundRect(-neckW / 2, -height / 2 - 12, neckW, 16, 4);
  neck.fill({ color: 0x88aacc, alpha: 0.2 });
  neck.roundRect(-neckW / 2, -height / 2 - 12, neckW, 16, 4);
  neck.stroke({ color: 0x88aacc, alpha: 0.3, width: 1.5 });
  container.addChild(neck);

  // Glass shine
  const shine = new Graphics();
  shine.roundRect(-width / 2 + 6, -height / 2 + 4, 8, height * 0.6, 4);
  shine.fill({ color: 0xffffff, alpha: 0.12 });
  container.addChild(shine);

  // Symbol label
  const text = new Text({
    text: symbol,
    style: {
      fontFamily: FONT.FAMILY,
      fontSize: 28,
      fontWeight: 'bold',
      fill: COLORS.TEXT_WHITE,
      align: 'center',
      stroke: { color: 0x000000, width: 2 }
    }
  });
  text.anchor.set(0.5);
  text.position.set(0, 5);
  container.addChild(text);

  return container;
}
