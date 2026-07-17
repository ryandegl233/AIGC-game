import Phaser from 'phaser';

import { GameScene, WORLD_HEIGHT, WORLD_WIDTH } from './GameScene';

export function createGame(parent: string | HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: '#eadcb9',
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 1_400 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: { antialias: true, pixelArt: false },
    scene: [GameScene],
  });
}
