import { Graphics } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT, COLORS } from '../core/Constants.js';

export function drawMenuBackground(container) {
  const bg = new Graphics();
  bg.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  bg.fill({ color: COLORS.BG_MENU });

  // Subtle gradient overlay on top portion
  bg.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT * 0.4);
  bg.fill({ color: 0x0f1a3e, alpha: 0.4 });

  // Decorative bubbles
  const bubbles = [
    { x: 100, y: 100, r: 50, a: 0.04 },
    { x: 1100, y: 200, r: 60, a: 0.03 },
    { x: 640, y: 80, r: 30, a: 0.05 },
    { x: 200, y: 500, r: 40, a: 0.04 },
    { x: 900, y: 600, r: 35, a: 0.03 },
    { x: 1200, y: 500, r: 45, a: 0.04 },
    { x: 400, y: 650, r: 25, a: 0.05 }
  ];

  for (const b of bubbles) {
    bg.circle(b.x, b.y, b.r);
    bg.fill({ color: COLORS.PRIMARY_LIGHT, alpha: b.a });
  }

  container.addChildAt(bg, 0);
  return bg;
}

export function drawGameplayBackground(container) {
  const bg = new Graphics();
  bg.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  bg.fill({ color: COLORS.BG_GAMEPLAY });

  // Top bar area
  bg.rect(0, 0, DESIGN_WIDTH, 60);
  bg.fill({ color: 0x1a2a3a, alpha: 0.6 });

  // Subtle bubbles
  const bubbles = [
    { x: 50, y: 200, r: 15, a: 0.03 },
    { x: 1230, y: 400, r: 20, a: 0.04 },
    { x: 640, y: 680, r: 12, a: 0.03 },
    { x: 300, y: 600, r: 18, a: 0.03 }
  ];

  for (const b of bubbles) {
    bg.circle(b.x, b.y, b.r);
    bg.fill({ color: COLORS.PRIMARY_LIGHT, alpha: b.a });
  }

  container.addChildAt(bg, 0);
  return bg;
}

export function drawLabBackground(container) {
  const bg = new Graphics();
  bg.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  bg.fill({ color: COLORS.BG_DARK });

  // Subtle grid pattern hint
  bg.rect(0, 0, DESIGN_WIDTH, 60);
  bg.fill({ color: 0x0f1a3e, alpha: 0.5 });

  container.addChildAt(bg, 0);
  return bg;
}
