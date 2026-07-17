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
  let timers: Phaser.Time.TimerEvent[] = [];

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
    platforms.forEach((platform, index) => {
      const motion = platform.getData('motion') as string | undefined;
      if (motion === 'horizontal') addTween(platform, { x: platform.x + config.amplitude * 0.62, delay: index * 60 });
      if (motion === 'vertical') addTween(platform, { y: platform.y - config.amplitude * 0.58, delay: index * 60 });
      if (motion === 'blink') {
        const body = platform.body as Phaser.Physics.Arcade.StaticBody;
        timers.push(scene.time.addEvent({
          delay: Math.max(450, config.periodMs / 2),
          loop: true,
          callback: () => {
            body.enable = !body.enable;
            platform.setAlpha(body.enable ? 1 : 0.24);
          },
        }));
      }
    });
  };

  const stopMotion = () => {
    tweens.forEach((tween) => tween.stop());
    tweens = [];
    timers.forEach((timer) => timer.remove(false));
    timers = [];
    platforms.forEach((platform, index) => {
      const origin = origins[index];
      if (!origin) return;
      platform.setPosition(origin.x, origin.y).setAlpha(origin.alpha);
      (platform.body as Phaser.Physics.Arcade.StaticBody).enable = true;
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
