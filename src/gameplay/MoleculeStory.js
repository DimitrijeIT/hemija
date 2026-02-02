import { Container, Graphics, Text } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';
import { SaveManager } from '../core/SaveManager.js';

// Animated mini-scene showing how each molecule is used in real life
const STORIES = {
  h2: { icon: drawRocket, label: 'Гориво за ракете!', labelLat: 'Gorivo za rakete!' },
  o2: { icon: drawLungs, label: 'Дишемо кисеоник!', labelLat: 'Dišemo kiseonik!' },
  h2o: { icon: drawWaterScene, label: 'Вода је свуда око нас!', labelLat: 'Voda je svuda oko nas!' },
  co2: { icon: drawSodaBubbles, label: 'Мехурићи у газираном пићу!', labelLat: 'Mehurići u gaziranom piću!' },
  n2: { icon: drawIceCream, label: 'Хлади сладолед!', labelLat: 'Hladi sladoled!' },
  nacl: { icon: drawSaltShaker, label: 'Кухињска со!', labelLat: 'Kuhinjska so!' },
  hcl: { icon: drawStomach, label: 'У твом стомаку!', labelLat: 'U tvom stomaku!' },
  ch4: { icon: drawFlame, label: 'Пламен на шпорету!', labelLat: 'Plamen na šporetu!' },
  nh3: { icon: drawSpray, label: 'Средство за чишћење!', labelLat: 'Sredstvo za čišćenje!' },
  h2s: { icon: drawVolcano, label: 'Вулкански гас!', labelLat: 'Vulkanski gas!' },
  cacl2: { icon: drawSnowflake, label: 'Топи лед на путу!', labelLat: 'Topi led na putu!' },
  mgo: { icon: drawSparkler, label: 'Блистава ватра!', labelLat: 'Blistava vatra!' },
  kcl: { icon: drawBanana, label: 'У бананама!', labelLat: 'U bananama!' },
  fe2o3: { icon: drawRust, label: 'Рђа на металу!', labelLat: 'Rđa na metalu!' },
  cao: { icon: drawBuilding, label: 'Прави се цемент!', labelLat: 'Pravi se cement!' }
};

export class MoleculeStory extends Container {
  constructor(moleculeId, width = 400, height = 200) {
    super();
    this._width = width;
    this._height = height;

    // Background
    const bg = new Graphics();
    bg.roundRect(0, 0, width, height, 16);
    bg.fill({ color: 0x0a1628, alpha: 0.9 });
    bg.roundRect(0, 0, width, height, 16);
    bg.stroke({ color: COLORS.GOLD, alpha: 0.2, width: 2 });
    this.addChild(bg);

    const story = STORIES[moleculeId];
    if (!story) return;

    // Scene container
    const scene = new Container();
    scene.position.set(width / 2, height / 2 - 15);
    this.addChild(scene);

    // Draw and animate the icon
    story.icon(scene);

    // Label - pick Cyrillic or Latin based on script setting
    const script = SaveManager.getInstance().getSetting('script');
    const labelText = script === 'cyrillic' ? story.label : story.labelLat;

    const label = new Text({
      text: labelText,
      style: {
        fontFamily: FONT.FAMILY,
        fontSize: 16,
        fontWeight: 'bold',
        fill: COLORS.GOLD,
        align: 'center'
      }
    });
    label.anchor.set(0.5);
    label.position.set(width / 2, height - 25);
    this.addChild(label);

    // Entrance animation
    this.alpha = 0;
    this.scale.set(0.8);
    const start = Date.now();
    const animateIn = () => {
      const t = Math.min((Date.now() - start) / 500, 1);
      const e = 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
      this.scale.set(0.8 + 0.2 * e);
      this.alpha = t;
      if (t < 1) requestAnimationFrame(animateIn);
    };
    animateIn();
  }
}

// ---- Drawing functions for each molecule story ----

function drawRocket(container) {
  // Rocket body
  const rocket = new Graphics();
  rocket.moveTo(0, -50); rocket.lineTo(15, -20); rocket.lineTo(15, 30);
  rocket.lineTo(-15, 30); rocket.lineTo(-15, -20); rocket.closePath();
  rocket.fill({ color: 0xcccccc });
  // Nose
  rocket.moveTo(0, -50); rocket.lineTo(10, -25); rocket.lineTo(-10, -25); rocket.closePath();
  rocket.fill({ color: 0xe74c3c });
  // Window
  rocket.circle(0, -5, 6);
  rocket.fill({ color: 0x3498db });
  container.addChild(rocket);

  // Animated flame
  const flame = new Graphics();
  container.addChild(flame);
  const startTime = Date.now();
  const animFlame = () => {
    if (container.destroyed) return;
    flame.clear();
    const t = (Date.now() - startTime) / 100;
    const flicker = Math.sin(t * 3) * 5;
    flame.moveTo(-10, 30); flame.lineTo(0, 55 + flicker); flame.lineTo(10, 30);
    flame.fill({ color: 0xff6600 });
    flame.moveTo(-6, 30); flame.lineTo(0, 45 + flicker * 0.5); flame.lineTo(6, 30);
    flame.fill({ color: 0xffcc00 });

    // Stars flying past
    for (let i = 0; i < 3; i++) {
      const sy = ((t * 20 + i * 40) % 120) - 60;
      const sx = -50 + i * 40;
      flame.circle(sx, sy, 1.5);
      flame.fill({ color: 0xffffff, alpha: 0.6 });
    }
    requestAnimationFrame(animFlame);
  };
  animFlame();

  // Bobbing motion
  const st = Date.now();
  const bob = () => {
    if (container.destroyed) return;
    rocket.y = Math.sin((Date.now() - st) / 400) * 3;
    requestAnimationFrame(bob);
  };
  bob();
}

function drawLungs(container) {
  const lungs = new Graphics();
  // Left lung
  lungs.ellipse(-25, 0, 22, 35);
  lungs.fill({ color: 0xff8888, alpha: 0.7 });
  // Right lung
  lungs.ellipse(25, 0, 22, 35);
  lungs.fill({ color: 0xff8888, alpha: 0.7 });
  // Trachea
  lungs.rect(-4, -45, 8, 30);
  lungs.fill({ color: 0xffaaaa });
  container.addChild(lungs);

  // Breathing animation (scale lungs)
  const st = Date.now();
  const breathe = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    const s = 1 + 0.08 * Math.sin(t * 1.5);
    lungs.scale.set(s, s);
    requestAnimationFrame(breathe);
  };
  breathe();

  // O2 particles floating in
  animateFloatingParticles(container, 0x3498db, -70, 0, 1, 8);
}

function drawWaterScene(container) {
  // Water drops falling
  const drops = [];
  for (let i = 0; i < 6; i++) {
    const drop = new Graphics();
    drop.circle(0, 0, 4);
    drop.fill({ color: 0x3498db });
    drop.moveTo(0, -6); drop.lineTo(-3, 0); drop.lineTo(3, 0); drop.closePath();
    drop.fill({ color: 0x2980b9 });
    drop.position.set(-50 + i * 20, -40);
    container.addChild(drop);
    drops.push({ g: drop, speed: 1 + Math.random(), delay: i * 200 });
  }

  // Waves at bottom
  const waves = new Graphics();
  container.addChild(waves);

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;

    // Animate drops
    for (const d of drops) {
      const elapsed = (Date.now() - st - d.delay) / 1000;
      if (elapsed < 0) continue;
      d.g.y = -40 + ((elapsed * d.speed * 40) % 80);
      d.g.alpha = d.g.y > 30 ? 0 : 1;
    }

    // Animate waves
    waves.clear();
    for (let x = -70; x <= 70; x += 4) {
      const y = 35 + Math.sin((x + t * 60) * 0.08) * 5;
      if (x === -70) waves.moveTo(x, y);
      else waves.lineTo(x, y);
    }
    waves.lineTo(70, 55); waves.lineTo(-70, 55); waves.closePath();
    waves.fill({ color: 0x2980b9, alpha: 0.5 });

    requestAnimationFrame(anim);
  };
  anim();
}

function drawSodaBubbles(container) {
  // Glass
  const glass = new Graphics();
  glass.roundRect(-25, -40, 50, 80, 6);
  glass.fill({ color: 0x8B4513, alpha: 0.4 });
  glass.roundRect(-25, -40, 50, 80, 6);
  glass.stroke({ color: 0xcccccc, alpha: 0.5, width: 2 });
  // Liquid
  glass.roundRect(-22, -20, 44, 57, 4);
  glass.fill({ color: 0x4a2800, alpha: 0.6 });
  container.addChild(glass);

  // Bubbles
  const bubbles = [];
  for (let i = 0; i < 10; i++) {
    const b = new Graphics();
    const r = 2 + Math.random() * 3;
    b.circle(0, 0, r);
    b.fill({ color: 0xffffff, alpha: 0.5 });
    container.addChild(b);
    bubbles.push({ g: b, x: -18 + Math.random() * 36, speed: 20 + Math.random() * 30, offset: Math.random() * 100 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const b of bubbles) {
      b.g.x = b.x + Math.sin(t * 3 + b.offset) * 3;
      b.g.y = 35 - ((t * b.speed + b.offset * 10) % 70);
      b.g.alpha = b.g.y < -25 ? 0 : 0.5;
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawIceCream(container) {
  // Cone
  const cone = new Graphics();
  cone.moveTo(-20, 0); cone.lineTo(0, 50); cone.lineTo(20, 0); cone.closePath();
  cone.fill({ color: 0xdaa520 });
  // Criss-cross pattern
  cone.moveTo(-15, 5); cone.lineTo(5, 40);
  cone.moveTo(15, 5); cone.lineTo(-5, 40);
  cone.stroke({ color: 0xc49000, width: 1 });
  container.addChild(cone);

  // Scoops
  const scoop1 = new Graphics();
  scoop1.circle(0, -8, 22);
  scoop1.fill({ color: 0xffc0cb });
  scoop1.circle(0, -8, 22);
  scoop1.stroke({ color: 0xffaaaa, alpha: 0.5, width: 1 });
  container.addChild(scoop1);

  // Cold vapor
  const vapors = [];
  for (let i = 0; i < 5; i++) {
    const v = new Graphics();
    v.circle(0, 0, 3 + Math.random() * 4);
    v.fill({ color: 0xffffff, alpha: 0.3 });
    container.addChild(v);
    vapors.push({ g: v, baseX: -20 + i * 10, offset: Math.random() * 5 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const v of vapors) {
      v.g.x = v.baseX + Math.sin(t * 2 + v.offset) * 8;
      v.g.y = -35 - ((t * 15 + v.offset * 10) % 30);
      v.g.alpha = 0.3 * (1 - ((-35 - v.g.y) / 30));
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawSaltShaker(container) {
  // Shaker body
  const shaker = new Graphics();
  shaker.roundRect(-18, -35, 36, 55, 8);
  shaker.fill({ color: 0xeeeeee });
  shaker.roundRect(-18, -35, 36, 55, 8);
  shaker.stroke({ color: 0xcccccc, width: 1.5 });
  // Cap
  shaker.roundRect(-20, -45, 40, 14, 4);
  shaker.fill({ color: 0x888888 });
  // Holes
  for (let i = -1; i <= 1; i++) {
    shaker.circle(i * 8, -40, 2);
    shaker.fill({ color: 0x444444 });
  }
  // Label
  shaker.roundRect(-12, -15, 24, 20, 3);
  shaker.fill({ color: 0x3498db, alpha: 0.5 });
  container.addChild(shaker);

  // Salt particles falling
  const salts = [];
  for (let i = 0; i < 8; i++) {
    const s = new Graphics();
    s.rect(-1.5, -1.5, 3, 3);
    s.fill({ color: 0xffffff });
    container.addChild(s);
    salts.push({ g: s, x: -8 + Math.random() * 16, speed: 25 + Math.random() * 15, offset: Math.random() * 50 });
  }

  // Shaking animation
  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    shaker.rotation = Math.sin(t * 8) * 0.15;
    for (const s of salts) {
      s.g.x = s.x + Math.sin(t * 5 + s.offset) * 3;
      s.g.y = 20 + ((t * s.speed + s.offset) % 40);
      s.g.alpha = s.g.y > 55 ? 0 : 0.8;
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawStomach(container) {
  const stomach = new Graphics();
  // Stomach shape
  stomach.ellipse(0, 0, 35, 30);
  stomach.fill({ color: 0xff7777, alpha: 0.6 });
  stomach.ellipse(0, 0, 35, 30);
  stomach.stroke({ color: 0xff5555, width: 2 });
  // Esophagus
  stomach.rect(-6, -45, 12, 20);
  stomach.fill({ color: 0xff9999 });
  container.addChild(stomach);

  // Acid bubbles inside
  animateFloatingParticles(container, 0x44ff44, 0, 0, -1, 5, 25, 20);

  // Pulse
  const st = Date.now();
  const pulse = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    const s = 1 + 0.05 * Math.sin(t * 2);
    stomach.scale.set(s);
    requestAnimationFrame(pulse);
  };
  pulse();
}

function drawFlame(container) {
  const burner = new Graphics();
  burner.roundRect(-30, 20, 60, 15, 4);
  burner.fill({ color: 0x555555 });
  burner.rect(-3, 25, 6, 20);
  burner.fill({ color: 0x444444 });
  container.addChild(burner);

  const flame = new Graphics();
  container.addChild(flame);

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 100;
    flame.clear();
    const f1 = Math.sin(t * 2) * 4;
    const f2 = Math.cos(t * 3) * 3;
    // Outer flame
    flame.moveTo(-15, 20); flame.quadraticCurveTo(-20 + f1, -15, 0, -40 + f2);
    flame.quadraticCurveTo(20 + f1, -15, 15, 20); flame.closePath();
    flame.fill({ color: 0xff6600, alpha: 0.8 });
    // Inner flame
    flame.moveTo(-8, 20); flame.quadraticCurveTo(-10 + f2, -5, 0, -25 + f1);
    flame.quadraticCurveTo(10 + f2, -5, 8, 20); flame.closePath();
    flame.fill({ color: 0xffcc00, alpha: 0.9 });
    // Core
    flame.moveTo(-3, 20); flame.quadraticCurveTo(-3, 5, 0, -8 + f2);
    flame.quadraticCurveTo(3, 5, 3, 20); flame.closePath();
    flame.fill({ color: 0xffffff, alpha: 0.6 });
    requestAnimationFrame(anim);
  };
  anim();
}

function drawSpray(container) {
  const bottle = new Graphics();
  bottle.roundRect(-15, -20, 30, 55, 6);
  bottle.fill({ color: 0x2ecc71, alpha: 0.7 });
  bottle.roundRect(-15, -20, 30, 55, 6);
  bottle.stroke({ color: 0x27ae60, width: 1.5 });
  // Nozzle
  bottle.rect(-8, -30, 16, 14);
  bottle.fill({ color: 0x888888 });
  bottle.rect(8, -28, 15, 6);
  bottle.fill({ color: 0x666666 });
  container.addChild(bottle);

  // Spray particles
  const sprays = [];
  for (let i = 0; i < 12; i++) {
    const p = new Graphics();
    p.circle(0, 0, 2);
    p.fill({ color: 0xaaddff, alpha: 0.6 });
    container.addChild(p);
    sprays.push({ g: p, angle: -0.5 + Math.random(), speed: 30 + Math.random() * 40, offset: Math.random() * 50, life: 0 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const s of sprays) {
      s.life = (t * 2 + s.offset) % 1;
      s.g.x = 23 + s.life * s.speed * Math.cos(s.angle);
      s.g.y = -25 + s.life * s.speed * Math.sin(s.angle);
      s.g.alpha = 0.6 * (1 - s.life);
      s.g.scale.set(1 - s.life * 0.5);
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawVolcano(container) {
  const volcano = new Graphics();
  volcano.moveTo(-50, 40); volcano.lineTo(-15, -20); volcano.lineTo(15, -20);
  volcano.lineTo(50, 40); volcano.closePath();
  volcano.fill({ color: 0x654321 });
  // Crater
  volcano.ellipse(0, -20, 18, 8);
  volcano.fill({ color: 0x8B0000, alpha: 0.5 });
  container.addChild(volcano);

  // Smoke & particles
  const smokes = [];
  for (let i = 0; i < 8; i++) {
    const s = new Graphics();
    s.circle(0, 0, 4 + Math.random() * 6);
    s.fill({ color: 0xffff30, alpha: 0.5 });
    container.addChild(s);
    smokes.push({ g: s, vx: -10 + Math.random() * 20, speed: 20 + Math.random() * 30, offset: Math.random() * 60 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const s of smokes) {
      const life = (t * 1.5 + s.offset / 10) % 1;
      s.g.x = s.vx * life;
      s.g.y = -25 - life * s.speed;
      s.g.alpha = 0.5 * (1 - life);
      s.g.scale.set(0.5 + life);
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawSnowflake(container) {
  // Road
  const road = new Graphics();
  road.rect(-60, 25, 120, 30);
  road.fill({ color: 0x555555 });
  road.rect(-60, 38, 120, 4);
  road.fill({ color: 0xffff00, alpha: 0.3 });
  container.addChild(road);

  // Snowflakes falling and melting
  const flakes = [];
  for (let i = 0; i < 8; i++) {
    const f = new Text({ text: '❄', style: { fontSize: 12 + Math.random() * 8 } });
    f.anchor.set(0.5);
    container.addChild(f);
    flakes.push({ g: f, x: -50 + Math.random() * 100, speed: 15 + Math.random() * 20, offset: Math.random() * 50 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const f of flakes) {
      const life = (t + f.offset / 10) % 2;
      f.g.x = f.x + Math.sin(t * 2 + f.offset) * 10;
      f.g.y = -40 + life * 40;
      f.g.alpha = f.g.y > 20 ? Math.max(0, 1 - (f.g.y - 20) / 15) : 1;
      f.g.rotation = t * 2;
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawSparkler(container) {
  const stick = new Graphics();
  stick.rect(-2, 0, 4, 50);
  stick.fill({ color: 0x888888 });
  container.addChild(stick);

  const sparks = [];
  for (let i = 0; i < 20; i++) {
    const s = new Graphics();
    s.circle(0, 0, 1.5);
    s.fill({ color: i % 2 === 0 ? 0xffffff : 0xffdd00 });
    container.addChild(s);
    sparks.push({ g: s, angle: Math.random() * Math.PI * 2, speed: 20 + Math.random() * 40, offset: Math.random() * 100 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const s of sparks) {
      const life = (t * 3 + s.offset / 10) % 1;
      s.g.x = Math.cos(s.angle + t) * life * s.speed;
      s.g.y = -5 + Math.sin(s.angle + t) * life * s.speed;
      s.g.alpha = 1 - life;
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawBanana(container) {
  const banana = new Graphics();
  // Banana shape (arc)
  banana.moveTo(-30, 10); banana.quadraticCurveTo(0, -40, 30, 0);
  banana.quadraticCurveTo(0, -20, -30, 10); banana.closePath();
  banana.fill({ color: 0xffe135 });
  banana.moveTo(-30, 10); banana.quadraticCurveTo(0, -40, 30, 0);
  banana.stroke({ color: 0xdaaa00, width: 1.5 });
  // Tip
  banana.circle(30, 0, 3);
  banana.fill({ color: 0x8B4513 });
  container.addChild(banana);

  // Floating K particles
  animateFloatingParticles(container, 0x8F40D4, 0, 20, -1, 4, 60, 40);

  // Gentle wobble
  const st = Date.now();
  const wobble = () => {
    if (container.destroyed) return;
    banana.rotation = Math.sin((Date.now() - st) / 500) * 0.08;
    requestAnimationFrame(wobble);
  };
  wobble();
}

function drawRust(container) {
  // Metal plate
  const plate = new Graphics();
  plate.roundRect(-40, -25, 80, 50, 6);
  plate.fill({ color: 0x888888 });
  plate.roundRect(-40, -25, 80, 50, 6);
  plate.stroke({ color: 0x666666, width: 2 });
  container.addChild(plate);

  // Rust spots that grow
  const spots = [];
  for (let i = 0; i < 6; i++) {
    const s = new Graphics();
    const cx = -30 + Math.random() * 60;
    const cy = -15 + Math.random() * 30;
    s.position.set(cx, cy);
    container.addChild(s);
    spots.push({ g: s, maxR: 5 + Math.random() * 10, offset: i * 0.5 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const s of spots) {
      s.g.clear();
      const grow = Math.min(1, (t - s.offset) * 0.5);
      if (grow > 0) {
        s.g.circle(0, 0, s.maxR * grow);
        s.g.fill({ color: 0xE06633, alpha: 0.7 * grow });
      }
    }
    requestAnimationFrame(anim);
  };
  anim();
}

function drawBuilding(container) {
  // Building
  const building = new Graphics();
  building.rect(-30, -40, 60, 80);
  building.fill({ color: 0xccbbaa });
  building.rect(-30, -40, 60, 80);
  building.stroke({ color: 0xaa9988, width: 1.5 });
  // Windows
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      building.rect(-22 + c * 26, -32 + r * 25, 16, 16);
      building.fill({ color: 0x87ceeb, alpha: 0.6 });
    }
  }
  // Door
  building.rect(-8, 20, 16, 20);
  building.fill({ color: 0x8B4513 });
  container.addChild(building);

  // Cement being applied animation
  const cement = new Graphics();
  container.addChild(cement);
  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    cement.clear();
    const h = Math.min(80, t * 20);
    cement.rect(-30, 40 - h, 60, h);
    cement.fill({ color: 0xddccbb, alpha: 0.3 });
    if (h < 80) requestAnimationFrame(anim);
  };
  anim();
}

// Utility: floating particles
function animateFloatingParticles(container, color, cx, cy, direction, count, rangeX = 40, rangeY = 40) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const p = new Graphics();
    p.circle(0, 0, 2 + Math.random() * 2);
    p.fill({ color, alpha: 0.5 });
    container.addChild(p);
    particles.push({ g: p, offsetX: (Math.random() - 0.5) * rangeX, speed: 10 + Math.random() * 20, offset: Math.random() * 50 });
  }

  const st = Date.now();
  const anim = () => {
    if (container.destroyed) return;
    const t = (Date.now() - st) / 1000;
    for (const p of particles) {
      const life = (t + p.offset / 10) % 2;
      p.g.x = cx + p.offsetX + Math.sin(t * 2 + p.offset) * 5;
      p.g.y = cy + direction * life * p.speed;
      p.g.alpha = 0.5 * (1 - life / 2);
    }
    requestAnimationFrame(anim);
  };
  anim();
}
