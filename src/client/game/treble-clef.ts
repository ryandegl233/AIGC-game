import type Phaser from 'phaser';

const TEXTURE_KEY = 'golden-treble-clef';

function ensureTrebleClefTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(TEXTURE_KEY)) return;
  const texture = scene.textures.createCanvas(TEXTURE_KEY, 104, 150);
  if (!texture) throw new Error('Unable to create treble clef texture');
  const context = texture.context;
  context.clearRect(0, 0, 104, 150);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '112px "Segoe UI Symbol", "Noto Music", serif';
  context.lineWidth = 8;
  context.strokeStyle = '#4b2a0f';
  context.strokeText('𝄞', 52, 78);
  const gradient = context.createLinearGradient(20, 20, 84, 132);
  gradient.addColorStop(0, '#fff0a6');
  gradient.addColorStop(0.42, '#e8b74c');
  gradient.addColorStop(1, '#9c5c18');
  context.fillStyle = gradient;
  context.fillText('𝄞', 52, 78);
  texture.refresh();
}

export function createTrebleClef(
  scene: Phaser.Scene,
  x: number,
  y: number,
): Phaser.Physics.Arcade.Sprite {
  ensureTrebleClefTexture(scene);
  const player = scene.physics.add.sprite(x, y, TEXTURE_KEY);
  player.setDisplaySize(64, 92);
  player.setCollideWorldBounds(true);
  player.setBounce(0.02);
  const body = player.body as Phaser.Physics.Arcade.Body;
  body.setSize(34, 72, true);
  body.setMaxVelocity(330, 900);
  return player;
}

export function playLandingFeedback(
  scene: Phaser.Scene,
  player: Phaser.Physics.Arcade.Sprite,
  reducedMotion: boolean,
): void {
  if (reducedMotion) return;
  const flash = scene.add.circle(player.x, player.y + 38, 5, 0xf2c75c, 0.9);
  scene.tweens.add({
    targets: flash,
    alpha: 0,
    scale: 5,
    duration: 260,
    onComplete: () => flash.destroy(),
  });
}
