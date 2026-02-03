import { Container, Graphics, Text, Sprite } from 'pixi.js';
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
import { AssetLoader } from '../core/AssetLoader.js';
import { formatFormula } from '../utils/formulaFormat.js';
import { Game } from '../core/Game.js';
import { tween, popIn, sineFloat, easeOutBack, easeLinear } from '../utils/animate.js';
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

    // === Responsive two-column layout ===
    const leftColW = Math.min(300, W * 0.35);
    const rightColX = leftColW + 20;
    const rightColW = W - rightColX - 20;

    // Semi-transparent overlay
    const overlay = new Graphics();
    overlay.rect(0, 0, W, DESIGN_HEIGHT);
    overlay.fill({ color: 0x000000, alpha: 0.6 });
    overlay.eventMode = 'static';
    this.addChild(overlay);

    // Overlay fade in using tween
    overlay.alpha = 0;
    tween(overlay, { alpha: 0.6 }, 300, { ease: easeLinear });

    // === Teacher character (bottom-left, responsive) ===
    const teacher = createTeacher(1.3);
    const teacherX = Math.min(90, leftColW / 2);
    teacher.position.set(teacherX, DESIGN_HEIGHT + 100);
    this.addChild(teacher);

    // Teacher slides up from bottom using tween
    const teacherTargetY = DESIGN_HEIGHT - 100;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(teacher, { y: teacherTargetY }, 600, { ease: easeOutBack }).then(() => {
        // Gentle floating bob after landing
        if (!this.destroyed && !teacher.destroyed) {
          sineFloat(teacher, 'y', 3, 1.5);
        }
      });
    }, 200);

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

    const bubbleW = Math.min(260, leftColW - 20);
    const bubble = createSpeechBubble(bubbleText, bubbleW);
    bubble.position.set(Math.max(10, teacherX - 50), DESIGN_HEIGHT - 250);
    bubble.alpha = 0;
    bubble.scale.set(0);
    this.addChild(bubble);

    // Bubble pops in after teacher using animate.js popIn
    setTimeout(() => {
      if (this.destroyed) return;
      popIn(bubble, 400);
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

    // === Molecule Story (right column) + optional real image ===
    const assetLoader = AssetLoader.getInstance();
    const molTexture = assetLoader.getMoleculeTexture(molecule.id);

    if (molTexture) {
      // Show real image alongside narrower MoleculeStory
      const storyW = Math.min(155, (rightColW - 10) / 2);
      const imgW = Math.min(155, rightColW - storyW - 10);

      const story = new MoleculeStory(molecule.id, storyW, 180);
      story.position.set(rightColX, 85);
      this.addChild(story);

      // Real image container
      const imgContainer = new Container();
      imgContainer.position.set(rightColX + storyW + 10, 85);
      this.addChild(imgContainer);

      // Image background
      const imgBg = new Graphics();
      imgBg.roundRect(0, 0, imgW, 180, 10);
      imgBg.fill({ color: 0x0a0a1a, alpha: 0.8 });
      imgBg.roundRect(0, 0, imgW, 180, 10);
      imgBg.stroke({ color: COLORS.SECONDARY, alpha: 0.3, width: 1 });
      imgContainer.addChild(imgBg);

      // "U stvarnosti" label
      const imgLabel = new Text({
        text: loc.isCyrillic ? 'У стварности' : 'U stvarnosti',
        style: { fontFamily: FONT.FAMILY, fontSize: 11, fontWeight: 'bold', fill: COLORS.SECONDARY }
      });
      imgLabel.anchor.set(0.5, 0);
      imgLabel.position.set(imgW / 2, 6);
      imgContainer.addChild(imgLabel);

      // The actual photo
      const photo = new Sprite(molTexture);
      const maxDim = Math.min(130, imgW - 20);
      const scale = Math.min(maxDim / molTexture.width, maxDim / molTexture.height);
      photo.width = molTexture.width * scale;
      photo.height = molTexture.height * scale;
      photo.position.set(imgW / 2 - photo.width / 2, 25 + (145 - photo.height) / 2);
      imgContainer.addChild(photo);

      // Household element image (if space permits and available)
      if (rightColW >= 360 && molecule.ingredients && molecule.ingredients.length > 0) {
        const primarySymbol = molecule.ingredients[0].element_id;
        const householdTexture = assetLoader.getElementHouseholdTexture(primarySymbol);
        if (householdTexture) {
          const hhContainer = new Container();
          const hhW = 80;
          const hhH = 90;
          hhContainer.position.set(rightColX + storyW + imgW + 14, 85);
          this.addChild(hhContainer);

          const hhBg = new Graphics();
          hhBg.roundRect(0, 0, hhW, hhH, 8);
          hhBg.fill({ color: 0x1a2a1a, alpha: 0.8 });
          hhBg.roundRect(0, 0, hhW, hhH, 8);
          hhBg.stroke({ color: COLORS.WARNING, alpha: 0.3, width: 1 });
          hhContainer.addChild(hhBg);

          const hhLabel = new Text({
            text: loc.isCyrillic ? 'У кући' : 'U kući',
            style: { fontFamily: FONT.FAMILY, fontSize: 9, fontWeight: 'bold', fill: COLORS.WARNING }
          });
          hhLabel.anchor.set(0.5, 0);
          hhLabel.position.set(hhW / 2, 4);
          hhContainer.addChild(hhLabel);

          const hhPhoto = new Sprite(householdTexture);
          const hhMaxDim = 55;
          const hhScale = Math.min(hhMaxDim / householdTexture.width, hhMaxDim / householdTexture.height);
          hhPhoto.width = householdTexture.width * hhScale;
          hhPhoto.height = householdTexture.height * hhScale;
          hhPhoto.position.set(hhW / 2 - hhPhoto.width / 2, 20 + (65 - hhPhoto.height) / 2);
          hhContainer.addChild(hhPhoto);

          // Pop-in animation for household image
          hhContainer.alpha = 0;
          hhContainer.scale.set(0);
          setTimeout(() => {
            if (this.destroyed) return;
            popIn(hhContainer, 400);
          }, 1000);
        }
      }

      // Pop-in animation for image using animate.js
      imgContainer.alpha = 0;
      imgContainer.scale.set(0);
      setTimeout(() => {
        if (this.destroyed) return;
        popIn(imgContainer, 400);
      }, 800);
    } else {
      // Fallback: full-width MoleculeStory
      const storyW = Math.min(320, rightColW);
      const story = new MoleculeStory(molecule.id, storyW, 180);
      story.position.set(rightColX, 85);
      this.addChild(story);
    }

    // === Score panel (compact, below story) ===
    const scorePanel = new Graphics();
    const spW = Math.min(320, rightColW);
    const spH = 120;
    const spX = rightColX;
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

    // Score panel slide in from right using tween
    scorePanel.x = W + 50;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(scorePanel, { x: spX }, 500, { ease: easeOutBack });
    }, 400);

    // === Fun fact (right column, below bubble area) ===
    const factW = Math.min(260, rightColW);
    const factBg = new Graphics();
    factBg.roundRect(0, 0, factW, 80, 10);
    factBg.fill({ color: 0x1a2a1a, alpha: 0.9 });
    factBg.roundRect(0, 0, factW, 80, 10);
    factBg.stroke({ color: COLORS.SECONDARY, alpha: 0.3, width: 1 });
    factBg.position.set(rightColX, DESIGN_HEIGHT - 180);
    this.addChild(factBg);

    const factIcon = new Text({
      text: '\uD83D\uDCA1',
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

    // Fade fact in using tween
    factBg.alpha = 0;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(factBg, { alpha: 1 }, 400, { ease: easeLinear });
    }, 1200);

    // === Navigation buttons (right-aligned for easy phone thumb access) ===
    const chapter = gameData.getChapter(chapterId);
    const nextLevel = chapter.levels.find(l => l.level_number === levelNumber + 1);
    const hasNext = nextLevel && progress.isLevelUnlocked(chapterId, levelNumber + 1);

    const btnW = Math.min(220, rightColW - 10);
    let btnX = W - btnW - 20;
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

      // Pop in using animate.js
      nextBtn.scale.set(0);
      nextBtn.alpha = 0;
      setTimeout(() => {
        if (this.destroyed) return;
        popIn(nextBtn, 400);
      }, 1000);

      btnY += 62;
    } else if (levelNumber === chapter.levels.length) {
      const nextChapter = gameData.getChapter(chapterId + 1);
      if (nextChapter && progress.isChapterUnlocked(chapterId + 1)) {
        const ncBtn = new Button({
          label: `${loc.t(nextChapter.title_sr)} \u2192`,
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
