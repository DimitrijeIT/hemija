// Shared tween/animation helpers

export function tween(target, props, duration, opts = {}) {
  const { ease = easeOutBack, delay = 0, onComplete } = opts;
  const startValues = {};
  for (const key of Object.keys(props)) {
    startValues[key] = key.includes('.') ? getNestedProp(target, key) : target[key];
  }
  const startTime = Date.now() + delay;

  return new Promise(resolve => {
    const tick = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const e = ease(t);

      for (const key of Object.keys(props)) {
        const from = startValues[key];
        const to = props[key];
        const val = from + (to - from) * e;
        if (key.includes('.')) setNestedProp(target, key, val);
        else target[key] = val;
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        if (onComplete) onComplete();
        resolve();
      }
    };
    tick();
  });
}

export function sineFloat(target, prop, amplitude, speed) {
  let running = true;
  const base = target[prop];
  const startTime = Date.now() + Math.random() * 2000;
  const tick = () => {
    if (!running || target.destroyed) return;
    const t = (Date.now() - startTime) / 1000;
    target[prop] = base + Math.sin(t * speed) * amplitude;
    requestAnimationFrame(tick);
  };
  tick();
  return () => { running = false; };
}

export function pulseScale(target, min, max, speed) {
  let running = true;
  const startTime = Date.now() + Math.random() * 2000;
  const tick = () => {
    if (!running || target.destroyed) return;
    const t = (Date.now() - startTime) / 1000;
    const s = min + (max - min) * (0.5 + 0.5 * Math.sin(t * speed));
    target.scale.set(s);
    requestAnimationFrame(tick);
  };
  tick();
  return () => { running = false; };
}

export function bounceIn(target, duration = 500, delay = 0) {
  target.scale.set(0);
  return tween(target, { 'scale.x': 1, 'scale.y': 1 }, duration, { delay, ease: easeOutBack });
}

export function popIn(target, duration = 300, delay = 0) {
  target.scale.set(0);
  target.alpha = 0;
  return Promise.all([
    tween(target, { 'scale.x': 1, 'scale.y': 1 }, duration, { delay, ease: easeOutBack }),
    tween(target, { alpha: 1 }, duration * 0.6, { delay })
  ]);
}

function getNestedProp(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const p of parts) current = current[p];
  return current;
}

function setNestedProp(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) current = current[parts[i]];
  current[parts[parts.length - 1]] = value;
}

// Easing functions
export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
}

export function easeOutBounce(t) {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  else if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  else return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeLinear(t) { return t; }
