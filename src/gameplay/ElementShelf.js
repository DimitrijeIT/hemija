import { Container, Graphics, Text } from 'pixi.js';
import { ElementJar } from './ElementJar.js';
import { COLORS, FONT, DESIGN_WIDTH } from '../core/Constants.js';
import { Localization } from '../core/Localization.js';

export class ElementShelf extends Container {
  constructor({ elements, onElementTap }) {
    super();
    this._jars = [];

    const shelfWidth = 310;
    const shelfHeight = 550;

    const loc = Localization.getInstance();
    const label = new Text({
      text: loc.get('gameplay.elements_available'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_DIM }
    });
    label.anchor.set(0.5, 0);
    label.position.set(shelfWidth / 2, 0);
    this.addChild(label);

    // Shelf background
    const bg = new Graphics();
    bg.roundRect(0, 25, shelfWidth, shelfHeight - 25, 12);
    bg.fill({ color: COLORS.SHELF_BROWN, alpha: 0.3 });
    bg.roundRect(0, 25, shelfWidth, shelfHeight - 25, 12);
    bg.stroke({ color: COLORS.SHELF_BROWN, alpha: 0.4, width: 2 });
    this.addChild(bg);

    // Place jars in a grid (2-3 columns)
    const jarWidth = 70;
    const jarHeight = 90;
    const cols = Math.min(elements.length, 3);
    const gapX = 16;
    const gapY = 20;

    for (let i = 0; i < elements.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const totalRowW = Math.min(cols, elements.length - row * cols) * jarWidth + (Math.min(cols, elements.length - row * cols) - 1) * gapX;
      const startX = (shelfWidth - totalRowW) / 2 + jarWidth / 2;

      const jar = new ElementJar({
        element: elements[i],
        onTap: onElementTap
      });
      jar.position.set(startX + col * (jarWidth + gapX), 80 + row * (jarHeight + gapY));
      this.addChild(jar);
      this._jars.push(jar);
    }
  }
}
