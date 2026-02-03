import { Text, Graphics, Container, Sprite } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { ProgressData } from '../data/ProgressData.js';
import { AssetLoader } from '../core/AssetLoader.js';
import { AudioManager } from '../core/AudioManager.js';
import { Button } from '../ui/Button.js';
import { StarDisplay } from '../ui/StarDisplay.js';
import { Panel } from '../ui/Panel.js';
import { ParticleEffect } from '../gameplay/ParticleEffect.js';
import { ConfettiEffect } from '../gameplay/ConfettiEffect.js';
import { ExperimentAnimator } from '../gameplay/ExperimentAnimator.js';
import { ExperimentScoringEngine } from '../gameplay/ExperimentScoringEngine.js';
import { createTeacher, createSpeechBubble } from '../graphics/TeacherGraphics.js';
import { createAtomVisual } from '../graphics/AtomGraphics.js';
import { drawExperimentBackground } from '../graphics/BackgroundGraphics.js';
import { tween, popIn, sineFloat, easeOutBack, easeLinear, easeInOutCubic } from '../utils/animate.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

export class ExperimentScene extends Scene {
  constructor() {
    super();
    this._chapterId = null;
    this._levelNumber = null;
    this._experiment = null;
    this._selectedOption = -1;
    this._phase = 'intro';
    this._animator = null;
    this._stopFloats = [];
    this._timers = [];
  }

  onEnter(params) {
    super.onEnter();
    this._chapterId = params.chapterId;
    this._levelNumber = params.levelNumber;

    const gameData = GameData.getInstance();
    const config = gameData.getExperimentLevelConfig(this._chapterId, this._levelNumber);
    this._experiment = config ? config.experiment : null;

    if (!this._experiment) {
      SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: this._chapterId });
      return;
    }

    this._selectedOption = -1;
    this._phase = 'intro';
    this._stopFloats = [];
    this._timers = [];
    this._isReplay = ProgressData.getInstance().getLevelProgress(this._chapterId, this._levelNumber) !== null;
    this._buildIntroPhase();
  }

  onExit() {
    super.onExit();
    for (const stop of this._stopFloats) stop();
    this._stopFloats = [];
    for (const id of this._timers) clearTimeout(id);
    this._timers = [];
    if (this._typeInterval) { clearInterval(this._typeInterval); this._typeInterval = null; }
    if (this._animator) {
      this._animator.destroy();
      this._animator = null;
    }
  }

  onResize() {
    if (!this._experiment) return;
    this.removeChildren();
    if (this._phase === 'intro') this._buildIntroPhase();
    else if (this._phase === 'result') this._buildResultPhase(this._lastScoring);
  }

  _buildIntroPhase() {
    this.removeChildren();
    for (const stop of this._stopFloats) stop();
    this._stopFloats = [];

    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const exp = this._experiment;
    const W = this.screenWidth;

    drawExperimentBackground(this);

    // Layout: teacher on left, content on right
    const leftColW = Math.min(280, W * 0.3);
    const rightColX = leftColW + 20;
    const rightColW = W - rightColX - 20;

    // Back button
    const backBtn = new Button({
      label: loc.get('common.back'),
      width: 100,
      height: 36,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.SMALL_SIZE,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: this._chapterId })
    });
    backBtn.position.set(12, 12);
    this.addChild(backBtn);

    // Title
    const title = new Text({
      text: `${loc.get('experiment.title')} ${exp.level_number}: ${loc.t(exp.title_sr)}`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    title.anchor.set(0.5, 0);
    title.position.set(W / 2, 14);
    this.addChild(title);

    // Danger banner - prominent, persistent warning
    if (exp.danger_level >= 2) {
      const dangerKey = exp.danger_level >= 3 ? 'experiment.danger_warning' : 'experiment.danger_caution';
      const dangerColor = exp.danger_level >= 3 ? COLORS.ACCENT : COLORS.WARNING;
      const bannerH = 36;
      const dangerBg = new Graphics();
      dangerBg.roundRect(0, 0, W - 20, bannerH, 8);
      dangerBg.fill({ color: dangerColor, alpha: 0.85 });
      dangerBg.roundRect(0, 0, W - 20, bannerH, 8);
      dangerBg.stroke({ color: 0xffffff, alpha: 0.3, width: 1.5 });
      dangerBg.position.set(10, 52);
      this.addChild(dangerBg);

      const dangerText = new Text({
        text: loc.get(dangerKey),
        style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
      });
      dangerText.anchor.set(0.5, 0.5);
      dangerText.position.set(W / 2, 52 + bannerH / 2);
      this.addChild(dangerText);
    }

    // Teacher character (bottom-left)
    const teacher = createTeacher(1.1);
    const teacherX = Math.min(80, leftColW / 2);
    teacher.position.set(teacherX, DESIGN_HEIGHT - 90);
    this.addChild(teacher);
    this._stopFloats.push(sineFloat(teacher, 'y', 3, 1.5));

    // Speech bubble with teacher_before_sr
    const bubbleW = Math.min(240, leftColW - 10);
    const bubble = createSpeechBubble(loc.t(exp.teacher_before_sr), bubbleW);
    bubble.position.set(Math.max(8, teacherX - 50), DESIGN_HEIGHT - 300);
    this.addChild(bubble);

    // Reactant visuals
    const reactantY = 100;
    const reactantSpacing = Math.min(120, rightColW / (exp.reactants.length + 1));
    const reactantStartX = rightColX + (rightColW - reactantSpacing * (exp.reactants.length - 1)) / 2;

    for (let i = 0; i < exp.reactants.length; i++) {
      const r = exp.reactants[i];
      const rx = reactantStartX + i * reactantSpacing;

      // Use first element_id to get color for atom visual
      const elId = r.element_ids[0];
      const element = gameData.getElement(elId);
      const color = element ? parseInt(String(element.color).replace('#', ''), 16) : COLORS.PRIMARY;

      const atom = createAtomVisual(r.formula, color, 28, true, element);
      atom.position.set(rx, reactantY);
      this.addChild(atom);

      const label = new Text({
        text: loc.t(r.name_sr),
        style: { fontFamily: FONT.FAMILY, fontSize: 12, fill: COLORS.TEXT_LIGHT }
      });
      label.anchor.set(0.5, 0);
      label.position.set(rx, reactantY + 38);
      this.addChild(label);

      // Plus sign between reactants
      if (i < exp.reactants.length - 1) {
        const plus = new Text({
          text: '+',
          style: { fontFamily: FONT.FAMILY, fontSize: 24, fontWeight: 'bold', fill: COLORS.TEXT_DIM }
        });
        plus.anchor.set(0.5);
        plus.position.set(rx + reactantSpacing / 2, reactantY);
        this.addChild(plus);
      }
    }

    // Prediction question
    const questionY = 180;
    const qText = new Text({
      text: loc.get('experiment.predict_question'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold', fill: COLORS.PRIMARY_LIGHT }
    });
    qText.anchor.set(0.5, 0);
    qText.position.set(rightColX + rightColW / 2, questionY);
    this.addChild(qText);

    // Prediction options (4 buttons)
    const optionW = Math.min(380, rightColW - 20);
    this._optionW = optionW;
    const optionH = 44;
    const optionGap = 8;
    const optionStartY = questionY + 36;
    const optionX = rightColX + (rightColW - optionW) / 2;

    this._optionButtons = [];
    for (let i = 0; i < exp.prediction_options.length; i++) {
      const opt = exp.prediction_options[i];
      const oy = optionStartY + i * (optionH + optionGap);

      const optBg = new Graphics();
      optBg.roundRect(0, 0, optionW, optionH, 10);
      optBg.fill({ color: COLORS.BG_PANEL, alpha: 0.9 });
      optBg.roundRect(0, 0, optionW, optionH, 10);
      optBg.stroke({ color: COLORS.PRIMARY, alpha: 0.2, width: 1.5 });
      optBg.position.set(optionX, oy);
      optBg.eventMode = 'static';
      optBg.cursor = 'pointer';
      this.addChild(optBg);

      const optText = new Text({
        text: loc.t(opt.text_sr),
        style: { fontFamily: FONT.FAMILY, fontSize: 13, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: optionW - 40 }
      });
      optText.position.set(32, optionH / 2);
      optText.anchor.set(0, 0.5);
      optBg.addChild(optText);

      // Radio indicator
      const radio = new Graphics();
      radio.circle(14, optionH / 2, 8);
      radio.stroke({ color: COLORS.PRIMARY, alpha: 0.5, width: 1.5 });
      optBg.addChild(radio);

      const optData = { bg: optBg, text: optText, radio, index: i };
      this._optionButtons.push(optData);

      optBg.on('pointerup', () => {
        this._selectedOption = i;
        this._updateOptionHighlights();
      });
    }

    // Submit button
    const submitBtn = new Button({
      label: loc.get('experiment.predict_button'),
      width: Math.min(200, optionW),
      height: 50,
      color: COLORS.BUTTON_GREEN,
      fontSize: FONT.BUTTON_SIZE,
      onClick: () => this._onPredict()
    });
    submitBtn.position.set(rightColX + (rightColW - Math.min(200, optionW)) / 2,
      optionStartY + exp.prediction_options.length * (optionH + optionGap) + 10);
    this.addChild(submitBtn);
    this._submitBtn = submitBtn;
    submitBtn.disabled = true;
  }

  _updateOptionHighlights() {
    const w = this._optionW || 380;
    for (const opt of this._optionButtons) {
      const selected = opt.index === this._selectedOption;
      opt.bg.clear();
      opt.bg.roundRect(0, 0, w, 44, 10);
      opt.bg.fill({ color: selected ? 0x1a3a5e : COLORS.BG_PANEL, alpha: 0.9 });
      opt.bg.roundRect(0, 0, w, 44, 10);
      opt.bg.stroke({ color: COLORS.PRIMARY, alpha: selected ? 0.8 : 0.2, width: selected ? 2 : 1.5 });

      // Redraw radio with fill if selected
      opt.radio.clear();
      opt.radio.circle(14, 22, 8);
      opt.radio.stroke({ color: COLORS.PRIMARY, alpha: 0.5, width: 1.5 });
      if (selected) {
        opt.radio.circle(14, 22, 5);
        opt.radio.fill({ color: COLORS.PRIMARY });
      }
    }
    if (this._submitBtn) this._submitBtn.disabled = false;
  }

  _onPredict() {
    if (this._selectedOption < 0) return;

    const exp = this._experiment;
    const predictionCorrect = exp.prediction_options[this._selectedOption].correct;
    const scoring = ExperimentScoringEngine.calculate(exp, predictionCorrect, this._isReplay);
    this._lastScoring = scoring;

    this._phase = 'animation';
    this._buildAnimationPhase(scoring);
  }

  _buildAnimationPhase(scoring) {
    this.removeChildren();
    for (const stop of this._stopFloats) stop();
    this._stopFloats = [];

    const loc = Localization.getInstance();
    const exp = this._experiment;
    const W = this.screenWidth;

    drawExperimentBackground(this);

    // "Watch" title
    const watchTitle = new Text({
      text: loc.get('experiment.watch_title'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    watchTitle.anchor.set(0.5, 0);
    watchTitle.position.set(W / 2, 20);
    this.addChild(watchTitle);

    // Animation container (centered)
    const animContainer = new Container();
    animContainer.position.set(0, 0);
    this.addChild(animContainer);

    const cx = W / 2;
    const cy = DESIGN_HEIGHT / 2;

    // Run the animation
    this._animator = new ExperimentAnimator(animContainer, exp.animation_config, cx, cy);
    this._animator.play(exp.animation_type).then(() => {
      // Equation typing in
      this._showEquation(exp, W, scoring);
    });
  }

  _showEquation(exp, W, scoring) {
    const loc = Localization.getInstance();

    const eqLabel = new Text({
      text: loc.get('experiment.equation_label'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_DIM }
    });
    eqLabel.anchor.set(0.5, 0);
    eqLabel.position.set(W / 2, DESIGN_HEIGHT - 120);
    this.addChild(eqLabel);

    const eqText = new Text({
      text: '',
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold', fill: COLORS.PRIMARY_LIGHT }
    });
    eqText.anchor.set(0.5, 0);
    eqText.position.set(W / 2, DESIGN_HEIGHT - 96);
    this.addChild(eqText);

    // Type out the equation
    const fullEq = exp.equation_sr;
    let charIndex = 0;
    this._typeInterval = setInterval(() => {
      if (this.destroyed || !this._active) { clearInterval(this._typeInterval); this._typeInterval = null; return; }
      charIndex++;
      eqText.text = fullEq.substring(0, charIndex);
      if (charIndex >= fullEq.length) {
        clearInterval(this._typeInterval);
        this._typeInterval = null;
        // Transition to result after short delay
        const tid = setTimeout(() => {
          if (this._active && !this.destroyed) {
            this._phase = 'result';
            this._buildResultPhase(scoring);
          }
        }, 1200);
        this._timers.push(tid);
      }
    }, 50);
  }

  _buildResultPhase(scoring) {
    this.removeChildren();
    for (const stop of this._stopFloats) stop();
    this._stopFloats = [];
    if (this._animator) {
      this._animator.destroy();
      this._animator = null;
    }

    const loc = Localization.getInstance();
    const gameData = GameData.getInstance();
    const progress = ProgressData.getInstance();
    const exp = this._experiment;
    const W = this.screenWidth;
    const predictionCorrect = scoring.predictionCorrect;

    // Save progress
    const coinsEarned = progress.saveLevelResult(this._chapterId, this._levelNumber, scoring.stars, scoring.totalScore);

    drawExperimentBackground(this);

    // Layout
    const leftColW = Math.min(280, W * 0.3);
    const rightColX = leftColW + 20;
    const rightColW = W - rightColX - 20;

    // Teacher character
    const teacher = createTeacher(1.2);
    const teacherX = Math.min(85, leftColW / 2);
    teacher.position.set(teacherX, DESIGN_HEIGHT + 100);
    this.addChild(teacher);

    const teacherTargetY = DESIGN_HEIGHT - 95;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(teacher, { y: teacherTargetY }, 600, { ease: easeOutBack }).then(() => {
        if (!this.destroyed && !teacher.destroyed) {
          this._stopFloats.push(sineFloat(teacher, 'y', 3, 1.5));
        }
      });
    }, 200);

    // Speech bubble with teacher_after_sr
    const bubbleW = Math.min(240, leftColW - 10);
    const bubble = createSpeechBubble(loc.t(exp.teacher_after_sr), bubbleW);
    bubble.position.set(Math.max(8, teacherX - 50), DESIGN_HEIGHT - 310);
    bubble.alpha = 0;
    bubble.scale.set(0);
    this.addChild(bubble);

    setTimeout(() => {
      if (this.destroyed) return;
      popIn(bubble, 400);
    }, 600);

    // Stars
    const starDisplay = new StarDisplay({ count: scoring.stars, total: 3, size: 32, gap: 12 });
    const starWidth = 3 * (32 * 2 + 12) - 12;
    starDisplay.position.set(W / 2 - starWidth / 2, 20);
    this.addChild(starDisplay);
    setTimeout(() => {
      if (this.destroyed) return;
      starDisplay.animateIn();
      if (scoring.stars >= 2) {
        this.addChild(new ParticleEffect({ x: W / 2, y: 55, color: COLORS.GOLD, count: 20 }));
      }
    }, 500);

    // Danger banner in result phase for dangerous experiments
    if (exp.danger_level >= 3) {
      const dangerBg = new Graphics();
      dangerBg.roundRect(0, 0, rightColW, 28, 6);
      dangerBg.fill({ color: COLORS.ACCENT, alpha: 0.8 });
      dangerBg.position.set(rightColX, 52);
      this.addChild(dangerBg);

      const dangerText = new Text({
        text: loc.get('experiment.danger_warning'),
        style: { fontFamily: FONT.FAMILY, fontSize: 14, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
      });
      dangerText.anchor.set(0.5, 0.5);
      dangerText.position.set(rightColX + rightColW / 2, 66);
      this.addChild(dangerText);
    }

    // Result banner (correct / incorrect)
    const resultText = new Text({
      text: predictionCorrect ? loc.get('experiment.result_correct') : loc.get('experiment.result_incorrect'),
      style: {
        fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold',
        fill: predictionCorrect ? COLORS.SECONDARY : COLORS.WARNING
      }
    });
    resultText.anchor.set(0.5, 0);
    resultText.position.set(rightColX + rightColW / 2, 70);
    this.addChild(resultText);

    // Confetti for correct prediction
    if (predictionCorrect) {
      setTimeout(() => {
        if (this.destroyed) return;
        this.addChild(new ConfettiEffect({ x: W / 2, y: 0, width: W, count: 50, duration: 3500 }));
      }, 300);
    }

    // Products display
    const productsY = 100;
    const prodLabel = new Text({
      text: loc.get('experiment.products_label'),
      style: { fontFamily: FONT.FAMILY, fontSize: 13, fill: COLORS.TEXT_DIM }
    });
    prodLabel.position.set(rightColX, productsY);
    this.addChild(prodLabel);

    let prodX = rightColX;
    for (const p of exp.products) {
      const prodText = new Text({
        text: `${p.formula} (${loc.t(p.name_sr)})`,
        style: { fontFamily: FONT.FAMILY, fontSize: 14, fill: COLORS.PRIMARY_LIGHT }
      });
      prodText.position.set(prodX, productsY + 20);
      this.addChild(prodText);
      prodX += prodText.width + 20;
    }

    // Equation
    const eqY = productsY + 50;
    const eqLabel = new Text({
      text: loc.get('experiment.equation_label'),
      style: { fontFamily: FONT.FAMILY, fontSize: 13, fill: COLORS.TEXT_DIM }
    });
    eqLabel.position.set(rightColX, eqY);
    this.addChild(eqLabel);

    const eqText = new Text({
      text: exp.equation_sr,
      style: { fontFamily: FONT.FAMILY, fontSize: 18, fontWeight: 'bold', fill: COLORS.PRIMARY_LIGHT }
    });
    eqText.position.set(rightColX, eqY + 20);
    this.addChild(eqText);

    // Experiment photo
    const assetLoader = AssetLoader.getInstance();
    const texture = assetLoader.getExperimentTexture(exp.id);
    if (texture) {
      const photoContainer = new Container();
      const photoW = Math.min(150, rightColW * 0.4);
      const photoH = 110;
      photoContainer.position.set(rightColX + rightColW - photoW - 5, productsY - 10);
      this.addChild(photoContainer);

      const photoBg = new Graphics();
      photoBg.roundRect(0, 0, photoW, photoH, 8);
      photoBg.fill({ color: 0x0a0a1a, alpha: 0.8 });
      photoBg.roundRect(0, 0, photoW, photoH, 8);
      photoBg.stroke({ color: COLORS.SECONDARY, alpha: 0.3, width: 1 });
      photoContainer.addChild(photoBg);

      const photo = new Sprite(texture);
      const maxDim = Math.min(photoW - 16, photoH - 24);
      const scale = Math.min(maxDim / texture.width, maxDim / texture.height);
      photo.width = texture.width * scale;
      photo.height = texture.height * scale;
      photo.position.set(photoW / 2 - photo.width / 2, 12 + (photoH - 24 - photo.height) / 2);
      photoContainer.addChild(photo);

      photoContainer.alpha = 0;
      photoContainer.scale.set(0);
      setTimeout(() => {
        if (this.destroyed) return;
        popIn(photoContainer, 400);
      }, 800);
    }

    // Score panel
    const spW = Math.min(280, rightColW);
    const spH = 90;
    const spX = rightColX;
    const spY = eqY + 55;

    const scorePanel = new Graphics();
    scorePanel.roundRect(0, 0, spW, spH, 12);
    scorePanel.fill({ color: COLORS.BG_PANEL, alpha: 0.9 });
    scorePanel.roundRect(0, 0, spW, spH, 12);
    scorePanel.stroke({ color: COLORS.GOLD, alpha: 0.2, width: 1.5 });
    scorePanel.position.set(spX, spY);
    this.addChild(scorePanel);

    let rowY = 8;
    this._scoreRow(scorePanel, loc.get('gameplay.score'), `${scoring.basePoints}`, COLORS.TEXT_WHITE, rowY, spW);
    rowY += 22;
    if (scoring.predictionBonus > 0) {
      this._scoreRow(scorePanel, loc.get('experiment.prediction_bonus'), `+${scoring.predictionBonus}`, COLORS.SECONDARY, rowY, spW);
      rowY += 22;
    }
    const div = new Graphics();
    div.rect(12, rowY, spW - 24, 1);
    div.fill({ color: COLORS.TEXT_DIM, alpha: 0.3 });
    scorePanel.addChild(div);
    rowY += 8;
    this._scoreRow(scorePanel, loc.get('level_complete.total_score'), `${scoring.totalScore}`, COLORS.GOLD, rowY, spW, true);

    scorePanel.x = W + 50;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(scorePanel, { x: spX }, 500, { ease: easeOutBack });
    }, 400);

    // Fun fact panel
    const factW = Math.min(280, rightColW);
    const factBg = new Graphics();
    factBg.roundRect(0, 0, factW, 70, 10);
    factBg.fill({ color: 0x1a2a1a, alpha: 0.9 });
    factBg.roundRect(0, 0, factW, 70, 10);
    factBg.stroke({ color: COLORS.SECONDARY, alpha: 0.3, width: 1 });
    factBg.position.set(rightColX, DESIGN_HEIGHT - 170);
    this.addChild(factBg);

    const factLabel = new Text({
      text: loc.get('experiment.fun_fact'),
      style: { fontFamily: FONT.FAMILY, fontSize: 12, fontWeight: 'bold', fill: COLORS.SECONDARY }
    });
    factLabel.position.set(10, 6);
    factBg.addChild(factLabel);

    const factText = new Text({
      text: loc.t(exp.fun_fact_sr),
      style: { fontFamily: FONT.FAMILY, fontSize: 11, fill: COLORS.TEXT_LIGHT, wordWrap: true, wordWrapWidth: factW - 20, lineHeight: 14 }
    });
    factText.position.set(10, 24);
    factBg.addChild(factText);

    factBg.alpha = 0;
    setTimeout(() => {
      if (this.destroyed) return;
      tween(factBg, { alpha: 1 }, 400, { ease: easeLinear });
    }, 1000);

    // Navigation buttons (right-aligned)
    const chapter = gameData.getChapter(this._chapterId);
    const nextLevel = chapter ? chapter.levels.find(l => l.level_number === this._levelNumber + 1) : null;
    const hasNext = nextLevel && progress.isLevelUnlocked(this._chapterId, this._levelNumber + 1);

    const btnW = Math.min(200, rightColW - 10);
    let btnX = W - btnW - 20;
    let btnY = DESIGN_HEIGHT - 160;

    if (hasNext) {
      const nextBtn = new Button({
        label: loc.get('experiment.next_experiment'),
        width: btnW,
        height: 48,
        color: COLORS.BUTTON_GREEN,
        fontSize: 16,
        onClick: () => SceneManager.getInstance().switchTo(SCENES.EXPERIMENT, {
          chapterId: this._chapterId,
          levelNumber: this._levelNumber + 1
        })
      });
      nextBtn.position.set(btnX, btnY);
      this.addChild(nextBtn);
      nextBtn.scale.set(0);
      nextBtn.alpha = 0;
      setTimeout(() => {
        if (this.destroyed) return;
        popIn(nextBtn, 400);
      }, 900);
      btnY += 56;
    }

    const replayBtn = new Button({
      label: loc.get('experiment.replay'),
      width: btnW,
      height: 42,
      color: COLORS.BUTTON_BLUE,
      fontSize: 15,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.EXPERIMENT, {
        chapterId: this._chapterId,
        levelNumber: this._levelNumber
      })
    });
    replayBtn.position.set(btnX, btnY);
    this.addChild(replayBtn);
    btnY += 50;

    const menuBtn = new Button({
      label: loc.get('experiment.back_to_chapter'),
      width: btnW,
      height: 42,
      color: COLORS.BUTTON_GRAY,
      fontSize: 15,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT, { chapter: this._chapterId })
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
