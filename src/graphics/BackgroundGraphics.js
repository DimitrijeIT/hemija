import { Graphics } from 'pixi.js';
import { DESIGN_HEIGHT, COLORS } from '../core/Constants.js';
import { Game } from '../core/Game.js';

export function drawMenuBackground(container) {
  const W = Game.getInstance().screenWidth;
  const H = DESIGN_HEIGHT;
  const bg = new Graphics();
  bg.rect(0, 0, W, H);
  bg.fill({ color: COLORS.BG_MENU });

  bg.rect(0, 0, W, H * 0.4);
  bg.fill({ color: 0x0f1a3e, alpha: 0.4 });

  const bubbles = [
    { x: W * 0.08, y: 100, r: 50, a: 0.04 },
    { x: W * 0.86, y: 200, r: 60, a: 0.03 },
    { x: W * 0.50, y: 80, r: 30, a: 0.05 },
    { x: W * 0.16, y: 500, r: 40, a: 0.04 },
    { x: W * 0.70, y: 600, r: 35, a: 0.03 },
    { x: W * 0.94, y: 500, r: 45, a: 0.04 },
    { x: W * 0.31, y: 650, r: 25, a: 0.05 }
  ];

  for (const b of bubbles) {
    bg.circle(b.x, b.y, b.r);
    bg.fill({ color: COLORS.PRIMARY_LIGHT, alpha: b.a });
  }

  container.addChildAt(bg, 0);
  return bg;
}

export function drawGameplayBackground(container) {
  const W = Game.getInstance().screenWidth;
  const H = DESIGN_HEIGHT;
  const bg = new Graphics();
  bg.rect(0, 0, W, H);
  bg.fill({ color: COLORS.BG_GAMEPLAY });

  bg.rect(0, 0, W, 60);
  bg.fill({ color: 0x1a2a3a, alpha: 0.6 });

  const bubbles = [
    { x: 50, y: 200, r: 15, a: 0.03 },
    { x: W - 50, y: 400, r: 20, a: 0.04 },
    { x: W * 0.5, y: 680, r: 12, a: 0.03 },
    { x: W * 0.23, y: 600, r: 18, a: 0.03 }
  ];

  for (const b of bubbles) {
    bg.circle(b.x, b.y, b.r);
    bg.fill({ color: COLORS.PRIMARY_LIGHT, alpha: b.a });
  }

  container.addChildAt(bg, 0);
  return bg;
}

export function drawExperimentBackground(container) {
  const W = Game.getInstance().screenWidth;
  const H = DESIGN_HEIGHT;
  const bg = new Graphics();

  // Darker lab theme
  bg.rect(0, 0, W, H);
  bg.fill({ color: 0x0d1117 });

  // Subtle gradient overlay
  bg.rect(0, 0, W, H * 0.3);
  bg.fill({ color: 0x1a0a2e, alpha: 0.5 });

  // Header bar
  bg.rect(0, 0, W, 60);
  bg.fill({ color: 0x0a0e1a, alpha: 0.7 });

  // Beaker silhouette (left side)
  const beakerX = W * 0.06;
  const beakerY = H * 0.65;
  bg.moveTo(beakerX, beakerY);
  bg.lineTo(beakerX - 15, beakerY + 80);
  bg.lineTo(beakerX + 45, beakerY + 80);
  bg.lineTo(beakerX + 30, beakerY);
  bg.closePath();
  bg.fill({ color: 0x334466, alpha: 0.06 });

  // Flask silhouette (right side)
  const flaskX = W * 0.92;
  const flaskY = H * 0.55;
  bg.circle(flaskX, flaskY + 30, 25);
  bg.fill({ color: 0x334466, alpha: 0.05 });
  bg.rect(flaskX - 8, flaskY - 20, 16, 50);
  bg.fill({ color: 0x334466, alpha: 0.05 });

  // Subtle bubbles
  const bubbles = [
    { x: W * 0.12, y: 150, r: 12, a: 0.03 },
    { x: W * 0.88, y: 300, r: 18, a: 0.02 },
    { x: W * 0.5, y: 680, r: 10, a: 0.03 },
    { x: W * 0.3, y: 550, r: 14, a: 0.02 },
    { x: W * 0.75, y: 620, r: 8, a: 0.03 }
  ];

  for (const b of bubbles) {
    bg.circle(b.x, b.y, b.r);
    bg.fill({ color: 0x6644aa, alpha: b.a });
  }

  container.addChildAt(bg, 0);
  return bg;
}

export function drawLabBackground(container) {
  const W = Game.getInstance().screenWidth;
  const H = DESIGN_HEIGHT;
  const bg = new Graphics();
  bg.rect(0, 0, W, H);
  bg.fill({ color: COLORS.BG_DARK });

  bg.rect(0, 0, W, 60);
  bg.fill({ color: 0x0f1a3e, alpha: 0.5 });

  container.addChildAt(bg, 0);
  return bg;
}
