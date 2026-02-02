import { Text, Graphics, Container } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { ProgressData } from '../data/ProgressData.js';
import { AudioManager } from '../core/AudioManager.js';
import { StarDisplay } from '../ui/StarDisplay.js';
import { Button } from '../ui/Button.js';
import { Panel } from '../ui/Panel.js';
import { ParticleEffect } from '../gameplay/ParticleEffect.js';
import { MoleculeStory } from '../gameplay/MoleculeStory.js';
import { ConfettiEffect } from '../gameplay/ConfettiEffect.js';
import { formatFormula } from '../utils/formulaFormat.js';
import { drawMenuBackground } from '../graphics/BackgroundGraphics.js';
import { COLORS, FONT, SCENES, DESIGN_WIDTH, DESIGN_HEIGHT } from '../core/Constants.js';

export class LevelCompleteScene extends Scene {
  onEnter(params) {
    super.onEnter();
    const { chapterId, levelNumber, molecule, scoring } = params;
    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();

    const coinsEarned = progress.saveLevelResult(chapterId, levelNumber, scoring.stars, scoring.totalScore);

    drawMenuBackground(this);

    // ---- Confetti celebration ----
    if (scoring.stars >= 2) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ConfettiEffect({ x: DESIGN_WIDTH / 2, y: 0, width: DESIGN_WIDTH, count: 80, duration: 4000 }));
      }, 400);
    }
    if (scoring.stars === 3) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ConfettiEffect({ x: DESIGN_WIDTH * 0.25, y: 0, width: 400, count: 40, duration: 3500 }));
        this.addChild(new ConfettiEffect({ x: DESIGN_WIDTH * 0.75, y: 0, width: 400, count: 40, duration: 3500 }));
      }, 1000);
    }

    // ---- Left column: result info ----
    const leftCx = 280;

    const title = new Text({
      text: loc.get('level_complete.title'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.TITLE_SIZE, fontWeight: 'bold', fill: COLORS.SUCCESS }
    });
    title.anchor.set(0.5);
    title.position.set(leftCx, 40);
    this.addChild(title);

    // Title entrance animation
    title.scale.set(0);
    const titleStart = Date.now();
    const animTitle = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - titleStart) / 500, 1);
      const elastic = t < 1 ? 1 - Math.pow(2, -10 * t) * Math.cos(t * 4 * Math.PI * 0.5) : 1;
      title.scale.set(elastic);
      if (t < 1) requestAnimationFrame(animTitle);
    };
    animTitle();

    const discovered = new Text({
      text: loc.get('level_complete.molecule_discovered', { molecule: formatFormula(molecule.formula) }),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fill: COLORS.TEXT_WHITE }
    });
    discovered.anchor.set(0.5);
    discovered.position.set(leftCx, 85);
    this.addChild(discovered);

    const moleculeName = new Text({
      text: loc.t(molecule.name_sr),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.TEXT_LIGHT }
    });
    moleculeName.anchor.set(0.5);
    moleculeName.position.set(leftCx, 115);
    this.addChild(moleculeName);

    // Stars
    const starDisplay = new StarDisplay({ count: scoring.stars, total: 3, size: 32, gap: 12 });
    const starWidth = 3 * (32 * 2 + 12) - 12;
    starDisplay.position.set(leftCx - starWidth / 2, 145);
    this.addChild(starDisplay);
    starDisplay.animateIn();

    if (scoring.stars >= 2) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ParticleEffect({ x: leftCx, y: 180, color: COLORS.GOLD, count: 20 }));
      }, 300);
    }

    // Score breakdown panel
    const panel = new Panel({ width: 380, height: 200, color: COLORS.BG_PANEL });
    panel.position.set(leftCx - 190, 215);
    this.addChild(panel);

    // Slide panel in from left
    panel.x = -400;
    const panelStart = Date.now();
    const animPanel = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - panelStart) / 600, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      panel.x = -400 + (leftCx - 190 + 400) * ease;
      if (t < 1) requestAnimationFrame(animPanel);
    };
    setTimeout(animPanel, 200);

    let yRow = 16;
    const rowGap = 32;
    this._addRow(panel, loc.get('gameplay.score'), `${scoring.basePoints}`, COLORS.TEXT_WHITE, yRow);
    yRow += rowGap;
    this._addRow(panel, loc.get('level_complete.time_bonus'), `+${scoring.timeBonus}`, COLORS.SECONDARY, yRow);
    yRow += rowGap;
    if (scoring.hintPenalty > 0) {
      this._addRow(panel, loc.get('level_complete.hint_penalty'), `-${scoring.hintPenalty}`, COLORS.ACCENT, yRow);
      yRow += rowGap;
    }
    const divider = new Graphics();
    divider.rect(20, yRow, 340, 2);
    divider.fill({ color: COLORS.TEXT_DIM, alpha: 0.3 });
    panel.addChild(divider);
    yRow += 10;
    this._addRow(panel, loc.get('level_complete.total_score'), `${scoring.totalScore}`, COLORS.GOLD, yRow, true);
    yRow += rowGap + 4;
    this._addRow(panel, loc.get('level_complete.coins_earned'), `+${coinsEarned} ●`, COLORS.WARNING, yRow);

    // ---- Center column: Molecule Story Animation ----
    const centerCx = 640;
    const storyAnim = new MoleculeStory(molecule.id, 340, 200);
    storyAnim.position.set(centerCx - 170, 40);
    this.addChild(storyAnim);

    // Fun fact below story
    const factPanel = new Panel({ width: 340, height: 120, color: 0x1a2a1a });
    factPanel.position.set(centerCx - 170, 260);
    this.addChild(factPanel);

    const factLabel = new Text({
      text: loc.get('level_complete.fun_fact'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fontWeight: 'bold', fill: COLORS.SECONDARY }
    });
    factLabel.position.set(14, 10);
    factPanel.addChild(factLabel);

    const factText = new Text({
      text: loc.t(molecule.fun_fact),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: 310 }
    });
    factText.position.set(14, 32);
    factPanel.addChild(factText);

    // Fact panel slide up
    factPanel.alpha = 0;
    const factStart = Date.now();
    const animFact = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - factStart) / 500, 1);
      factPanel.alpha = t;
      factPanel.y = 280 - 20 * t;
      if (t < 1) requestAnimationFrame(animFact);
    };
    setTimeout(animFact, 600);

    // ---- Right column: buttons ----
    const rightCx = 1060;
    const chapter = gameData.getChapter(chapterId);
    const nextLevel = chapter.levels.find(l => l.level_number === levelNumber + 1);
    const hasNext = nextLevel && progress.isLevelUnlocked(chapterId, levelNumber + 1);

    let btnY = 80;
    const btnW = 260;

    if (hasNext) {
      const nextBtn = new Button({
        label: loc.get('level_complete.next_level'),
        width: btnW,
        height: 56,
        color: COLORS.BUTTON_GREEN,
        onClick: () => SceneManager.getInstance().switchTo(SCENES.GAMEPLAY, { chapterId, levelNumber: levelNumber + 1 })
      });
      nextBtn.position.set(rightCx - btnW / 2, btnY);
      this.addChild(nextBtn);

      // Bounce the next button in
      nextBtn.scale.set(0);
      setTimeout(() => {
        if (this.destroyed) return;
        const start = Date.now();
        const animBtn = () => {
          if (this.destroyed) return;
          const t = Math.min((Date.now() - start) / 400, 1);
          const s = t < 1 ? 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) * 0.15 : 1;
          nextBtn.scale.set(s);
          if (t < 1) requestAnimationFrame(animBtn);
        };
        animBtn();
      }, 800);

      btnY += 75;
    } else if (levelNumber === chapter.levels.length) {
      const nextChapter = gameData.getChapter(chapterId + 1);
      if (nextChapter && progress.isChapterUnlocked(chapterId + 1)) {
        const nextChBtn = new Button({
          label: `${loc.t(nextChapter.title_sr)} →`,
          width: btnW,
          height: 56,
          color: COLORS.BUTTON_GREEN,
          onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: chapterId + 1 })
        });
        nextChBtn.position.set(rightCx - btnW / 2, btnY);
        this.addChild(nextChBtn);
        btnY += 75;
      }
    }

    const replayBtn = new Button({
      label: loc.get('level_complete.replay'),
      width: btnW,
      height: 50,
      color: COLORS.BUTTON_BLUE,
      fontSize: FONT.BODY_SIZE,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.GAMEPLAY, { chapterId, levelNumber })
    });
    replayBtn.position.set(rightCx - btnW / 2, btnY);
    this.addChild(replayBtn);
    btnY += 64;

    const menuBtn = new Button({
      label: loc.get('level_complete.back_to_menu'),
      width: btnW,
      height: 50,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.BODY_SIZE,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: chapterId })
    });
    menuBtn.position.set(rightCx - btnW / 2, btnY);
    this.addChild(menuBtn);

    AudioManager.getInstance().playSfx('levelComplete');
  }

  _addRow(parent, label, value, valueColor, y, bold = false) {
    const lbl = new Text({
      text: label,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.TEXT_LIGHT }
    });
    lbl.position.set(20, y);
    parent.addChild(lbl);

    const val = new Text({
      text: value,
      style: { fontFamily: FONT.FAMILY, fontSize: bold ? FONT.HEADING_SIZE : FONT.BODY_SIZE, fontWeight: bold ? 'bold' : 'normal', fill: valueColor }
    });
    val.anchor.set(1, 0);
    val.position.set(360, y);
    parent.addChild(val);
  }
}
