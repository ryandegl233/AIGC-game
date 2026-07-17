import { describe, expect, it } from 'vitest';

import { applyAttempt, createLevelState } from '../../src/client/state/game-rules';

describe('game rules', () => {
  it('starts each level with three lives and no score', () => {
    expect(createLevelState(4)).toEqual({
      levelId: 4, lives: 3, completedQuestions: 0, score: 0, phase: 'playing',
    });
  });

  it('awards base and proportional time score for a correct answer', () => {
    const result = applyAttempt(createLevelState(1), 'correct', 15, 30);
    expect(result.pointsAwarded).toBe(125);
    expect(result.state).toMatchObject({ lives: 3, completedQuestions: 1, score: 125 });
  });

  it.each(['wrong', 'timeout'] as const)('%s deducts one life and awards no points', (outcome) => {
    const result = applyAttempt(createLevelState(1), outcome, 0, 30);
    expect(result.pointsAwarded).toBe(0);
    expect(result.state).toMatchObject({ lives: 2, completedQuestions: 0, score: 0 });
  });

  it('clears the level after the third correct answer', () => {
    const before = { ...createLevelState(2), completedQuestions: 2, score: 250 };
    expect(applyAttempt(before, 'correct', 0, 28).state).toMatchObject({
      completedQuestions: 3, score: 350, phase: 'cleared',
    });
  });

  it('restarts current level progress when the last life is lost', () => {
    const before = { ...createLevelState(3), lives: 1, completedQuestions: 2, score: 260 };
    expect(applyAttempt(before, 'wrong', 0, 26).state).toEqual(createLevelState(3));
  });
});
