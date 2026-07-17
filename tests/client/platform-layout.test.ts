import { describe, expect, it } from 'vitest';

import {
  calculatePlatformLayout,
  canLandOnOneWayPlatform,
} from '../../src/client/game/platform-layout';

describe('answer platform layout', () => {
  it('creates three equal columns symmetric around the desktop centerline', () => {
    const layout = calculatePlatformLayout(1_200, 120, [16, -20, 8]);
    expect(layout).toHaveLength(3);
    expect(layout[0]?.width).toBeCloseTo(layout[1]?.width ?? 0);
    expect(layout[1]?.width).toBeCloseTo(layout[2]?.width ?? 0);
    expect((layout[0]?.centerX ?? 0) + (layout[2]?.centerX ?? 0)).toBeCloseTo(1_200);
    expect(layout[1]?.centerX).toBeCloseTo(600);
    expect(layout.map((item) => item.answerIndex)).toEqual([0, 1, 2]);
    expect(layout.map((item) => item.offsetY)).toEqual([16, -20, 8]);
  });

  it('keeps mobile landable widths at or above 120 logical pixels', () => {
    const layout = calculatePlatformLayout(720, 40, [0, 0, 0]);
    expect(layout.every((item) => item.width >= 120)).toBe(true);
  });

  it('lets the player pass upward through a platform and catches only a descent from above', () => {
    expect(canLandOnOneWayPlatform(-300, 500, 473)).toBe(false);
    expect(canLandOnOneWayPlatform(180, 468, 473)).toBe(true);
    expect(canLandOnOneWayPlatform(180, 500, 473)).toBe(false);
  });
});
