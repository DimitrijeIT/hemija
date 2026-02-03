import { Graphics, Text } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { AssetLoader } from '../core/AssetLoader.js';
import { Localization } from '../core/Localization.js';
import { GameData } from '../data/GameData.js';
import { SaveManager } from '../core/SaveManager.js';
import { SceneManager } from '../core/SceneManager.js';
import { COLORS, FONT, SCENES, DESIGN_HEIGHT } from '../core/Constants.js';

export class SplashScene extends Scene {
  constructor() {
    super();
    this._progressBar = null;
    this._progressFill = null;
    this._statusText = null;
  }

  onEnter() {
    super.onEnter();
    const W = this.screenWidth;
    const H = DESIGN_HEIGHT;

    const bg = new Graphics();
    bg.rect(0, 0, W, H);
    bg.fill({ color: COLORS.BG_DARK });
    this.addChild(bg);

    const title = new Text({
      text: 'HemiLab',
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: 56,
        fontWeight: 'bold',
        fill: COLORS.PRIMARY_LIGHT,
        align: 'center'
      }
    });
    title.anchor.set(0.5);
    title.position.set(W / 2, H / 2 - 80);
    this.addChild(title);

    const tagline = new Text({
      text: '\u041E\u0442\u043A\u0440\u043E\u0458 \u0441\u0432\u0435\u0442 \u0445\u0435\u043C\u0438\u0458\u0435!',
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.BODY_SIZE,
        fill: COLORS.TEXT_LIGHT,
        align: 'center'
      }
    });
    tagline.anchor.set(0.5);
    tagline.position.set(W / 2, H / 2 - 25);
    this.addChild(tagline);

    const barWidth = 360;
    const barHeight = 16;
    const barX = (W - barWidth) / 2;
    const barY = H / 2 + 30;

    this._progressBar = new Graphics();
    this._progressBar.roundRect(barX, barY, barWidth, barHeight, 8);
    this._progressBar.fill({ color: 0x222255 });
    this.addChild(this._progressBar);

    this._progressFill = new Graphics();
    this._progressFill.position.set(barX, barY);
    this.addChild(this._progressFill);

    this._statusText = new Text({
      text: '\u0423\u0447\u0438\u0442\u0430\u0432\u0430\u045A\u0435...',
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.SMALL_SIZE,
        fill: COLORS.TEXT_DIM,
        align: 'center'
      }
    });
    this._statusText.anchor.set(0.5);
    this._statusText.position.set(W / 2, barY + 35);
    this.addChild(this._statusText);

    this._loadAssets(barWidth, barHeight);
  }

  async _loadAssets(barWidth, barHeight) {
    const loader = AssetLoader.getInstance();

    await loader.loadAll((progress) => {
      this._drawProgress(progress, barWidth, barHeight);
    });

    const save = SaveManager.getInstance();
    save.load();

    const loc = Localization.getInstance();
    loc.init(loader.get('strings_sr'), loader.get('strings_sr_cyr'));

    const gameData = GameData.getInstance();
    gameData.init(loader.get('elements'), loader.get('molecules'), loader.get('chapters'), loader.get('experiments'));

    this._drawProgress(1, barWidth, barHeight);
    this._statusText.text = loc.get('common.loading');

    await new Promise(r => setTimeout(r, 400));
    SceneManager.getInstance().switchTo(SCENES.MENU);
  }

  _drawProgress(progress, barWidth, barHeight) {
    this._progressFill.clear();
    if (progress > 0) {
      this._progressFill.roundRect(0, 0, barWidth * progress, barHeight, 8);
      this._progressFill.fill({ color: COLORS.PRIMARY });
    }
  }
}
