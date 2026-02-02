import { Text, Graphics, Container } from 'pixi.js';
import { Scene } from '../core/Scene.js';
import { SceneManager } from '../core/SceneManager.js';
import { Localization } from '../core/Localization.js';
import { ProgressData } from '../data/ProgressData.js';
import { Button } from '../ui/Button.js';
import { drawMenuBackground } from '../graphics/BackgroundGraphics.js';
import { COLORS, FONT, SCENES, DESIGN_WIDTH, DESIGN_HEIGHT } from '../core/Constants.js';

export class MenuScene extends Scene {
  onEnter() {
    super.onEnter();
    const loc = Localization.getInstance();
    const progress = ProgressData.getInstance();

    drawMenuBackground(this);

    // Left side: branding
    const title = new Text({
      text: loc.get('app.name'),
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: 64,
        fontWeight: 'bold',
        fill: COLORS.PRIMARY_LIGHT,
        align: 'center'
      }
    });
    title.anchor.set(0.5);
    title.position.set(400, 200);
    this.addChild(title);

    const tagline = new Text({
      text: loc.get('app.tagline'),
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: FONT.BODY_SIZE,
        fill: COLORS.TEXT_LIGHT,
        align: 'center'
      }
    });
    tagline.anchor.set(0.5);
    tagline.position.set(400, 260);
    this.addChild(tagline);

    // Flask icon decoration
    const flask = new Graphics();
    flask.roundRect(-25, -40, 50, 60, 8);
    flask.fill({ color: COLORS.PRIMARY, alpha: 0.3 });
    flask.roundRect(-16, -52, 32, 14, 4);
    flask.fill({ color: COLORS.PRIMARY, alpha: 0.5 });
    flask.circle(0, -15, 7);
    flask.fill({ color: COLORS.PRIMARY_LIGHT, alpha: 0.6 });
    flask.position.set(400, 130);
    this.addChild(flask);

    // Stats row
    const totalStars = progress.getTotalStars();
    const totalCoins = progress.getTotalCoins();

    const starText = new Text({
      text: `★ ${totalStars}`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.HEADING_SIZE, fill: COLORS.GOLD }
    });
    starText.anchor.set(0.5);
    starText.position.set(350, 320);
    this.addChild(starText);

    const coinText = new Text({
      text: `● ${totalCoins}`,
      style: { fontFamily: FONT.FAMILY, fontSize: FONT.BODY_SIZE, fill: COLORS.WARNING }
    });
    coinText.anchor.set(0.5);
    coinText.position.set(460, 325);
    this.addChild(coinText);

    // Right side: buttons (vertically stacked)
    const btnX = 830;
    const btnW = 300;
    const btnH = 64;
    const btnGap = 20;
    let btnY = 150;

    const playBtn = new Button({
      label: loc.get('main_menu.play'),
      width: btnW,
      height: btnH,
      color: COLORS.BUTTON_GREEN,
      fontSize: 28,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.CHAPTER_SELECT)
    });
    playBtn.position.set(btnX, btnY);
    this.addChild(playBtn);
    btnY += btnH + btnGap;

    const labBtn = new Button({
      label: loc.get('main_menu.laboratory'),
      width: btnW,
      height: btnH,
      color: COLORS.BUTTON_BLUE,
      fontSize: 28,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.LABORATORY)
    });
    labBtn.position.set(btnX, btnY);
    this.addChild(labBtn);
    btnY += btnH + btnGap;

    const settingsBtn = new Button({
      label: loc.get('main_menu.settings'),
      width: btnW,
      height: btnH,
      color: COLORS.BUTTON_GRAY,
      fontSize: 28,
      onClick: () => SceneManager.getInstance().switchTo(SCENES.SETTINGS)
    });
    settingsBtn.position.set(btnX, btnY);
    this.addChild(settingsBtn);
    btnY += btnH + btnGap;

    const aboutBtn = new Button({
      label: loc.get('main_menu.about'),
      width: btnW,
      height: btnH,
      color: COLORS.BUTTON_GRAY,
      fontSize: 28,
      onClick: () => {}
    });
    aboutBtn.position.set(btnX, btnY);
    this.addChild(aboutBtn);
  }
}
