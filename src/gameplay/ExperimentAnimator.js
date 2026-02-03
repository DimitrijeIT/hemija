import { Container, Graphics } from 'pixi.js';
import { ParticleEffect } from './ParticleEffect.js';
import { tween, sineFloat, easeInOutCubic, easeLinear } from '../utils/animate.js';

function parseColor(colorStr) {
  if (typeof colorStr === 'number') return colorStr;
  return parseInt(String(colorStr).replace('0x', ''), 16);
}

export class ExperimentAnimator {
  constructor(container, config, centerX, centerY) {
    this._container = container;
    this._config = config;
    this._cx = centerX;
    this._cy = centerY;
    this._animObjects = [];
  }

  async play(type) {
    switch (type) {
      case 'explosion': return this._playExplosion();
      case 'bright_flash': return this._playBrightFlash();
      case 'gradual_change': return this._playGradualChange();
      case 'color_change': return this._playColorChange();
      case 'bubbling': return this._playBubbling();
      case 'gas_release': return this._playGasRelease();
      default: return this._playExplosion();
    }
  }

  async _playExplosion() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const primary = parseColor(cfg.primary_color);
    const secondary = parseColor(cfg.secondary_color);
    const duration = cfg.duration || 2000;

    // Flash overlay
    const flash = new Graphics();
    flash.rect(-200, -200, this._container.width + 400, this._container.height + 400);
    flash.fill({ color: cfg.flash_color ? parseColor(cfg.flash_color) : 0xffffff });
    flash.alpha = 0;
    flash.position.set(0, 0);
    this._container.addChild(flash);
    this._animObjects.push(flash);

    // Build up: glow circle grows
    const glow = new Graphics();
    glow.circle(0, 0, 10);
    glow.fill({ color: primary, alpha: 0.6 });
    glow.position.set(cx, cy);
    this._container.addChild(glow);
    this._animObjects.push(glow);

    await tween(glow, { 'scale.x': 3, 'scale.y': 3 }, duration * 0.3, { ease: easeInOutCubic });

    // Flash
    flash.alpha = 0.8;
    await tween(flash, { alpha: 0 }, 300, { ease: easeLinear });

    // Screen shake
    if (cfg.screen_shake) {
      const orig = { x: this._container.x, y: this._container.y };
      for (let i = 0; i < 6; i++) {
        const intensity = (6 - i) * 2;
        this._container.x = orig.x + (Math.random() - 0.5) * intensity;
        this._container.y = orig.y + (Math.random() - 0.5) * intensity;
        await _wait(40);
      }
      this._container.x = orig.x;
      this._container.y = orig.y;
    }

    // Particle burst
    const burst = new ParticleEffect({
      x: cx, y: cy, color: primary, count: cfg.particle_count || 40, spread: 150, duration: 1000
    });
    this._container.addChild(burst);

    // Secondary burst
    await _wait(100);
    const burst2 = new ParticleEffect({
      x: cx, y: cy, color: secondary, count: Math.floor((cfg.particle_count || 40) / 2), spread: 100, duration: 800
    });
    this._container.addChild(burst2);

    // Expanding smoke ring
    const ring = new Graphics();
    ring.circle(0, 0, 20);
    ring.stroke({ color: 0x888888, alpha: 0.3, width: 4 });
    ring.position.set(cx, cy);
    this._container.addChild(ring);
    this._animObjects.push(ring);

    await tween(ring, { 'scale.x': 6, 'scale.y': 6, alpha: 0 }, duration * 0.5, { ease: easeLinear });

    await _wait(duration * 0.3);
    this._cleanup();
  }

  async _playBrightFlash() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const duration = cfg.duration || 2500;

    // Growing flame glow
    const flame = new Graphics();
    flame.circle(0, 0, 8);
    flame.fill({ color: 0xff8800 });
    flame.position.set(cx, cy);
    this._container.addChild(flame);
    this._animObjects.push(flame);

    await tween(flame, { 'scale.x': 4, 'scale.y': 4 }, duration * 0.3, { ease: easeInOutCubic });

    // Full-screen white flash
    const flash = new Graphics();
    flash.rect(-200, -200, this._container.width + 400, this._container.height + 400);
    flash.fill({ color: 0xffffff });
    flash.alpha = 0;
    this._container.addChild(flash);
    this._animObjects.push(flash);

    await tween(flash, { alpha: 1 }, 150, { ease: easeLinear });
    await _wait(200);
    await tween(flash, { alpha: 0 }, 600, { ease: easeLinear });

    // Bright white core
    const core = new Graphics();
    core.circle(0, 0, 30);
    core.fill({ color: 0xffffff, alpha: 0.9 });
    core.position.set(cx, cy);
    this._container.addChild(core);
    this._animObjects.push(core);

    // White sparks
    const sparks = new ParticleEffect({
      x: cx, y: cy, color: 0xffffff, count: cfg.particle_count || 30, spread: 120, duration: 1200
    });
    this._container.addChild(sparks);

    await tween(core, { 'scale.x': 0.1, 'scale.y': 0.1, alpha: 0 }, duration * 0.4, { ease: easeLinear });
    tween(flame, { alpha: 0 }, 500, { ease: easeLinear });

    await _wait(duration * 0.2);
    this._cleanup();
  }

  async _playGradualChange() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const primary = parseColor(cfg.primary_color);
    const secondary = parseColor(cfg.secondary_color);
    const duration = cfg.duration || 3000;
    const stages = cfg.stages || 5;

    // Metal surface
    const metal = new Graphics();
    metal.roundRect(-60, -40, 120, 80, 6);
    metal.fill({ color: 0xaaaaaa });
    metal.position.set(cx, cy);
    this._container.addChild(metal);
    this._animObjects.push(metal);

    // Grow rust spots in stages
    for (let s = 0; s < stages; s++) {
      const spotCount = 2 + s;
      for (let i = 0; i < spotCount; i++) {
        const spot = new Graphics();
        const r = 4 + Math.random() * (3 + s * 2);
        const sx = (Math.random() - 0.5) * 100;
        const sy = (Math.random() - 0.5) * 60;
        spot.circle(0, 0, r);
        spot.fill({ color: s < stages / 2 ? primary : secondary, alpha: 0.5 + s * 0.1 });
        spot.position.set(cx + sx, cy + sy);
        spot.scale.set(0);
        this._container.addChild(spot);
        this._animObjects.push(spot);

        tween(spot, { 'scale.x': 1, 'scale.y': 1 }, 400, { ease: easeInOutCubic });
      }
      await _wait(duration / stages);
    }

    // Final overall color tint
    const tint = new Graphics();
    tint.roundRect(-60, -40, 120, 80, 6);
    tint.fill({ color: secondary, alpha: 0.4 });
    tint.position.set(cx, cy);
    tint.alpha = 0;
    this._container.addChild(tint);
    this._animObjects.push(tint);

    await tween(tint, { alpha: 1 }, 500, { ease: easeLinear });
    await _wait(500);
    this._cleanup();
  }

  async _playColorChange() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const duration = cfg.duration || 3000;

    const colors = [
      parseColor(cfg.primary_color),
      0xffaa00,
      0xffff00,
      0x44ff44,
      parseColor(cfg.secondary_color),
      cfg.final_color ? parseColor(cfg.final_color) : parseColor(cfg.secondary_color)
    ];

    // Beaker shape
    const beaker = new Graphics();
    beaker.moveTo(-30, -40);
    beaker.lineTo(-40, 40);
    beaker.lineTo(40, 40);
    beaker.lineTo(30, -40);
    beaker.closePath();
    beaker.stroke({ color: 0xcccccc, alpha: 0.6, width: 2 });
    beaker.position.set(cx, cy);
    this._container.addChild(beaker);
    this._animObjects.push(beaker);

    // Liquid that changes color
    const liquid = new Graphics();
    liquid.position.set(cx, cy);
    this._container.addChild(liquid);
    this._animObjects.push(liquid);

    const stepTime = duration / colors.length;
    for (let i = 0; i < colors.length; i++) {
      liquid.clear();
      liquid.moveTo(-35, 0);
      liquid.lineTo(-40, 40);
      liquid.lineTo(40, 40);
      liquid.lineTo(35, 0);
      liquid.closePath();
      liquid.fill({ color: colors[i], alpha: 0.7 });
      await _wait(stepTime);
    }

    await _wait(500);
    this._cleanup();
  }

  async _playBubbling() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const duration = cfg.duration || 3000;
    const bubbleCount = cfg.bubble_count || 15;
    const waterColor = cfg.water_color ? parseColor(cfg.water_color) : 0x4488cc;

    // Water container
    const water = new Graphics();
    water.roundRect(-50, -10, 100, 60, 4);
    water.fill({ color: waterColor, alpha: 0.5 });
    water.position.set(cx, cy);
    this._container.addChild(water);
    this._animObjects.push(water);

    // Spawn bubbles over time
    const bubbleInterval = duration / bubbleCount;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new Graphics();
      const r = 3 + Math.random() * 5;
      bubble.circle(0, 0, r);
      bubble.fill({ color: 0xffffff, alpha: 0.4 });
      bubble.stroke({ color: 0xffffff, alpha: 0.2, width: 1 });
      const bx = cx + (Math.random() - 0.5) * 80;
      bubble.position.set(bx, cy + 40);
      this._container.addChild(bubble);

      // Rise with wobble
      const riseTarget = cy - 60 - Math.random() * 40;
      tween(bubble, { y: riseTarget, alpha: 0 }, 1200 + Math.random() * 800, { ease: easeLinear });
      sineFloat(bubble, 'x', 5, 3 + Math.random() * 2);

      await _wait(bubbleInterval);
    }

    // Water turns milky
    const milky = new Graphics();
    milky.roundRect(-50, -10, 100, 60, 4);
    milky.fill({ color: 0xeeeedd, alpha: 0.0 });
    milky.position.set(cx, cy);
    this._container.addChild(milky);
    this._animObjects.push(milky);

    await tween(milky, { alpha: 0.6 }, 1000, { ease: easeLinear });
    await _wait(500);
    this._cleanup();
  }

  async _playGasRelease() {
    const cfg = this._config;
    const cx = this._cx;
    const cy = this._cy;
    const duration = cfg.duration || 2800;
    const gasColor = cfg.gas_color ? parseColor(cfg.gas_color) : parseColor(cfg.primary_color);

    // Merge elements at center
    const mergeFlash = new Graphics();
    mergeFlash.circle(0, 0, 15);
    mergeFlash.fill({ color: gasColor, alpha: 0.5 });
    mergeFlash.position.set(cx, cy);
    mergeFlash.scale.set(0);
    this._container.addChild(mergeFlash);
    this._animObjects.push(mergeFlash);

    await tween(mergeFlash, { 'scale.x': 2, 'scale.y': 2 }, 400, { ease: easeInOutCubic });
    await tween(mergeFlash, { alpha: 0 }, 300, { ease: easeLinear });

    // Gas cloud rising
    const cloudCount = 8;
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new Graphics();
      const r = 10 + Math.random() * 15;
      cloud.circle(0, 0, r);
      cloud.fill({ color: gasColor, alpha: 0.25 });
      const offsetX = (Math.random() - 0.5) * 60;
      cloud.position.set(cx + offsetX, cy);
      cloud.scale.set(0.5);
      this._container.addChild(cloud);
      this._animObjects.push(cloud);

      const targetY = cy - 80 - Math.random() * 60;
      tween(cloud, { y: targetY, 'scale.x': 1.5, 'scale.y': 1.5, alpha: 0 }, 1500 + Math.random() * 1000, { ease: easeLinear });
      sineFloat(cloud, 'x', 8, 2);

      await _wait(duration / cloudCount * 0.5);
    }

    // Wavy stink lines
    for (let i = 0; i < 3; i++) {
      const line = new Graphics();
      const lx = cx + (i - 1) * 25;
      line.moveTo(0, 0);
      line.bezierCurveTo(8, -15, -8, -30, 5, -45);
      line.stroke({ color: gasColor, alpha: 0.3, width: 2 });
      line.position.set(lx, cy - 20);
      line.alpha = 0;
      this._container.addChild(line);
      this._animObjects.push(line);

      tween(line, { alpha: 0.4, y: cy - 50 }, 800, { ease: easeLinear, delay: i * 200 });
      setTimeout(() => {
        if (!line.destroyed) tween(line, { alpha: 0 }, 600, { ease: easeLinear });
      }, 1200 + i * 200);
    }

    await _wait(duration * 0.6);
    this._cleanup();
  }

  _cleanup() {
    for (const obj of this._animObjects) {
      if (!obj.destroyed) {
        obj.destroy({ children: true });
      }
    }
    this._animObjects = [];
  }

  destroy() {
    this._cleanup();
  }
}

function _wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
