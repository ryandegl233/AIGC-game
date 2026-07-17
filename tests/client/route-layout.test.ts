import { describe, expect, it } from 'vitest';

import {
  buildRouteLayout,
  isRouteJumpReachable,
  wrapPlatformLabel,
} from '../../src/client/game/route-layout';

describe('branching route layout', () => {
  it('builds three answer routes whose consecutive jumps stay reachable', () => {
    for (let levelId = 1; levelId <= 9; levelId += 1) {
      const layout = buildRouteLayout(levelId, 0);
      expect(layout.answerPlatforms).toHaveLength(3);
      expect(layout.answerPlatforms.map((platform) => platform.answerIndex)).toEqual([0, 1, 2]);
      for (const route of layout.routes) {
        expect(route.every((jump) => isRouteJumpReachable(jump))).toBe(true);
      }
    }
  });

  it('raises route complexity and introduces visible hazards progressively', () => {
    const early = buildRouteLayout(1, 0);
    const middle = buildRouteLayout(5, 0);
    const final = buildRouteLayout(9, 0);

    expect(early.supportPlatforms.length).toBeLessThan(middle.supportPlatforms.length);
    expect(middle.supportPlatforms.length).toBeLessThan(final.supportPlatforms.length);
    expect(early.hazards).toHaveLength(0);
    expect(middle.hazards.length).toBeGreaterThan(0);
    expect(final.supportPlatforms.some((platform) => platform.motion === 'blink')).toBe(true);
  });

  it('rotates high, balanced, and low route profiles between answer columns', () => {
    const first = buildRouteLayout(6, 0).answerPlatforms.map((platform) => platform.profile);
    const second = buildRouteLayout(6, 1).answerPlatforms.map((platform) => platform.profile);
    const third = buildRouteLayout(6, 2).answerPlatforms.map((platform) => platform.profile);

    expect(new Set(first)).toEqual(new Set(['high', 'balanced', 'low']));
    expect(second).not.toEqual(first);
    expect(third).not.toEqual(second);
  });

  it('keeps answer platforms unreachable directly from the ground', () => {
    const layout = buildRouteLayout(9, 0);
    expect(layout.answerPlatforms.every((platform) => platform.y < 400)).toBe(true);
  });

  it('wraps long Chinese answers inside the answer platform width', () => {
    const wrapped = wrapPlatformLabel('吸收本民族舞曲、民歌、传说或语言节奏', 10);
    expect(wrapped).toContain('\n');
    expect(wrapped.split('\n').every((line) => Array.from(line).length <= 10)).toBe(true);
  });
});
