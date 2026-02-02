import { Text, Graphics, Container } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { SaveManager } from '../core/SaveManager.js';
import { Localization } from '../core/Localization.js';
import { ProgressData } from '../data/ProgressData.js';
import { Button } from '../ui/Button.js';
import { Panel } from '../ui/Panel.js';
import { drawMenuBackground } from '../graphics/BackgroundGraphics.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

export class SettingsScene extends Scene {
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
    const save = SaveManager.getInstance();
    const W = this.screenWidth;

    drawMenuBackground(this);

    const title = new Text({
      text: loc.get('settings.title'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.TITLE_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    title.anchor.set(0.5);
    title.position.set(W / 2, 35);
    this.addChild(title);

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

    // Center panel
    const panelW = Math.min(600, W - 100);
    const panelH = 500;
    const panel = new Panel({ width: panelW, height: panelH, color: COLORS.BG_PANEL });
    panel.position.set((W - panelW) / 2, 80);
    this.addChild(panel);

    let yPos = 30;

    // Sound toggle
    yPos = this._addToggle(panel, panelW, loc.get('settings.sound'), save.getSetting('sound'), (val) => {
      save.setSetting('sound', val);
      this._buildUI();
    }, yPos);

    // Music toggle
    yPos = this._addToggle(panel, panelW, loc.get('settings.music'), save.getSetting('music'), (val) => {
      save.setSetting('music', val);
      this._buildUI();
    }, yPos);

    // Script selector
    yPos += 10;
    const scriptLabel = new Text({
      text: loc.get('settings.script'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fontWeight: 'bold', fill: COLORS.TEXT_WHITE }
    });
    scriptLabel.position.set(30, yPos);
    panel.addChild(scriptLabel);
    yPos += 40;

    const currentScript = save.getSetting('script');
    const scriptBtnW = Math.min(220, (panelW - 90) / 2);

    const latinBtn = new Button({
      label: loc.get('settings.script_latin'),
      width: scriptBtnW,
      height: 44,
      color: currentScript === 'latin' ? COLORS.PRIMARY : COLORS.BUTTON_GRAY,
      fontSize: FONT.BODY_SIZE,
      onClick: () => { save.setSetting('script', 'latin'); this._buildUI(); }
    });
    latinBtn.position.set(30, yPos);
    panel.addChild(latinBtn);

    const cyrBtn = new Button({
      label: loc.get('settings.script_cyrillic'),
      width: scriptBtnW,
      height: 44,
      color: currentScript === 'cyrillic' ? COLORS.PRIMARY : COLORS.BUTTON_GRAY,
      fontSize: FONT.BODY_SIZE,
      onClick: () => { save.setSetting('script', 'cyrillic'); this._buildUI(); }
    });
    cyrBtn.position.set(30 + scriptBtnW + 30, yPos);
    panel.addChild(cyrBtn);

    yPos += 80;

    // Reset progress
    const resetBtn = new Button({
      label: loc.get('settings.reset_progress'),
      width: panelW - 60,
      height: 48,
      color: COLORS.BUTTON_RED,
      fontSize: FONT.BODY_SIZE,
      onClick: () => this._showResetConfirm()
    });
    resetBtn.position.set(30, yPos);
    panel.addChild(resetBtn);

    yPos += 70;

    const versionText = new Text({
      text: `${loc.get('settings.version')}: 1.0.0`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.SMALL_SIZE, fill: COLORS.TEXT_DIM }
    });
    versionText.position.set(30, yPos);
    panel.addChild(versionText);
  }

  _addToggle(parent, panelW, label, value, onChange, yPos) {
    const row = new Container();
    row.position.set(30, yPos);

    const text = new Text({
      text: label,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.TEXT_WHITE }
    });
    row.addChild(text);

    const toggleW = 72;
    const toggleH = 36;
    const toggle = new Graphics();
    toggle.roundRect(0, 0, toggleW, toggleH, toggleH / 2);
    toggle.fill({ color: value ? COLORS.SECONDARY : 0x444466 });
    toggle.circle(value ? toggleW - toggleH / 2 : toggleH / 2, toggleH / 2, toggleH / 2 - 3);
    toggle.fill({ color: COLORS.TEXT_WHITE });
    toggle.position.set(panelW - 130, -3);
    toggle.eventMode = 'static';
    toggle.cursor = 'pointer';
    toggle.on('pointerup', () => onChange(!value));
    row.addChild(toggle);

    parent.addChild(row);
    return yPos + 60;
  }

  _showResetConfirm() {
    const loc = Localization.getInstance();
    const W = this.screenWidth;
    const overlay = new Graphics();
    overlay.rect(0, 0, W, DESIGN_HEIGHT);
    overlay.fill({ color: COLORS.OVERLAY, alpha: 0.7 });
    overlay.eventMode = 'static';
    this.addChild(overlay);

    const dialogW = Math.min(460, W - 60);
    const dialog = new Panel({ width: dialogW, height: 220, color: 0x1a1a3e });
    dialog.position.set((W - dialogW) / 2, (DESIGN_HEIGHT - 220) / 2);
    this.addChild(dialog);

    const msg = new Text({
      text: loc.get('settings.reset_confirm'),
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.TEXT_WHITE, wordWrap: true, wordWrapWidth: dialogW - 60, align: 'center' }
    });
    msg.anchor.set(0.5, 0);
    msg.position.set(dialogW / 2, 30);
    dialog.addChild(msg);

    const yesBtn = new Button({
      label: loc.get('settings.reset_yes'),
      width: 180,
      height: 48,
      color: COLORS.BUTTON_RED,
      fontSize: FONT.BODY_SIZE,
      onClick: () => {
        ProgressData.getInstance().reset();
        this.removeChild(overlay);
        this.removeChild(dialog);
        this._buildUI();
      }
    });
    yesBtn.position.set(25, 140);
    dialog.addChild(yesBtn);

    const noBtn = new Button({
      label: loc.get('settings.reset_no'),
      width: 180,
      height: 48,
      color: COLORS.BUTTON_GRAY,
      fontSize: FONT.BODY_SIZE,
      onClick: () => {
        this.removeChild(overlay);
        this.removeChild(dialog);
      }
    });
    noBtn.position.set(dialogW - 205, 140);
    dialog.addChild(noBtn);
  }
}
