import { Container, Graphics, Text } from 'pixi.js';
import { COLORS, FONT } from '../core/Constants.js';

/**
 * Draws an animated professor/teacher character using PixiJS Graphics.
 * Friendly cartoon scientist with lab coat, glasses, and animations.
 */
export function createTeacher(scale = 1) {
  const container = new Container();
  container.scale.set(scale);

  // --- Lab coat body ---
  const body = new Graphics();
  // Coat
  body.roundRect(-28, 0, 56, 70, 8);
  body.fill({ color: 0xf0f0f0 });
  body.roundRect(-28, 0, 56, 70, 8);
  body.stroke({ color: 0xdddddd, width: 1.5 });
  // Coat buttons
  body.circle(0, 20, 3);
  body.fill({ color: 0x888888 });
  body.circle(0, 35, 3);
  body.fill({ color: 0x888888 });
  body.circle(0, 50, 3);
  body.fill({ color: 0x888888 });
  // Collar
  body.moveTo(-20, 0); body.lineTo(-8, 12); body.lineTo(0, 2);
  body.lineTo(8, 12); body.lineTo(20, 0);
  body.stroke({ color: 0xdddddd, width: 2 });
  // Shirt under collar
  body.moveTo(-8, 2); body.lineTo(0, 14); body.lineTo(8, 2);
  body.fill({ color: 0x3498db });
  // Pocket
  body.roundRect(8, 25, 16, 18, 3);
  body.stroke({ color: 0xcccccc, width: 1 });
  // Pen in pocket
  body.rect(14, 22, 2, 12);
  body.fill({ color: 0xe74c3c });
  container.addChild(body);

  // --- Head ---
  const head = new Container();
  head.position.set(0, -30);

  // Face
  const face = new Graphics();
  face.circle(0, 0, 26);
  face.fill({ color: 0xffdab9 });
  face.circle(0, 0, 26);
  face.stroke({ color: 0xf0c090, width: 1 });
  head.addChild(face);

  // Hair (messy professor hair)
  const hair = new Graphics();
  // Top hair - wavy
  hair.ellipse(0, -22, 24, 12);
  hair.fill({ color: 0x888888 });
  // Side tufts
  hair.ellipse(-26, -8, 8, 14);
  hair.fill({ color: 0x888888 });
  hair.ellipse(26, -8, 8, 14);
  hair.fill({ color: 0x888888 });
  head.addChild(hair);

  // Glasses
  const glasses = new Graphics();
  // Left lens
  glasses.circle(-10, -2, 10);
  glasses.stroke({ color: 0x333333, width: 2 });
  glasses.circle(-10, -2, 10);
  glasses.fill({ color: 0xffffff, alpha: 0.15 });
  // Right lens
  glasses.circle(10, -2, 10);
  glasses.stroke({ color: 0x333333, width: 2 });
  glasses.circle(10, -2, 10);
  glasses.fill({ color: 0xffffff, alpha: 0.15 });
  // Bridge
  glasses.moveTo(-1, -2); glasses.lineTo(1, -2);
  glasses.stroke({ color: 0x333333, width: 2 });
  // Arms
  glasses.moveTo(-20, -2); glasses.lineTo(-26, -4);
  glasses.stroke({ color: 0x333333, width: 1.5 });
  glasses.moveTo(20, -2); glasses.lineTo(26, -4);
  glasses.stroke({ color: 0x333333, width: 1.5 });
  head.addChild(glasses);

  // Eyes (behind glasses)
  const eyes = new Container();
  // Left eye
  const leftEye = new Graphics();
  leftEye.circle(-10, -3, 3);
  leftEye.fill({ color: 0x2c3e50 });
  leftEye.circle(-11, -4, 1);
  leftEye.fill({ color: 0xffffff });
  eyes.addChild(leftEye);
  // Right eye
  const rightEye = new Graphics();
  rightEye.circle(10, -3, 3);
  rightEye.fill({ color: 0x2c3e50 });
  rightEye.circle(9, -4, 1);
  rightEye.fill({ color: 0xffffff });
  eyes.addChild(rightEye);
  head.addChild(eyes);

  // Eyebrows
  const brows = new Graphics();
  brows.moveTo(-16, -12); brows.lineTo(-5, -14);
  brows.stroke({ color: 0x666666, width: 2 });
  brows.moveTo(5, -14); brows.lineTo(16, -12);
  brows.stroke({ color: 0x666666, width: 2 });
  head.addChild(brows);

  // Nose
  const nose = new Graphics();
  nose.moveTo(0, -1); nose.lineTo(-3, 6); nose.lineTo(3, 6);
  nose.stroke({ color: 0xe8b88a, width: 1.5 });
  head.addChild(nose);

  // Mouth - default smile
  const mouth = new Graphics();
  mouth.moveTo(-8, 12);
  mouth.quadraticCurveTo(0, 20, 8, 12);
  mouth.stroke({ color: 0xcc8866, width: 2 });
  head.addChild(mouth);

  // Cheek blush
  const leftCheek = new Graphics();
  leftCheek.circle(-18, 8, 5);
  leftCheek.fill({ color: 0xffaaaa, alpha: 0.3 });
  head.addChild(leftCheek);
  const rightCheek = new Graphics();
  rightCheek.circle(18, 8, 5);
  rightCheek.fill({ color: 0xffaaaa, alpha: 0.3 });
  head.addChild(rightCheek);

  // Mustache
  const mustache = new Graphics();
  mustache.moveTo(-12, 8); mustache.quadraticCurveTo(-6, 14, 0, 9);
  mustache.quadraticCurveTo(6, 14, 12, 8);
  mustache.stroke({ color: 0x777777, width: 2.5 });
  head.addChild(mustache);

  container.addChild(head);

  // --- Arms ---
  const leftArm = new Graphics();
  leftArm.moveTo(-28, 8); leftArm.lineTo(-45, 40); leftArm.lineTo(-40, 42);
  leftArm.lineTo(-26, 14);
  leftArm.fill({ color: 0xf0f0f0 });
  // Hand
  leftArm.circle(-43, 41, 6);
  leftArm.fill({ color: 0xffdab9 });
  container.addChild(leftArm);

  const rightArm = new Graphics();
  rightArm.moveTo(28, 8); rightArm.lineTo(45, 30); rightArm.lineTo(40, 33);
  rightArm.lineTo(26, 14);
  rightArm.fill({ color: 0xf0f0f0 });
  // Hand
  rightArm.circle(43, 31, 6);
  rightArm.fill({ color: 0xffdab9 });
  container.addChild(rightArm);

  // Store references for animations
  container._head = head;
  container._body = body;
  container._leftArm = leftArm;
  container._rightArm = rightArm;
  container._mouth = mouth;
  container._eyes = eyes;
  container._brows = brows;

  // --- Idle animation ---
  const startTime = Date.now() + Math.random() * 3000;
  const idle = () => {
    if (container.destroyed) return;
    const t = (Date.now() - startTime) / 1000;

    // Gentle breathing
    body.scale.y = 1 + Math.sin(t * 1.5) * 0.01;

    // Head slight tilt
    head.rotation = Math.sin(t * 0.8) * 0.03;

    // Arm gentle sway
    rightArm.rotation = Math.sin(t * 1.2) * 0.04;

    requestAnimationFrame(idle);
  };
  idle();

  return container;
}

/**
 * Creates a speech bubble pointing down-left towards the teacher.
 */
export function createSpeechBubble(text, maxWidth = 300) {
  const container = new Container();

  const textObj = new Text({
    text,
    style: {
      fontFamily: FONT.FAMILY,
      fontSize: 15,
      fill: 0x222222,
      wordWrap: true,
      wordWrapWidth: maxWidth - 30,
      lineHeight: 20
    }
  });
  textObj.position.set(15, 12);

  const bubbleW = Math.min(maxWidth, textObj.width + 30);
  const bubbleH = textObj.height + 24;

  const bg = new Graphics();
  bg.roundRect(0, 0, bubbleW, bubbleH, 12);
  bg.fill({ color: 0xffffff });
  bg.roundRect(0, 0, bubbleW, bubbleH, 12);
  bg.stroke({ color: 0xdddddd, width: 1.5 });

  // Tail pointing down
  bg.moveTo(20, bubbleH);
  bg.lineTo(10, bubbleH + 15);
  bg.lineTo(35, bubbleH);
  bg.fill({ color: 0xffffff });
  bg.moveTo(20, bubbleH);
  bg.lineTo(10, bubbleH + 15);
  bg.lineTo(35, bubbleH);
  bg.stroke({ color: 0xdddddd, width: 1.5 });

  // Cover the tail-bubble junction line
  bg.rect(21, bubbleH - 1, 13, 3);
  bg.fill({ color: 0xffffff });

  container.addChild(bg);
  container.addChild(textObj);

  container._textObj = textObj;
  container._bg = bg;

  return container;
}
