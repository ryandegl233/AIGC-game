export interface HudState {
  levelTitle: string;
  questionNumber: number;
  completedQuestions: number;
  secondsRemaining: number;
  lives: number;
  score: number;
}

export function updateHud(root: HTMLElement, state: HudState): void {
  const set = (selector: string, value: string) => {
    const node = root.querySelector<HTMLElement>(selector);
    if (node) node.textContent = value;
  };
  set('[data-hud="level"]', state.levelTitle);
  set('[data-hud="question"]', `题目 ${state.questionNumber}/3`);
  set('[data-hud="timer"]', `00:${String(Math.max(0, state.secondsRemaining)).padStart(2, '0')}`);
  set('[data-hud="lives"]', Array.from({ length: 3 }, (_, index) => index < state.lives ? '♥' : '♡').join(' '));
  set('[data-hud="score"]', String(state.score).padStart(4, '0'));
}
