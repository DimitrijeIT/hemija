import { Container, Graphics, Text } from 'pixi.js';
import { ReactionSlot } from './ReactionSlot.js';
import { COLORS, FONT } from '../core/Constants.js';
import { Game } from '../core/Game.js';
import { Localization } from '../core/Localization.js';

export class ReactionWorkspace extends Container {
  constructor({ molecule, width, onSlotTap }) {
    super();
    this._slots = [];
    this._molecule = molecule;

    const totalAtoms = molecule.ingredients.reduce((sum, ing) => sum + ing.count, 0);
    const areaWidth = width || (Game.getInstance().screenWidth - 370);

    const loc = Localization.getInstance();
    const label = new Text({
      text: loc.get('gameplay.workspace'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_DIM }
    });
    label.anchor.set(0.5, 0);
    label.position.set(areaWidth / 2, 0);
    this.addChild(label);

    // Background panel
    const panelW = areaWidth;
    const panelH = 160;
    const bg = new Graphics();
    bg.roundRect(0, 25, panelW, panelH, 14);
    bg.fill({ color: 0x1a2a3a, alpha: 0.5 });
    bg.roundRect(0, 25, panelW, panelH, 14);
    bg.stroke({ color: COLORS.PRIMARY, alpha: 0.15, width: 2 });
    this.addChild(bg);

    // Create slots + plus signs + equals + result
    const slotSize = 64;
    const gap = 8;
    const plusW = 20;
    const eqW = 24;
    const resultSize = 72;

    const slotsWidth = totalAtoms * slotSize + (totalAtoms - 1) * (gap + plusW + gap);
    const fullWidth = slotsWidth + gap * 2 + eqW + gap + resultSize;
    let startX = (panelW - fullWidth) / 2 + slotSize / 2;
    const centerY = 25 + panelH / 2;

    for (let i = 0; i < totalAtoms; i++) {
      const slot = new ReactionSlot({ size: slotSize, onTap: onSlotTap });
      slot.position.set(startX + i * (slotSize + gap + plusW + gap), centerY);
      this.addChild(slot);
      this._slots.push(slot);

      if (i < totalAtoms - 1) {
        const plus = new Text({
          text: '+',
          style: { fontFamily: FONT.FAMILY, fontSize: 24, fontWeight: 'bold', fill: COLORS.TEXT_DIM }
        });
        plus.anchor.set(0.5);
        plus.position.set(startX + i * (slotSize + gap + plusW + gap) + slotSize / 2 + gap + plusW / 2, centerY);
        this.addChild(plus);
      }
    }

    const lastSlotX = startX + (totalAtoms - 1) * (slotSize + gap + plusW + gap) + slotSize / 2 + gap * 2;
    const eqSign = new Text({
      text: '=',
      style: { fontFamily: FONT.FAMILY, fontSize: 28, fontWeight: 'bold', fill: COLORS.TEXT_LIGHT }
    });
    eqSign.anchor.set(0.5);
    eqSign.position.set(lastSlotX + eqW / 2, centerY);
    this.addChild(eqSign);

    // Result placeholder
    this._resultContainer = new Container();
    this._resultContainer.position.set(lastSlotX + eqW + gap + resultSize / 2, centerY);
    const resultBg = new Graphics();
    resultBg.roundRect(-resultSize / 2, -resultSize / 2, resultSize, resultSize, 14);
    resultBg.stroke({ color: COLORS.GOLD, alpha: 0.3, width: 2 });
    this._resultContainer.addChild(resultBg);

    const questionMark = new Text({
      text: '?',
      style: { fontFamily: FONT.FAMILY, fontSize: 32, fontWeight: 'bold', fill: COLORS.TEXT_DIM }
    });
    questionMark.anchor.set(0.5);
    this._resultContainer.addChild(questionMark);
    this.addChild(this._resultContainer);
  }

  get slots() { return this._slots; }

  getNextEmptySlot() {
    return this._slots.find(s => s.isEmpty);
  }

  getFilledElements() {
    return this._slots.filter(s => !s.isEmpty).map(s => s.element);
  }

  clearAll() {
    for (const slot of this._slots) slot.clear();
  }

  shakeAll() {
    for (const slot of this._slots) slot.shake();
  }

  showResult(molecule) {
    this._resultContainer.removeChildren();
    const formulaText = new Text({
      text: molecule.formula,
      style: { fontFamily: FONT.FAMILY, fontSize: 24, fontWeight: 'bold', fill: COLORS.GOLD }
    });
    formulaText.anchor.set(0.5);
    this._resultContainer.addChild(formulaText);

    this._resultContainer.scale.set(0);
    const start = Date.now();
    const animate = () => {
      const t = Math.min((Date.now() - start) / 400, 1);
      const ease = 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
      this._resultContainer.scale.set(ease);
      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }
}
