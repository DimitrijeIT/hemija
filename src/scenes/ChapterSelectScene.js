import { Text, Graphics, Container } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { ProgressData } from '../data/ProgressData.js';
import { Button } from '../ui/Button.js';
import { drawMenuBackground } from '../graphics/BackgroundGraphics.js';
import { drawStar } from '../graphics/UIGraphics.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

export class ChapterSelectScene extends Scene {
  constructor() {
    super();
    this._selectedChapter = 1;
  }

  onEnter(params) {
    super.onEnter();
    if (params && params.chapter) this._selectedChapter = params.chapter;
    this._buildUI();
  }

  onResize() {
    this.removeChildren();
    this._buildUI();
  }

  _buildUI() {
    this.removeChildren();
    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();
    const W = this.screenWidth;

    drawMenuBackground(this);

    // Title
    const title = new Text({
      text: loc.get('chapter_select.title'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.TITLE_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    title.anchor.set(0.5);
    title.position.set(W / 2, 35);
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
    backBtn.position.set(15, 15);
    this.addChild(backBtn);

    // Chapter tabs (horizontal)
    const chapters = gameData.chapters;
    const tabWidth = 260;
    const tabGap = 16;
    const totalTabW = chapters.length * tabWidth + (chapters.length - 1) * tabGap;
    const tabStartX = (W - totalTabW) / 2;

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const unlocked = progress.isChapterUnlocked(ch.id);
      const selected = ch.id === this._selectedChapter;

      const tab = new Graphics();
      tab.roundRect(0, 0, tabWidth, 50, 10);
      tab.fill({ color: selected ? COLORS.PRIMARY : (unlocked ? COLORS.BG_PANEL : 0x333355), alpha: selected ? 1 : 0.7 });
      tab.position.set(tabStartX + i * (tabWidth + tabGap), 75);

      const tabLabel = new Text({
        text: `${ch.id}. ${loc.t(ch.title_sr)}`,
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: selected ? 'bold' : 'normal', fill: unlocked ? COLORS.TEXT_WHITE : COLORS.TEXT_DIM }
      });
      tabLabel.anchor.set(0.5);
      tabLabel.position.set(tabWidth / 2, 25);
      tab.addChild(tabLabel);

      if (!unlocked) {
        const lockText = new Text({ text: '\uD83D\uDD12', style: { fontSize: 16 } });
        lockText.anchor.set(0.5);
        lockText.position.set(tabWidth - 22, 25);
        tab.addChild(lockText);
      }

      tab.eventMode = 'static';
      tab.cursor = unlocked ? 'pointer' : 'default';
      tab.on('pointerup', () => {
        if (unlocked) { this._selectedChapter = ch.id; this._buildUI(); }
      });
      this.addChild(tab);
    }

    // Selected chapter info
    const chapter = gameData.getChapter(this._selectedChapter);
    if (!chapter) return;
    const chapterUnlocked = progress.isChapterUnlocked(chapter.id);

    const descText = new Text({
      text: chapter.description_sr,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: Math.min(800, W - 100), align: 'center' }
    });
    descText.anchor.set(0.5, 0);
    descText.position.set(W / 2, 140);
    this.addChild(descText);

    const chStars = progress.getChapterStars(chapter.id);
    const maxStars = chapter.levels.length * 3;
    const starText = new Text({
      text: `\u2605 ${chStars} / ${maxStars}`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.GOLD }
    });
    starText.anchor.set(0.5);
    starText.position.set(W / 2, 170);
    this.addChild(starText);

    if (!chapterUnlocked) {
      const lockMsg = new Text({
        text: loc.get('chapter_select.unlock_requirement', { stars: chapter.unlock_requirement.min_stars }),
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fill: COLORS.ACCENT, align: 'center' }
      });
      lockMsg.anchor.set(0.5);
      lockMsg.position.set(W / 2, DESIGN_HEIGHT / 2);
      this.addChild(lockMsg);
      return;
    }

    // Level grid - landscape layout (more columns)
    const levels = chapter.levels;
    const cols = Math.min(levels.length, 8);
    const dotW = 120;
    const dotH = 130;
    const gapX = 16;
    const gapY = 16;
    const gridW = cols * dotW + (cols - 1) * gapX;
    const startX = (W - gridW) / 2;
    const startY = 210;

    for (let i = 0; i < levels.length; i++) {
      const lv = levels[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (dotW + gapX);
      const y = startY + row * (dotH + gapY);

      const unlocked = progress.isLevelUnlocked(chapter.id, lv.level_number);
      const lvProgress = progress.getLevelProgress(chapter.id, lv.level_number);
      const molecule = lv.molecule_id ? gameData.getMolecule(lv.molecule_id) : null;
      const experiment = lv.experiment_id ? gameData.getExperiment(lv.experiment_id) : null;

      const dot = new Container();
      dot.position.set(x, y);

      const bg = new Graphics();
      bg.roundRect(0, 0, dotW, dotH, 12);
      bg.fill({ color: unlocked ? COLORS.BG_PANEL : 0x222244, alpha: unlocked ? 1 : 0.5 });
      if (unlocked) {
        bg.roundRect(0, 0, dotW, dotH, 12);
        bg.stroke({ color: COLORS.PRIMARY, alpha: 0.3, width: 2 });
      }
      dot.addChild(bg);

      const numText = new Text({
        text: String(lv.level_number),
        style: { fontFamily: FONT.FAMILY, fontSize: 28, fontWeight: 'bold', fill: unlocked ? COLORS.TEXT_WHITE : COLORS.TEXT_DIM }
      });
      numText.anchor.set(0.5);
      numText.position.set(dotW / 2, 24);
      dot.addChild(numText);

      if (molecule) {
        const formulaText = new Text({
          text: molecule.formula,
          style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: unlocked ? COLORS.PRIMARY_LIGHT : COLORS.TEXT_DIM }
        });
        formulaText.anchor.set(0.5);
        formulaText.position.set(dotW / 2, 54);
        dot.addChild(formulaText);

        if (unlocked) {
          const nameText = new Text({
            text: molecule.name_sr.length > 14 ? molecule.name_sr.substring(0, 13) + '\u2026' : molecule.name_sr,
            style: { fontFamily: FONT.FAMILY, fontSize: 12, fill: COLORS.TEXT_DIM }
          });
          nameText.anchor.set(0.5);
          nameText.position.set(dotW / 2, 74);
          dot.addChild(nameText);
        }
      } else if (experiment) {
        const expTitle = loc.t(experiment.title_sr);
        const formulaText = new Text({
          text: experiment.reactants.map(r => r.formula).join('+'),
          style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: unlocked ? COLORS.PRIMARY_LIGHT : COLORS.TEXT_DIM }
        });
        formulaText.anchor.set(0.5);
        formulaText.position.set(dotW / 2, 54);
        dot.addChild(formulaText);

        if (unlocked) {
          const nameText = new Text({
            text: expTitle.length > 14 ? expTitle.substring(0, 13) + '\u2026' : expTitle,
            style: { fontFamily: FONT.FAMILY, fontSize: 12, fill: COLORS.TEXT_DIM }
          });
          nameText.anchor.set(0.5);
          nameText.position.set(dotW / 2, 74);
          dot.addChild(nameText);
        }
      }

      if (!unlocked) {
        const lock = new Text({ text: '\uD83D\uDD12', style: { fontSize: 14 } });
        lock.anchor.set(0.5);
        lock.position.set(dotW / 2, 80);
        dot.addChild(lock);
      } else if (lvProgress) {
        const starG = new Graphics();
        const starSize = 9;
        const starGap = 3;
        const totalStarW = 3 * starSize * 2 + 2 * starGap;
        const sx = (dotW - totalStarW) / 2;
        for (let s = 0; s < 3; s++) {
          drawStar(starG, sx + s * (starSize * 2 + starGap) + starSize, 105, starSize, s < lvProgress.stars);
        }
        dot.addChild(starG);
      } else {
        const newDot = new Text({
          text: '\u2022',
          style: { fontFamily: FONT.FAMILY, fontSize: 20, fill: COLORS.TEXT_DIM }
        });
        newDot.anchor.set(0.5);
        newDot.position.set(dotW / 2, 100);
        dot.addChild(newDot);
      }

      if (unlocked) {
        dot.eventMode = 'static';
        dot.cursor = 'pointer';
        dot.on('pointerup', () => {
          const targetScene = chapter.scene_type === 'experiment' ? SCENES.EXPERIMENT : SCENES.GAMEPLAY;
          SceneManager.getInstance().switchTo(targetScene, {
            chapterId: chapter.id,
            levelNumber: lv.level_number
          });
        });
      }
      this.addChild(dot);
    }
  }
}
