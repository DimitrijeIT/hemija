import { Text, Graphics, Container } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { AudioManager } from '../core/AudioManager.js';
import { ElementShelf } from '../gameplay/ElementShelf.js';
import { ReactionWorkspace } from '../gameplay/ReactionWorkspace.js';
import { MoleculeVerifier } from '../gameplay/MoleculeVerifier.js';
import { ScoringEngine } from '../gameplay/ScoringEngine.js';
import { HintSystem } from '../gameplay/HintSystem.js';
import { ParticleEffect } from '../gameplay/ParticleEffect.js';
import { ConfettiEffect } from '../gameplay/ConfettiEffect.js';
import { TeacherPopup } from '../ui/TeacherPopup.js';
import { TimerBar } from '../ui/TimerBar.js';
import { Button } from '../ui/Button.js';
import { Toast } from '../ui/Toast.js';
import { drawGameplayBackground } from '../graphics/BackgroundGraphics.js';
import { formatFormula } from '../utils/formulaFormat.js';
import { COLORS, FONT, SCENES, DESIGN_WIDTH, DESIGN_HEIGHT } from '../core/Constants.js';

export class GameplayScene extends Scene {
  constructor() {
    super();
    this._chapterId = 1;
    this._levelNumber = 1;
    this._molecule = null;
    this._levelConfig = null;
    this._workspace = null;
    this._timer = null;
    this._hintSystem = new HintSystem();
    this._gameOver = false;
    this._submitted = false;
  }

  onEnter(params) {
    super.onEnter();
    this._chapterId = params.chapterId;
    this._levelNumber = params.levelNumber;
    this._gameOver = false;
    this._submitted = false;
    this._hintSystem.reset();

    const gameData = GameData.getInstance();
    this._levelConfig = gameData.getLevelConfig(this._chapterId, this._levelNumber);
    this._molecule = this._levelConfig.molecule;

    this._buildUI();
  }

  _buildUI() {
    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();

    drawGameplayBackground(this);

    // ---- Top bar (full width) ----
    const backBtn = new Button({
      label: loc.get('common.back'),
      width: 90,
      height: 36,
      color: COLORS.BUTTON_GRAY,
      fontSize: 14,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: this._chapterId })
    });
    backBtn.position.set(10, 12);
    this.addChild(backBtn);

    const titleText = new Text({
      text: loc.get('gameplay.title', { molecule: formatFormula(this._molecule.formula) }),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    titleText.anchor.set(0.5, 0);
    titleText.position.set(DESIGN_WIDTH / 2, 8);
    this.addChild(titleText);

    const nameText = new Text({
      text: loc.t(this._molecule.name_sr),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_LIGHT }
    });
    nameText.anchor.set(0.5, 0);
    nameText.position.set(DESIGN_WIDTH / 2, 34);
    this.addChild(nameText);

    // Difficulty stars top right
    const diffText = new Text({
      text: '★'.repeat(this._molecule.difficulty) + '☆'.repeat(3 - this._molecule.difficulty),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.GOLD }
    });
    diffText.anchor.set(1, 0);
    diffText.position.set(DESIGN_WIDTH - 15, 12);
    this.addChild(diffText);

    // Timer bar below top bar
    this._timer = new TimerBar({
      width: DESIGN_WIDTH - 30,
      height: 18,
      totalTime: this._molecule.time_limit_seconds
    });
    this._timer.position.set(15, 58);
    this.addChild(this._timer);
    this._timer.start();

    // ---- Layout: Left side = Element shelf, Right side = Workspace + buttons ----
    const leftX = 15;
    const leftW = 320;
    const rightX = leftW + 30;
    const contentY = 90;

    // Element shelf (left column)
    const elements = this._getAvailableElements();
    this._shelf = new ElementShelf({
      elements,
      onElementTap: (element) => this._onElementTap(element)
    });
    this._shelf.position.set(leftX, contentY);
    this.addChild(this._shelf);

    // Reaction workspace (right side, wider)
    this._workspace = new ReactionWorkspace({
      molecule: this._molecule,
      onSlotTap: (slot) => this._onSlotTap(slot)
    });
    this._workspace.position.set(rightX, contentY);
    this.addChild(this._workspace);

    // Hint text area
    this._hintTextDisplay = new Text({
      text: '',
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.SMALL_SIZE,
        fill: COLORS.WARNING,
        wordWrap: true,
        wordWrapWidth: DESIGN_WIDTH - rightX - 40,
        align: 'center'
      }
    });
    this._hintTextDisplay.anchor.set(0.5, 0);
    this._hintTextDisplay.position.set(rightX + (DESIGN_WIDTH - rightX) / 2 - 15, 320);
    this.addChild(this._hintTextDisplay);

    // ---- Bottom buttons row ----
    const btnY = DESIGN_HEIGHT - 80;
    const btnH = 50;

    const hintBtn = new Button({
      label: `${loc.get('gameplay.hint')} (${this._hintSystem.hintsRemaining})`,
      width: 180,
      height: btnH,
      color: COLORS.WARNING,
      fontSize: FONT.SMALL_SIZE,
      onClick: () => this._onHint()
    });
    hintBtn.position.set(rightX, btnY);
    this.addChild(hintBtn);
    this._hintBtn = hintBtn;

    const clearBtn = new Button({
      label: loc.get('gameplay.clear'),
      width: 160,
      height: btnH,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.SMALL_SIZE,
      onClick: () => this._onClear()
    });
    clearBtn.position.set(rightX + 190, btnY);
    this.addChild(clearBtn);

    const submitBtn = new Button({
      label: loc.get('gameplay.submit'),
      width: 280,
      height: 56,
      color: COLORS.BUTTON_GREEN,
      fontSize: 24,
      onClick: () => this._onSubmit()
    });
    submitBtn.position.set(DESIGN_WIDTH - 295, btnY - 4);
    this.addChild(submitBtn);
    this._submitBtn = submitBtn;
  }

  _getAvailableElements() {
    const gameData = GameData.getInstance();
    const elementIds = new Set();
    for (const ing of this._molecule.ingredients) {
      elementIds.add(ing.element_id);
    }
    const chapterElements = gameData.getElementsForChapter(this._chapterId);
    for (const el of chapterElements) {
      elementIds.add(el.id);
    }
    return [...elementIds]
      .map(id => gameData.getElement(id))
      .filter(Boolean)
      .sort((a, b) => a.atomic_number - b.atomic_number);
  }

  _onElementTap(element) {
    if (this._gameOver) return;
    const slot = this._workspace.getNextEmptySlot();
    if (!slot) return;
    slot.placeAtom(element);
    AudioManager.getInstance().playSfx('place');
  }

  _onSlotTap(slot) {
    if (this._gameOver) return;
    slot.removeAtom();
    AudioManager.getInstance().playSfx('remove');
  }

  _onClear() {
    if (this._gameOver) return;
    this._workspace.clearAll();
  }

  _onHint() {
    if (this._gameOver) return;
    const loc = Localization.getInstance();
    const hint = this._hintSystem.useHint(this._molecule);
    if (hint) {
      this._hintTextDisplay.text = loc.t(hint);
      this._hintBtn.label = `${loc.get('gameplay.hint')} (${this._hintSystem.hintsRemaining})`;
      AudioManager.getInstance().playSfx('hint');
    } else {
      const toast = new Toast({ message: loc.get('hints.no_hints'), color: COLORS.ACCENT });
      this.addChild(toast);
    }
  }

  _onSubmit() {
    if (this._gameOver || this._submitted) return;
    const filledElements = this._workspace.getFilledElements();
    if (filledElements.length === 0) return;

    const result = MoleculeVerifier.verify(filledElements, this._molecule);
    if (result.correct) {
      this._onSuccess();
    } else {
      this._onFailure(result.reason);
    }
  }

  _onSuccess() {
    this._gameOver = true;
    this._submitted = true;
    this._timer.stop();
    AudioManager.getInstance().playSfx('success');

    this._workspace.showResult(this._molecule, this._workspace.getFilledElements());

    // Gold particles burst from workspace area
    const particles = new ParticleEffect({
      x: DESIGN_WIDTH / 2 + 200,
      y: 250,
      color: COLORS.GOLD,
      count: 30,
      spread: 120,
      duration: 1000
    });
    this.addChild(particles);

    // Success flash
    const flash = new Graphics();
    flash.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
    flash.fill({ color: COLORS.SUCCESS, alpha: 0.15 });
    this.addChild(flash);

    const start = Date.now();
    const fadeFlash = () => {
      if (this.destroyed) return;
      const t = (Date.now() - start) / 500;
      if (t >= 1) { this.removeChild(flash); flash.destroy(); return; }
      flash.alpha = 0.15 * (1 - t);
      requestAnimationFrame(fadeFlash);
    };
    fadeFlash();

    // Bounce the "Bravo!" text overlay briefly
    const loc = Localization.getInstance();
    const bravoText = new Text({
      text: loc.get('feedback.correct'),
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: 64,
        fontWeight: 'bold',
        fill: COLORS.GOLD,
        stroke: { color: 0x000000, width: 4 }
      }
    });
    bravoText.anchor.set(0.5);
    bravoText.position.set(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);
    bravoText.scale.set(0);
    this.addChild(bravoText);

    const bravoStart = Date.now();
    const animBravo = () => {
      if (this.destroyed) return;
      const t = Math.min((Date.now() - bravoStart) / 600, 1);
      const s = t < 1 ? 1 + Math.pow(2, -8 * t) * Math.sin((t - 0.1) * 4 * Math.PI) * 0.3 : 1;
      bravoText.scale.set(s);
      bravoText.rotation = Math.sin(t * Math.PI * 2) * 0.05 * (1 - t);
      if (t < 1) requestAnimationFrame(animBravo);
    };
    setTimeout(animBravo, 100);

    // After brief celebration, show teacher popup overlay (no scene switch!)
    setTimeout(() => {
      if (this.destroyed) return;

      // Fade out bravo
      const fadeStart = Date.now();
      const fadeBravo = () => {
        if (this.destroyed || bravoText.destroyed) return;
        const t = Math.min((Date.now() - fadeStart) / 300, 1);
        bravoText.alpha = 1 - t;
        bravoText.scale.set(1 + t * 0.3);
        if (t >= 1 && !bravoText.destroyed) bravoText.destroy();
        else requestAnimationFrame(fadeBravo);
      };
      fadeBravo();

      // Calculate scoring and show teacher popup
      const scoring = ScoringEngine.calculate(
        this._molecule,
        this._timer.remaining,
        this._molecule.time_limit_seconds,
        this._hintSystem.hintsUsed
      );

      const popup = new TeacherPopup({
        chapterId: this._chapterId,
        levelNumber: this._levelNumber,
        molecule: this._molecule,
        scoring
      });
      this.addChild(popup);
    }, 1000);
  }

  _onFailure(reason) {
    const loc = Localization.getInstance();
    let message;
    if (reason === 'wrong_elements') message = loc.get('feedback.wrong_elements');
    else if (reason === 'wrong_count') message = loc.get('feedback.wrong_count');
    else message = loc.get('feedback.incorrect');

    AudioManager.getInstance().playSfx('error');
    this._workspace.shakeAll();

    const flash = new Graphics();
    flash.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
    flash.fill({ color: COLORS.FAILURE, alpha: 0.12 });
    this.addChild(flash);

    const toast = new Toast({ message, color: COLORS.ACCENT, duration: 1500 });
    this.addChild(toast);

    setTimeout(() => {
      if (flash.parent) { this.removeChild(flash); flash.destroy(); }
    }, 300);
  }

  _onTimeUp() {
    if (this._gameOver) return;
    this._gameOver = true;
    this._timer.stop();
    const loc = Localization.getInstance();
    AudioManager.getInstance().playSfx('timeout');

    const toast = new Toast({ message: loc.get('feedback.time_up'), color: COLORS.ACCENT, duration: 2000 });
    this.addChild(toast);

    setTimeout(() => this._showTimeUpOverlay(), 2000);
  }

  _showTimeUpOverlay() {
    const loc = Localization.getInstance();
    const overlay = new Graphics();
    overlay.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
    overlay.fill({ color: COLORS.OVERLAY, alpha: 0.7 });
    overlay.eventMode = 'static';
    this.addChild(overlay);

    const title = new Text({
      text: loc.get('feedback.time_up'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.TITLE_SIZE, fontWeight: 'bold', fill: COLORS.ACCENT }
    });
    title.anchor.set(0.5);
    title.position.set(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 - 60);
    this.addChild(title);

    const retryBtn = new Button({
      label: loc.get('level_complete.replay'),
      width: 240,
      height: 56,
      color: COLORS.BUTTON_BLUE,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.GAMEPLAY, { chapterId: this._chapterId, levelNumber: this._levelNumber })
    });
    retryBtn.position.set(DESIGN_WIDTH / 2 - 250, DESIGN_HEIGHT / 2 + 10);
    this.addChild(retryBtn);

    const menuBtn = new Button({
      label: loc.get('level_complete.back_to_menu'),
      width: 240,
      height: 56,
      color: COLORS.BUTTON_GRAY,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: this._chapterId })
    });
    menuBtn.position.set(DESIGN_WIDTH / 2 + 10, DESIGN_HEIGHT / 2 + 10);
    this.addChild(menuBtn);
  }

  update(dt) {
    if (this._timer && !this._gameOver) {
      this._timer.update(dt);
      if (this._timer.isExpired) this._onTimeUp();
    }
  }
}
