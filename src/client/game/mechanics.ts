import type Phaser from 'phaser';

import type { MechanicConfig } from './level-config';

interface LifecycleDependencies {
  sleep(milliseconds: number): Promise<void>;
  startMotion(): void;
  stopMotion(): void;
}

export interface MechanicLifecycle {
  preview(): Promise<void>;
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

export function createMechanicLifecycle(
  periodMs: number,
  dependencies: LifecycleDependencies,
): MechanicLifecycle {
  let running = false;
  return {
    async preview() {
      if (periodMs <= 0) return;
      running = true;
      dependencies.startMotion();
      await dependencies.sleep(periodMs);
      dependencies.stopMotion();
      running = false;
    },
    start() {
      if (running) return;
      running = true;
      dependencies.startMotion();
    },
    stop() {
      if (!running) return;
      dependencies.stopMotion();
      running = false;
    },
    isRunning: () => running,
  };
}

export function createPhaserMechanic(
  scene: Phaser.Scene,
  platforms: readonly Phaser.Physics.Arcade.Sprite[],
  config: MechanicConfig,
): MechanicLifecycle {
  const origins = platforms.map((platform) => ({ x: platform.x, y: platform.y, alpha: platform.alpha }));
  let tweens: Phaser.Tweens.Tween[] = [];

  const refresh = (platform: Phaser.Physics.Arcade.Sprite) => platform.refreshBody();
  const addTween = (
    platform: Phaser.Physics.Arcade.Sprite | undefined,
    properties: Partial<Phaser.Types.Tweens.TweenBuilderConfig>,
  ) => {
    if (!platform) return;
    tweens.push(scene.tweens.add({
      targets: platform,
      duration: Math.max(400, config.periodMs / 2),
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => refresh(platform),
      ...properties,
    }));
  };

  const startMotion = () => {
    if (config.type === 'static') return;
    if (config.type === 'horizontal') addTween(platforms[1], { x: (platforms[1]?.x ?? 0) + config.amplitude });
    if (config.type === 'vertical') {
      addTween(platforms[0], { y: (platforms[0]?.y ?? 0) - config.amplitude });
      addTween(platforms[2], { y: (platforms[2]?.y ?? 0) + config.amplitude * 0.55 });
    }
    if (config.type === 'phrase-lift') {
      platforms.forEach((platform, index) => addTween(platform, {
        y: platform.y - config.amplitude,
        delay: index * 170,
      }));
    }
    if (config.type === 'scroll') {
      platforms.forEach((platform) => addTween(platform, { x: platform.x + config.amplitude }));
    }
    if (config.type === 'pulse') {
      platforms.forEach((platform, index) => addTween(platform, {
        y: platform.y - config.amplitude * (index === 1 ? 1 : 0.55),
        alpha: 0.62,
        delay: index * 120,
      }));
    }
    if (config.type === 'mixed' || config.type === 'final') {
      addTween(platforms[0], { x: (platforms[0]?.x ?? 0) + config.amplitude });
      addTween(platforms[1], { y: (platforms[1]?.y ?? 0) - config.amplitude });
      addTween(platforms[2], {
        x: (platforms[2]?.x ?? 0) - config.amplitude * 0.7,
        y: (platforms[2]?.y ?? 0) + config.amplitude * 0.45,
        alpha: config.type === 'final' ? 0.68 : 0.82,
      });
    }
  };

  const stopMotion = () => {
    tweens.forEach((tween) => tween.stop());
    tweens = [];
    platforms.forEach((platform, index) => {
      const origin = origins[index];
      if (!origin) return;
      platform.setPosition(origin.x, origin.y).setAlpha(origin.alpha);
      refresh(platform);
    });
  };

  return createMechanicLifecycle(config.periodMs, {
    sleep: (milliseconds) => new Promise((resolve) => {
      scene.time.delayedCall(milliseconds, resolve);
    }),
    startMotion,
    stopMotion,
  });
}
