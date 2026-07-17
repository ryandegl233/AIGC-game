import Phaser from 'phaser';

import type { Question } from '../../shared/question-schema';
import type { LevelConfig } from './level-config';
import { canLandOnOneWayPlatform } from './platform-layout';
import { buildRouteLayout, wrapPlatformLabel } from './route-layout';
import { createTrebleClef, playLandingFeedback } from './treble-clef';

export const WORLD_WIDTH = 1_200;
export const WORLD_HEIGHT = 675;
const GROUND_Y = 620;

export interface AnswerSelectedPayload {
  selectedIndex: number;
}

export class GameScene extends Phaser.Scene {
  private ready = false;
  private player!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.GameObjects.Rectangle;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private labels: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'left' | 'right' | 'jump', Phaser.Input.Keyboard.Key>;
  private running = false;
  private answerLocked = false;
  private virtualLeft = false;
  private virtualRight = false;
  private virtualJump = false;
  private reducedMotion = false;
  private lastGroundedAt = 0;
  private jumpPressedAt = Number.NEGATIVE_INFINITY;
  private wasGrounded = false;
  private hazardLocked = false;

  constructor() {
    super('game');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#eadcb9');
    this.createBackdrop();
    this.ensurePlatformTexture();
    this.ensureRouteTextures();

    this.ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + 28, WORLD_WIDTH, 56, 0x2f1b0f);
    this.physics.add.existing(this.ground, true);
    this.platforms = this.physics.add.staticGroup();
    this.hazards = this.physics.add.staticGroup();
    this.player = createTrebleClef(this, WORLD_WIDTH / 2, GROUND_Y - 70);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(
      this.player,
      this.platforms,
      undefined,
      (playerObject, platformObject) => {
        const playerBody = (playerObject as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
        const platformBody = (platformObject as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.StaticBody;
        return canLandOnOneWayPlatform(
          playerBody.velocity.y,
          playerBody.prev.y + playerBody.height,
          platformBody.top,
        );
      },
    );
    this.physics.add.overlap(this.player, this.hazards, () => this.hitHazard());

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable');
    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      jump: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
    this.ready = true;
  }

  update(time: number): void {
    if (!this.running) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) this.lastGroundedAt = time;

    const left = this.cursors.left.isDown || this.keys.left.isDown || this.virtualLeft;
    const right = this.cursors.right.isDown || this.keys.right.isDown || this.virtualRight;
    const jumpDown =
      this.cursors.up.isDown || this.cursors.space.isDown || this.keys.jump.isDown || this.virtualJump;
    if (jumpDown && !this.wasJumpDown()) this.jumpPressedAt = time;
    this.player.setData('jumpDown', jumpDown);

    if (left === right) body.setVelocityX(0);
    else body.setVelocityX(left ? -320 : 320);

    if (time - this.jumpPressedAt <= 120 && time - this.lastGroundedAt <= 100) {
      body.setVelocityY(-720);
      this.jumpPressedAt = Number.NEGATIVE_INFINITY;
      this.events.emit('player-jump');
      if (!this.reducedMotion) this.tweens.add({ targets: this.player, angle: 10, yoyo: true, duration: 180 });
    }

    if (grounded && !this.wasGrounded) {
      playLandingFeedback(this, this.player, this.reducedMotion);
      this.events.emit('player-land');
    }
    this.wasGrounded = grounded;
    this.checkAnswerLanding();
  }

  presentQuestion(
    question: Question,
    level: LevelConfig,
    routeVariant = 0,
  ): void {
    this.platforms.clear(true, true);
    this.hazards.clear(true, true);
    this.labels.forEach((label) => label.destroy());
    this.labels = [];
    this.answerLocked = false;
    this.hazardLocked = false;
    const layout = buildRouteLayout(level.id, routeVariant);
    this.player.setPosition(layout.spawn.x, layout.spawn.y);
    this.player.setVelocity(0, 0);

    for (const placement of [...layout.supportPlatforms, ...layout.answerPlatforms]) {
      const platform = this.platforms.create(
        placement.x,
        placement.y,
        placement.kind === 'answer' ? 'answer-platform' : 'route-platform',
      ) as Phaser.Physics.Arcade.Sprite;
      platform.setDisplaySize(placement.width, placement.height).refreshBody();
      platform.setData({
        answerIndex: placement.answerIndex,
        kind: placement.kind,
        motion: placement.motion,
        routeIndex: placement.routeIndex,
      });
      if (placement.kind !== 'answer' || placement.answerIndex === undefined) continue;
      const labelText = wrapPlatformLabel(question.options[placement.answerIndex], 10);
      const lineCount = labelText.split('\n').length;
      const label = this.add.text(placement.x, placement.y - 4, labelText, {
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: lineCount >= 3 ? '14px' : lineCount === 2 ? '16px' : '18px',
        color: '#fff2cb',
        align: 'center',
        lineSpacing: -2,
        wordWrap: { width: placement.width - 28 },
      }).setOrigin(0.5);
      this.labels.push(label);
    }

    for (const hazardPlacement of layout.hazards) {
      const hazard = this.hazards.create(
        hazardPlacement.x,
        hazardPlacement.y,
        'sharp-hazard',
      ) as Phaser.Physics.Arcade.Sprite;
      hazard.setDisplaySize(hazardPlacement.width, hazardPlacement.height).refreshBody();
    }
  }

  setRunning(running: boolean): void {
    this.running = running;
    if (!running && this.player?.body) this.player.setVelocity(0, 0);
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.reducedMotion = reducedMotion;
  }

  setVirtualInput(control: 'left' | 'right' | 'jump', active: boolean): void {
    if (control === 'left') this.virtualLeft = active;
    if (control === 'right') this.virtualRight = active;
    if (control === 'jump') this.virtualJump = active;
  }

  getAnswerPlatforms(): readonly Phaser.Physics.Arcade.Sprite[] {
    return (this.platforms.getChildren() as Phaser.Physics.Arcade.Sprite[])
      .filter((platform) => platform.getData('kind') === 'answer');
  }

  getRoutePlatforms(): readonly Phaser.Physics.Arcade.Sprite[] {
    return this.platforms.getChildren() as Phaser.Physics.Arcade.Sprite[];
  }

  isReady(): boolean {
    return this.ready;
  }

  private wasJumpDown(): boolean {
    return Boolean(this.player.getData('jumpDown'));
  }

  private checkAnswerLanding(): void {
    if (!this.running || this.answerLocked) return;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody.velocity.y < -1) return;

    for (const platform of this.getAnswerPlatforms()) {
      const platformBody = platform.body as Phaser.Physics.Arcade.StaticBody;
      const verticallyLanded = Math.abs(playerBody.bottom - platformBody.top) <= 6;
      const horizontallyOverlapping =
        playerBody.right > platformBody.left + 2 && playerBody.left < platformBody.right - 2;
      if (!verticallyLanded || !horizontallyOverlapping) continue;

      const selectedIndex = platform.getData('answerIndex') as number | undefined;
      if (selectedIndex === undefined) return;
      this.answerLocked = true;
      this.setRunning(false);
      this.events.emit('answer-selected', { selectedIndex } satisfies AnswerSelectedPayload);
      return;
    }
  }

  private hitHazard(): void {
    if (!this.running || this.hazardLocked) return;
    this.hazardLocked = true;
    this.player.setPosition(WORLD_WIDTH / 2, GROUND_Y - 70);
    this.player.setVelocity(0, 0);
    this.events.emit('route-penalty');
    this.time.delayedCall(550, () => { this.hazardLocked = false; });
  }

  private createBackdrop(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xeadcb9, 1).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    graphics.lineStyle(2, 0x9c7439, 0.28);
    for (let y = 96; y < 560; y += 22) graphics.lineBetween(0, y, WORLD_WIDTH, y);
    graphics.lineStyle(8, 0x7a4a1d, 1).strokeRoundedRect(14, 14, WORLD_WIDTH - 28, WORLD_HEIGHT - 28, 18);
    graphics.lineStyle(2, 0xd5aa50, 1).strokeRoundedRect(27, 27, WORLD_WIDTH - 54, WORLD_HEIGHT - 54, 14);
  }

  private ensurePlatformTexture(): void {
    if (this.textures.exists('answer-platform')) return;
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x3b220f, 1).fillRoundedRect(0, 0, 300, 48, 6);
    graphics.lineStyle(4, 0xd5aa50, 1).strokeRoundedRect(2, 2, 296, 44, 5);
    graphics.generateTexture('answer-platform', 300, 48);
    graphics.destroy();
  }

  private ensureRouteTextures(): void {
    if (!this.textures.exists('route-platform')) {
      const support = this.make.graphics({ x: 0, y: 0 }, false);
      support.fillStyle(0x5b3514, 1).fillRoundedRect(0, 0, 160, 24, 5);
      support.lineStyle(3, 0xd5aa50, 1).strokeRoundedRect(1, 1, 158, 22, 4);
      support.generateTexture('route-platform', 160, 24);
      support.destroy();
    }
    if (!this.textures.exists('sharp-hazard')) {
      const hazard = this.make.graphics({ x: 0, y: 0 }, false);
      hazard.fillStyle(0x7d251d, 1).fillTriangle(0, 36, 17, 0, 34, 36);
      hazard.lineStyle(3, 0xf0c768, 1).strokeTriangle(1, 35, 17, 2, 33, 35);
      hazard.generateTexture('sharp-hazard', 34, 36);
      hazard.destroy();
    }
  }
}
