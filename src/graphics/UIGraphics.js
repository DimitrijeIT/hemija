import { Graphics } from 'pixi.js';
import { COLORS } from '../core/Constants.js';

export function drawStar(g, cx, cy, size, filled = true) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 2 * 3) + (i * Math.PI / 5);
    const r = i % 2 === 0 ? size : size * 0.45;
    points.push(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  g.poly(points);
  if (filled) {
    g.fill({ color: COLORS.GOLD });
  } else {
    g.fill({ color: COLORS.STAR_EMPTY });
  }
}

export function drawDashedRect(g, x, y, w, h, color = COLORS.TEXT_DIM) {
  g.rect(x, y, w, h);
  g.stroke({ color, alpha: 0.4, width: 2 });
}

export function drawRoundedButton(g, x, y, w, h, color, radius = 16) {
  g.roundRect(x, y, w, h, radius);
  g.fill({ color });
  g.roundRect(x, y, w, h, radius);
  g.stroke({ color: 0xffffff, alpha: 0.15, width: 2 });
}
