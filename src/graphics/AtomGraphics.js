import { Graphics, Text, Container } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';

export function createAtomVisual(symbol, colorHex, radius = 32, animate = true) {
  const container = new Container();
  const color = typeof colorHex === 'string' ? parseInt(colorHex.replace('#', ''), 16) : colorHex;

  // Outer glow
  const glow = new Graphics();
  glow.circle(0, 0, radius * 1.4);
  glow.fill({ color, alpha: 0.08 });
  container.addChild(glow);

  // Base circle with gradient-like layers
  const shadowCircle = new Graphics();
  shadowCircle.circle(2, 2, radius);
  shadowCircle.fill({ color: 0x000000, alpha: 0.3 });
  container.addChild(shadowCircle);

  const baseCircle = new Graphics();
  baseCircle.circle(0, 0, radius);
  baseCircle.fill({ color });
  container.addChild(baseCircle);

  // Inner lighter circle
  const innerCircle = new Graphics();
  innerCircle.circle(-radius * 0.1, -radius * 0.1, radius * 0.75);
  innerCircle.fill({ color: lightenColor(color, 30), alpha: 0.4 });
  container.addChild(innerCircle);

  // Specular highlight
  const highlight = new Graphics();
  highlight.circle(-radius * 0.25, -radius * 0.3, radius * 0.35);
  highlight.fill({ color: 0xffffff, alpha: 0.4 });
  container.addChild(highlight);

  // Small bright spot
  const brightSpot = new Graphics();
  brightSpot.circle(-radius * 0.3, -radius * 0.35, radius * 0.12);
  brightSpot.fill({ color: 0xffffff, alpha: 0.6 });
  container.addChild(brightSpot);

  // Ring/outline
  const ring = new Graphics();
  ring.circle(0, 0, radius);
  ring.stroke({ color: lightenColor(color, 50), alpha: 0.5, width: 1.5 });
  container.addChild(ring);

  // Symbol text with shadow
  const textShadow = new Text({
    text: symbol,
    style: {
      fontFamily: FONT.FAMILY,
      fontSize: radius * 1.0,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center'
    }
  });
  textShadow.anchor.set(0.5);
  textShadow.position.set(1, 1);
  textShadow.alpha = 0.4;
  container.addChild(textShadow);

  const text = new Text({
    text: symbol,
    style: {
      fontFamily: FONT.FAMILY,
      fontSize: radius * 1.0,
      fontWeight: 'bold',
      fill: COLORS.TEXT_WHITE,
      align: 'center'
    }
  });
  text.anchor.set(0.5);
  container.addChild(text);

  // Electron orbits (animated)
  if (animate && radius >= 28) {
    const electronLayer = new Container();
    container.addChild(electronLayer);
    const orbitCount = symbol.length === 1 ? 2 : 1;

    for (let o = 0; o < orbitCount; o++) {
      const orbitR = radius * (1.2 + o * 0.3);
      const orbitAngleOffset = o * Math.PI / orbitCount;
      const speed = (1.5 + o * 0.8) * (o % 2 === 0 ? 1 : -1);
      const tiltY = 0.3 + o * 0.25;

      // Orbit path (ellipse)
      const orbitPath = new Graphics();
      orbitPath.ellipse(0, 0, orbitR, orbitR * tiltY);
      orbitPath.stroke({ color, alpha: 0.15, width: 1 });
      orbitPath.rotation = orbitAngleOffset;
      electronLayer.addChild(orbitPath);

      // Electron dot
      const electron = new Graphics();
      electron.circle(0, 0, 3);
      electron.fill({ color: 0xffffff });
      electron.circle(0, 0, 5);
      electron.fill({ color: 0xffffff, alpha: 0.3 });
      electronLayer.addChild(electron);

      // Animate
      const startTime = Date.now() + o * 500;
      const animateElectron = () => {
        if (container.destroyed) return;
        const t = (Date.now() - startTime) / 1000 * speed;
        const x = Math.cos(t) * orbitR;
        const y = Math.sin(t) * orbitR * tiltY;
        // Apply orbit rotation
        const cos = Math.cos(orbitAngleOffset);
        const sin = Math.sin(orbitAngleOffset);
        electron.position.set(x * cos - y * sin, x * sin + y * cos);
        requestAnimationFrame(animateElectron);
      };
      animateElectron();
    }
  }

  // Pulsing glow animation
  if (animate) {
    const startTime = Date.now() + Math.random() * 3000;
    const animateGlow = () => {
      if (container.destroyed) return;
      const t = (Date.now() - startTime) / 1000;
      glow.alpha = 0.5 + 0.3 * Math.sin(t * 2);
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  return container;
}

export function createAtomVisualStatic(symbol, colorHex, radius = 32) {
  return createAtomVisual(symbol, colorHex, radius, false);
}

function lightenColor(color, amount) {
  let r = (color >> 16) & 0xFF;
  let g = (color >> 8) & 0xFF;
  let b = color & 0xFF;
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return (r << 16) | (g << 8) | b;
}
