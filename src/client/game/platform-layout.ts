export interface PlatformPlacement {
  answerIndex: 0 | 1 | 2;
  centerX: number;
  width: number;
  offsetY: number;
}

export function canLandOnOneWayPlatform(
  verticalVelocity: number,
  previousBottom: number,
  platformTop: number,
  tolerance = 8,
): boolean {
  return verticalVelocity >= 0 && previousBottom <= platformTop + tolerance;
}

export function calculatePlatformLayout(
  worldWidth: number,
  margin: number,
  verticalOffsets: readonly [number, number, number],
): readonly PlatformPlacement[] {
  const gap = Math.max(36, Math.min(96, worldWidth * 0.075));
  const width = (worldWidth - margin * 2 - gap * 2) / 3;
  if (width < 120) throw new Error('World is too narrow for accessible answer platforms');

  return ([0, 1, 2] as const).map((answerIndex) => ({
    answerIndex,
    centerX: margin + width / 2 + answerIndex * (width + gap),
    width,
    offsetY: verticalOffsets[answerIndex],
  }));
}
