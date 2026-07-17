export type AttemptOutcome = 'correct' | 'wrong' | 'timeout';
export type LevelPhase = 'playing' | 'cleared';

export interface LevelState {
  levelId: number;
  lives: number;
  completedQuestions: number;
  score: number;
  phase: LevelPhase;
}

export interface AttemptResult {
  state: LevelState;
  pointsAwarded: number;
}

export function createLevelState(levelId: number): LevelState {
  return { levelId, lives: 3, completedQuestions: 0, score: 0, phase: 'playing' };
}

export function applyAttempt(
  state: LevelState,
  outcome: AttemptOutcome,
  secondsRemaining: number,
  timeLimit: number,
): AttemptResult {
  if (state.phase === 'cleared') return { state, pointsAwarded: 0 };

  if (outcome === 'correct') {
    const ratio = timeLimit > 0 ? Math.min(1, Math.max(0, secondsRemaining / timeLimit)) : 0;
    const pointsAwarded = 100 + Math.round(50 * ratio);
    const completedQuestions = state.completedQuestions + 1;
    return {
      pointsAwarded,
      state: {
        ...state,
        completedQuestions,
        score: state.score + pointsAwarded,
        phase: completedQuestions >= 3 ? 'cleared' : 'playing',
      },
    };
  }

  const lives = state.lives - 1;
  if (lives <= 0) return { state: createLevelState(state.levelId), pointsAwarded: 0 };
  return { state: { ...state, lives }, pointsAwarded: 0 };
}
