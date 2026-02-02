import { Container, Graphics, Text } from 'pixi.js';
import { createTeacher, createSpeechBubble } from '../graphics/TeacherGraphics.js';
import { MoleculeStory } from '../gameplay/MoleculeStory.js';
import { ConfettiEffect } from '../gameplay/ConfettiEffect.js';
import { StarDisplay } from './StarDisplay.js';
import { Button } from './Button.js';
import { ParticleEffect } from '../gameplay/ParticleEffect.js';
import { Localization } from '../core/Localization.js';
import { SceneManager } from '../core/SceneManager.js';
import { GameData } from '../data/GameData.js';
import { ProgressData } from '../data/ProgressData.js';
import { AudioManager } from '../core/AudioManager.js';
import { formatFormula } from '../utils/formulaFormat.js';
import { Game } from '../core/Game.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

/**
 * Fun teacher popup overlay that appears on top of GameplayScene
 * instead of switching to a boring separate results screen.
 */
export class TeacherPopup extends Container {
  constructor({ chapterId, levelNumber, molecule, scoring }) {
    super();
    this._chapterId = chapterId;
    this._levelNumber = levelNumber;

    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();
    const W = Game.getInstance().screenWidth;
    const coinsEarned = progress.saveLevelResult(chapterId, levelNumber, scoring.stars, scoring.totalScore);

    // Semi-transparent overlay
    const overlay = new Graphics();
    overlay.rect(0, 0, W, DESIGN_HEIGHT);
    overlay.fill({ color: 0x000000, alpha: 0.6 });
    overlay.eventMode = 'static';
    this.addChild(overlay);

    // Overlay fade in
    overlay.alpha = 0;
    const overlayStart = Date.now();
    const fadeOverlay = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - overlayStart) / 300, 1);
      overlay.alpha = t * 0.6;
      if (t < 1) requestAnimationFrame(fadeOverlay);
    };
    fadeOverlay();

    // === Teacher character (bottom-left) ===
    const teacher = createTeacher(1.3);
    teacher.position.set(90, DESIGN_HEIGHT + 100);
    this.addChild(teacher);

    // Teacher slides up from bottom
    const teacherTargetY = DESIGN_HEIGHT - 100;
    const teacherStart = Date.now();
    const slideTeacher = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - teacherStart) / 600, 1);
      // Elastic ease out
      const ease = t < 1 ? 1 - Math.pow(2, -8 * t) * Math.cos(t * 3 * Math.PI) * 0.3 : 1;
      teacher.y = DESIGN_HEIGHT + 100 - (DESIGN_HEIGHT + 100 - teacherTargetY) * ease;
      if (t < 1) requestAnimationFrame(slideTeacher);
    };
    setTimeout(slideTeacher, 200);

    // === Speech bubble with congratulation ===
    const congratsMessages = [
      loc.get('feedback.correct'),
      loc.isCyrillic ? 'Одлично урађено!' : 'Odlično urađeno!',
      loc.isCyrillic ? 'Свака част!' : 'Svaka čast!',
      loc.isCyrillic ? 'Хемичар у настајању!' : 'Hemičar u nastajanju!'
    ];
    const congrats = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
    const formulaStr = formatFormula(molecule.formula);
    const discoveredMsg = loc.get('level_complete.molecule_discovered', { molecule: formulaStr });
    const bubbleText = `${congrats}\n${discoveredMsg}`;

    const bubble = createSpeechBubble(bubbleText, 260);
    bubble.position.set(40, DESIGN_HEIGHT - 250);
    bubble.alpha = 0;
    bubble.scale.set(0.5);
    this.addChild(bubble);

    // Bubble pops in after teacher
    setTimeout(() => {
      if (this.destroyed) return;
      const bubStart = Date.now();
      const popBubble = () => {
        if (this.destroyed) return;
        const t = Math.min((Date.now() - bubStart) / 400, 1);
        const s = t < 1 ? 1 + Math.pow(2, -8 * t) * Math.sin((t - 0.1) * 4 * Math.PI) * 0.15 : 1;
        bubble.scale.set(s);
        bubble.alpha = Math.min(t * 2, 1);
        if (t < 1) requestAnimationFrame(popBubble);
      };
      popBubble();
    }, 600);

    // === Stars (top center, big and celebratory) ===
    const starDisplay = new StarDisplay({ count: scoring.stars, total: 3, size: 36, gap: 16 });
    const starWidth = 3 * (36 * 2 + 16) - 16;
    starDisplay.position.set(W / 2 - starWidth / 2, 30);
    this.addChild(starDisplay);
    setTimeout(() => {
      if (this.destroyed) return;
      starDisplay.animateIn();
      if (scoring.stars >= 2) {
        this.addChild(new ParticleEffect({ x: W / 2, y: 70, color: COLORS.GOLD, count: 25 }));
      }
    }, 500);

    // Confetti for good results
    if (scoring.stars >= 2) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ConfettiEffect({ x: W / 2, y: 0, width: W, count: 70, duration: 4000 }));
      }, 300);
    }
    if (scoring.stars === 3) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ConfettiEffect({ x: W * 0.2, y: 0, width: 300, count: 30, duration: 3000 }));
        this.addChild(new ConfettiEffect({ x: W * 0.8, y: 0, width: 300, count: 30, duration: 3000 }));
      }, 900);
    }

    // === Molecule Story (center-right) ===
    const story = new MoleculeStory(molecule.id, 320, 180);
    story.position.set(W / 2 + 30, 85);
    this.addChild(story);

    // === Score panel (compact, below story) ===
    const scorePanel = new Graphics();
    const spW = 320;
    const spH = 120;
    const spX = W / 2 + 30;
    const spY = 280;
    scorePanel.roundRect(0, 0, spW, spH, 12);
    scorePanel.fill({ color: COLORS.BG_PANEL, alpha: 0.9 });
    scorePanel.roundRect(0, 0, spW, spH, 12);
    scorePanel.stroke({ color: COLORS.GOLD, alpha: 0.2, width: 1.5 });
    scorePanel.position.set(spX, spY);
    this.addChild(scorePanel);

    // Score rows
    let rowY = 10;
    const rowH = 22;
    this._scoreRow(scorePanel, loc.get('gameplay.score'), `${scoring.basePoints}`, COLORS.TEXT_WHITE, rowY, spW);
    rowY += rowH;
    this._scoreRow(scorePanel, loc.get('level_complete.time_bonus'), `+${scoring.timeBonus}`, COLORS.SECONDARY, rowY, spW);
    rowY += rowH;
    if (scoring.hintPenalty > 0) {
      this._scoreRow(scorePanel, loc.get('level_complete.hint_penalty'), `-${scoring.hintPenalty}`, COLORS.ACCENT, rowY, spW);
      rowY += rowH;
    }
    // Divider
    const div = new Graphics();
    div.rect(12, rowY, spW - 24, 1);
    div.fill({ color: COLORS.TEXT_DIM, alpha: 0.3 });
    scorePanel.addChild(div);
    rowY += 8;
    this._scoreRow(scorePanel, loc.get('level_complete.total_score'), `${scoring.totalScore}`, COLORS.GOLD, rowY, spW, true);
    rowY += rowH + 2;
    this._scoreRow(scorePanel, loc.get('level_complete.coins_earned'), `+${coinsEarned}`, COLORS.WARNING, rowY, spW);

    // Score panel slide in from right
    scorePanel.x = W + 50;
    setTimeout(() => {
      if (this.destroyed) return;
      const slideStart = Date.now();
      const slidePanel = () => {
        if (this.destroyed) return;
        const t = Math.min((Date.now() - slideStart) / 500, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        scorePanel.x = W + 50 - (W + 50 - spX) * ease;
        if (t < 1) requestAnimationFrame(slidePanel);
      };
      slidePanel();
    }, 400);

    // === Fun fact (from teacher, below speech bubble) ===
    const factBg = new Graphics();
    const factW = 260;
    factBg.roundRect(0, 0, factW, 80, 10);
    factBg.fill({ color: 0x1a2a1a, alpha: 0.9 });
    factBg.roundRect(0, 0, factW, 80, 10);
    factBg.stroke({ color: COLORS.SECONDARY, alpha: 0.3, width: 1 });
    factBg.position.set(320, DESIGN_HEIGHT - 180);
    this.addChild(factBg);

    const factIcon = new Text({
      text: loc.isCyrillic ? '💡' : '💡',
      style: { fontSize: 14 }
    });
    factIcon.position.set(8, 6);
    factBg.addChild(factIcon);

    const factLabel = new Text({
      text: loc.get('level_complete.fun_fact'),
      style: { fontFamily: FONT.FAMILY, fontSize: 12, fontWeight: 'bold', fill: COLORS.SECONDARY }
    });
    factLabel.position.set(26, 8);
    factBg.addChild(factLabel);

    const factText = new Text({
      text: loc.t(molecule.fun_fact),
      style: { fontFamily: FONT.FAMILY, fontSize: 11, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: factW - 20, lineHeight: 14 }
    });
    factText.position.set(10, 28);
    factBg.addChild(factText);

    // Fade fact in
    factBg.alpha = 0;
    setTimeout(() => {
      if (this.destroyed) return;
      const factStart = Date.now();
      const fadeFact = () => {
        if (this.destroyed) return;
        const t = Math.min((Date.now() - factStart) / 400, 1);
        factBg.alpha = t;
        if (t < 1) requestAnimationFrame(fadeFact);
      };
      fadeFact();
    }, 1200);

    // === Navigation buttons (bottom-right) ===
    const chapter = gameData.getChapter(chapterId);
    const nextLevel = chapter.levels.find(l => l.level_number === levelNumber + 1);
    const hasNext = nextLevel && progress.isLevelUnlocked(chapterId, levelNumber + 1);

    const btnW = 220;
    let btnX = W - btnW - 40;
    let btnY = DESIGN_HEIGHT - 170;

    if (hasNext) {
      const nextBtn = new Button({
        label: loc.get('level_complete.next_level'),
        width: btnW,
        height: 52,
        color: COLORS.BUTTON_GREEN,
        fontSize: 18,
        onClick: () => SceneManager.getInstance().switchTo(SCENES.GAMEPLAY, { chapterId, levelNumber: levelNumber + 1 })
      });
      nextBtn.position.set(btnX, btnY);
      this.addChild(nextBtn);

      // Pop in
      nextBtn.scale.set(0);
      setTimeout(() => {
        if (this.destroyed) return;
        const s = Date.now();
        const pop = () => {
          if (this.destroyed) return;
          const t = Math.min((Date.now() - s) / 400, 1);
          const v = t < 1 ? 1 + Math.pow(2, -8 * t) * Math.sin((t - 0.1) * 4 * Math.PI) * 0.12 : 1;
          nextBtn.scale.set(v);
          if (t < 1) requestAnimationFrame(pop);
        };
        pop();
      }, 1000);

      btnY += 62;
    } else if (levelNumber === chapter.levels.length) {
      const nextChapter = gameData.getChapter(chapterId + 1);
      if (nextChapter && progress.isChapterUnlocked(chapterId + 1)) {
        const ncBtn = new Button({
          label: `${loc.t(nextChapter.title_sr)} →`,
          width: btnW,
          height: 52,
          color: COLORS.BUTTON_GREEN,
          fontSize: 18,
          onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: chapterId + 1 })
        });
        ncBtn.position.set(btnX, btnY);
        this.addChild(ncBtn);
        btnY += 62;
      }
    }

    const replayBtn = new Button({
      label: loc.get('level_complete.replay'),
      width: btnW,
      height: 46,
      color: COLORS.BUTTON_BLUE,
      fontSize: 16,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.GAMEPLAY, { chapterId, levelNumber })
    });
    replayBtn.position.set(btnX, btnY);
    this.addChild(replayBtn);
    btnY += 56;

    const menuBtn = new Button({
      label: loc.get('level_complete.back_to_menu'),
      width: btnW,
      height: 46,
      color: COLORS.BUTTON_GRAY,
      fontSize: 16,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: chapterId })
    });
    menuBtn.position.set(btnX, btnY);
    this.addChild(menuBtn);

    AudioManager.getInstance().playSfx('levelComplete');
  }

  _scoreRow(parent, label, value, color, y, panelW, bold = false) {
    const lbl = new Text({
      text: label,
      style: { fontFamily: FONT.FAMILY, fontSize: 13, fill: COLORS.TEXT_LIGHT }
    });
    lbl.position.set(12, y);
    parent.addChild(lbl);

    const val = new Text({
      text: value,
      style: { fontFamily: FONT.FAMILY, fontSize: bold ? 16 : 13, fontWeight: bold ? 'bold' : 'normal', fill: color }
    });
    val.anchor.set(1, 0);
    val.position.set(panelW - 12, y);
    parent.addChild(val);
  }
}
