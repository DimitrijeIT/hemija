import { Text, Graphics, Container, Sprite } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { ProgressData } from '../data/ProgressData.js';
import { SaveManager } from '../core/SaveManager.js';
import { AssetLoader } from '../core/AssetLoader.js';
import { Button } from '../ui/Button.js';
import { Panel } from '../ui/Panel.js';
import { createAtomVisual } from '../graphics/AtomGraphics.js';
import { drawLabBackground } from '../graphics/BackgroundGraphics.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

export class LaboratoryScene extends Scene {
  constructor() {
    super();
    this._tab = 'elements';
    this._detailPanel = null;
    this._detailOverlay = null;
  }

  onEnter() {
    super.onEnter();
    this._buildUI();
  }

  onResize() {
    this.removeChildren();
    this._buildUI();
  }

  _buildUI() {
    this.removeChildren();
    const loc = Localization.getInstance();
    const W = this.screenWidth;

    drawLabBackground(this);

    // Title
    const title = new Text({
      text: loc.get('laboratory.title'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.TITLE_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    title.anchor.set(0.5);
    title.position.set(W / 2, 30);
    this.addChild(title);

    // Back button
    const backBtn = new Button({
      label: loc.get('common.back'),
      width: 110,
      height: 40,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.SMALL_SIZE,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.MENU)
    });
    backBtn.position.set(15, 12);
    this.addChild(backBtn);

    // Tabs
    const tabs = [
      { id: 'elements', label: loc.get('laboratory.discovered_elements') },
      { id: 'molecules', label: loc.get('laboratory.discovered_molecules') }
    ];
    const tabW = 280;
    const tabGap = 12;
    const totalTabW = tabs.length * tabW + (tabs.length - 1) * tabGap;
    const tabStartX = (W - totalTabW) / 2;

    for (let i = 0; i < tabs.length; i++) {
      const t = tabs[i];
      const selected = t.id === this._tab;

      const tabBg = new Graphics();
      tabBg.roundRect(0, 0, tabW, 42, 8);
      tabBg.fill({ color: selected ? COLORS.PRIMARY : COLORS.BG_PANEL });
      tabBg.position.set(tabStartX + i * (tabW + tabGap), 65);

      const tabLabel = new Text({
        text: t.label,
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fontWeight: selected ? 'bold' : 'normal', fill: COLORS.TEXT_WHITE }
      });
      tabLabel.anchor.set(0.5);
      tabLabel.position.set(tabW / 2, 21);
      tabBg.addChild(tabLabel);

      tabBg.eventMode = 'static';
      tabBg.cursor = 'pointer';
      tabBg.on('pointerup', () => {
        this._tab = t.id;
        this._buildUI();
      });
      this.addChild(tabBg);
    }

    if (this._tab === 'elements') {
      this._buildElementsGrid();
    } else {
      this._buildMoleculesGrid();
    }
  }

  _buildElementsGrid() {
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();
    const loc = Localization.getInstance();
    const save = SaveManager.getInstance();
    const script = save.getSetting('script');
    const W = this.screenWidth;

    const elements = gameData.elements;
    const cellW = 160;
    const cellH = 80;
    const gapX = 12;
    const gapY = 12;
    const cols = Math.max(3, Math.min(6, Math.floor((W - 40) / (cellW + gapX))));
    const gridW = cols * cellW + (cols - 1) * gapX;
    const startX = (W - gridW) / 2;
    const startY = 125;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const discovered = progress.progress.discoveredElements.includes(el.id);

      const cell = new Container();
      cell.position.set(startX + col * (cellW + gapX), startY + row * (cellH + gapY));

      const bg = new Graphics();
      bg.roundRect(0, 0, cellW, cellH, 10);
      bg.fill({ color: discovered ? COLORS.BG_PANEL : 0x1a1a2e, alpha: discovered ? 1 : 0.4 });
      if (discovered) {
        bg.roundRect(0, 0, cellW, cellH, 10);
        bg.stroke({ color: parseInt(el.color.replace('#', ''), 16), alpha: 0.4, width: 2 });
      }
      cell.addChild(bg);

      // Atom circle
      const color = parseInt(el.color.replace('#', ''), 16);
      const atomCircle = new Graphics();
      atomCircle.circle(35, cellH / 2, 22);
      atomCircle.fill({ color: discovered ? color : 0x444466, alpha: discovered ? 0.8 : 0.3 });
      cell.addChild(atomCircle);

      const symbolText = new Text({
        text: el.symbol,
        style: { fontFamily: FONT.FAMILY, fontSize: 20, fontWeight: 'bold', fill: discovered ? COLORS.TEXT_WHITE : COLORS.TEXT_DIM, stroke: { color: 0x000000, width: 1 } }
      });
      symbolText.anchor.set(0.5);
      symbolText.position.set(35, cellH / 2);
      cell.addChild(symbolText);

      // Name + atomic number
      const name = script === 'cyrillic' ? el.name_sr_cyr : el.name_sr_lat;
      const nameText = new Text({
        text: discovered ? name : '???',
        style: { fontFamily: FONT.FAMILY, fontSize: 14, fill: discovered ? COLORS.TEXT_WHITE : COLORS.TEXT_DIM }
      });
      nameText.position.set(65, 14);
      cell.addChild(nameText);

      const numText = new Text({
        text: `#${el.atomic_number}`,
        style: { fontFamily: FONT.FAMILY, fontSize: 12, fill: COLORS.TEXT_DIM }
      });
      numText.position.set(65, 34);
      cell.addChild(numText);

      if (!discovered) {
        const lockIcon = new Text({ text: '\uD83D\uDD12', style: { fontSize: 12 } });
        lockIcon.position.set(65, 52);
        cell.addChild(lockIcon);
      } else {
        const catName = loc.get(`categories.${el.category}`) || el.category;
        const catText = new Text({
          text: catName,
          style: { fontFamily: FONT.FAMILY, fontSize: 11, fill: COLORS.TEXT_DIM }
        });
        catText.position.set(65, 52);
        cell.addChild(catText);
      }

      if (discovered) {
        cell.eventMode = 'static';
        cell.cursor = 'pointer';
        cell.on('pointerup', () => this._showElementDetail(el));
      }

      this.addChild(cell);
    }
  }

  _buildMoleculesGrid() {
    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();
    const W = this.screenWidth;

    const molecules = gameData.molecules;
    const cellW = 210;
    const cellH = 70;
    const gapX = 12;
    const gapY = 10;
    const cols = Math.max(3, Math.min(5, Math.floor((W - 40) / (cellW + gapX))));
    const gridW = cols * cellW + (cols - 1) * gapX;
    const startX = (W - gridW) / 2;
    const startY = 125;

    for (let i = 0; i < molecules.length; i++) {
      const mol = molecules[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const discovered = progress.progress.discoveredMolecules.includes(mol.id);

      const cell = new Container();
      cell.position.set(startX + col * (cellW + gapX), startY + row * (cellH + gapY));

      const bg = new Graphics();
      bg.roundRect(0, 0, cellW, cellH, 10);
      bg.fill({ color: discovered ? COLORS.BG_PANEL : 0x1a1a2e, alpha: discovered ? 1 : 0.4 });
      if (discovered) {
        bg.roundRect(0, 0, cellW, cellH, 10);
        bg.stroke({ color: COLORS.PRIMARY, alpha: 0.3, width: 2 });
      }
      cell.addChild(bg);

      const formulaText = new Text({
        text: discovered ? mol.formula : '???',
        style: { fontFamily: FONT.FAMILY, fontSize: 22, fontWeight: 'bold', fill: discovered ? COLORS.PRIMARY_LIGHT : COLORS.TEXT_DIM }
      });
      formulaText.position.set(12, 10);
      cell.addChild(formulaText);

      const nameText = new Text({
        text: discovered ? loc.t(mol.name_sr) : '???',
        style: { fontFamily: FONT.FAMILY, fontSize: 13, fill: discovered ? COLORS.TEXT_LIGHT : COLORS.TEXT_DIM }
      });
      nameText.position.set(12, 40);
      cell.addChild(nameText);

      if (!discovered) {
        const lockIcon = new Text({ text: '\uD83D\uDD12', style: { fontSize: 12 } });
        lockIcon.anchor.set(1, 0.5);
        lockIcon.position.set(cellW - 12, cellH / 2);
        cell.addChild(lockIcon);
      } else {
        const chText = new Text({
          text: `Ch.${mol.chapter}`,
          style: { fontFamily: FONT.FAMILY, fontSize: 11, fill: COLORS.TEXT_DIM }
        });
        chText.anchor.set(1, 0);
        chText.position.set(cellW - 10, 10);
        cell.addChild(chText);
      }

      this.addChild(cell);
    }
  }

  _showElementDetail(element) {
    const loc = Localization.getInstance();
    const save = SaveManager.getInstance();
    const script = save.getSetting('script');
    const W = this.screenWidth;

    // Overlay
    this._detailOverlay = new Graphics();
    this._detailOverlay.rect(0, 0, W, DESIGN_HEIGHT);
    this._detailOverlay.fill({ color: COLORS.OVERLAY, alpha: 0.7 });
    this._detailOverlay.eventMode = 'static';
    this._detailOverlay.on('pointerup', () => this._closeDetail());
    this.addChild(this._detailOverlay);

    // Detail panel
    const pw = Math.min(500, W - 60);
    const ph = 450;
    this._detailPanel = new Panel({ width: pw, height: ph, color: 0x16213e });
    this._detailPanel.position.set((W - pw) / 2, (DESIGN_HEIGHT - ph) / 2);
    this.addChild(this._detailPanel);

    const p = this._detailPanel;
    const name = script === 'cyrillic' ? element.name_sr_cyr : element.name_sr_lat;
    const color = parseInt(element.color.replace('#', ''), 16);

    // Big atom visual with real electron shells
    const atom = createAtomVisual(element.symbol, color, 40, true, element);
    atom.position.set(70, 70);
    p.addChild(atom);

    // Real element photo (if available)
    const assetLoader = AssetLoader.getInstance();
    const elemTexture = assetLoader.getElementTexture(element.symbol);
    if (elemTexture) {
      const photo = new Sprite(elemTexture);
      photo.width = 80;
      photo.height = 80;
      photo.position.set(pw - 110, 30);
      photo.alpha = 0;
      photo.scale.set(0);
      p.addChild(photo);

      // Pop-in animation
      const photoStart = Date.now();
      const popPhoto = () => {
        if (p.destroyed || photo.destroyed) return;
        const t = Math.min((Date.now() - photoStart) / 350, 1);
        const s = t < 1 ? 1 + Math.pow(2, -8 * t) * Math.sin((t - 0.1) * 4 * Math.PI) * 0.1 : 1;
        photo.scale.set(s * 80 / elemTexture.width, s * 80 / elemTexture.height);
        photo.alpha = Math.min(t * 2, 1);
        if (t < 1) requestAnimationFrame(popPhoto);
      };
      setTimeout(popPhoto, 200);
    }

    // Name + Symbol
    const nameText = new Text({
      text: name,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    nameText.position.set(130, 35);
    p.addChild(nameText);

    const symbolText = new Text({
      text: `${loc.get('element_details.symbol')}: ${element.symbol}`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.TEXT_LIGHT }
    });
    symbolText.position.set(130, 75);
    p.addChild(symbolText);

    // Detail rows
    let y = 130;
    const rowH = 32;
    const details = [
      [loc.get('element_details.atomic_number'), String(element.atomic_number)],
      [loc.get('element_details.atomic_mass'), String(element.atomic_mass)],
      [loc.get('element_details.category'), loc.get(`categories.${element.category}`) || element.category],
      [loc.get('element_details.valence'), element.valence.join(', ')]
    ];

    for (const [label, value] of details) {
      const lbl = new Text({
        text: label + ':',
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_DIM }
      });
      lbl.position.set(30, y);
      p.addChild(lbl);

      const val = new Text({
        text: value,
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
      });
      val.position.set(220, y);
      p.addChild(val);

      y += rowH;
    }

    // Fun fact
    y += 10;
    const factLabel = new Text({
      text: loc.get('element_details.fun_fact') + ':',
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fontWeight: 'bold', fill: COLORS.SECONDARY }
    });
    factLabel.position.set(30, y);
    p.addChild(factLabel);
    y += 24;

    const factText = new Text({
      text: loc.t(element.fun_fact),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: pw - 60 }
    });
    factText.position.set(30, y);
    p.addChild(factText);

    // Close button
    const closeBtn = new Button({
      label: loc.get('common.close'),
      width: 140,
      height: 40,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.SMALL_SIZE,
      onClick: () => this._closeDetail()
    });
    closeBtn.position.set(pw - 160, 15);
    p.addChild(closeBtn);
  }

  _closeDetail() {
    if (this._detailOverlay) {
      this.removeChild(this._detailOverlay);
      this._detailOverlay.destroy();
      this._detailOverlay = null;
    }
    if (this._detailPanel) {
      this.removeChild(this._detailPanel);
      this._detailPanel.destroy({ children: true });
      this._detailPanel = null;
    }
  }
}
