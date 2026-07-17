import { describe, expect, it } from 'vitest';

import { LEVELS } from '../../src/client/game/level-config';

describe('level configuration', () => {
  it('contains nine sequential levels with three required questions', () => {
    expect(LEVELS.map((level) => level.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(LEVELS.every((level) => level.requiredQuestions === 3)).toBe(true);
  });

  it('uses the approved descending timers', () => {
    expect(LEVELS.map((level) => level.timeLimit)).toEqual([30, 28, 26, 24, 22, 21, 19, 18, 16]);
  });

  it('introduces mechanics progressively and ends with a combination', () => {
    expect(LEVELS.map((level) => level.mechanic.type)).toEqual([
      'static', 'static', 'horizontal', 'vertical', 'phrase-lift',
      'scroll', 'pulse', 'mixed', 'final',
    ]);
  });
});
