import type { Question } from '../../shared/question-schema';
import type { LevelConfig } from '../game/level-config';
import { getLevelConfig } from '../game/level-config';
import type { MechanicLifecycle } from '../game/mechanics';
import type { DisplayAnalysis } from './analysis-service';
import { applyAttempt, createLevelState, type AttemptOutcome, type LevelState } from './game-rules';
import type { SaveData } from './save-store';
import type { AnalysisView } from '../ui/templates';
import type { HudState } from '../ui/hud';

export type GamePhase =
  | 'idle' | 'loading' | 'preview' | 'ready' | 'running'
  | 'analysis' | 'paused' | 'level-cleared' | 'disposed';

interface UiPort {
  updateHud(state: HudState): void;
  showQuestion(question: Question): void;
  setStatus(message: string): void;
  showReady(onStart: () => void): void;
  showAnalysis(analysis: AnalysisView, onContinue: () => void): void;
  showLevelComplete(level: LevelConfig, score: number, onMenu?: () => void): void;
  closeModal(): void;
  showPause(onResume: () => void, onExit: () => void): void;
}

interface ScenePort {
  presentQuestion(question: Question, offsets: readonly [number, number, number]): void;
  setRunning(running: boolean): void;
}

interface QuestionServicePort {
  next(
    levelId: number, era: string, difficulty: number,
    excludedIds: readonly string[], excludedPrompts: readonly string[],
  ): Promise<Question>;
}

interface AnalysisServicePort {
  get(request: { question: Question; selectedIndex: number }): Promise<DisplayAnalysis>;
}

interface SaveStorePort {
  load(): SaveData;
  save(data: SaveData): void;
}

interface ClockPort {
  setInterval(callback: () => void, milliseconds: number): unknown;
  clearInterval(handle: unknown): void;
}

export interface ControllerDependencies {
  ui: UiPort;
  scene: ScenePort;
  questionService: QuestionServicePort;
  analysisService: AnalysisServicePort;
  saveStore: SaveStorePort;
  createMechanic(level: LevelConfig): MechanicLifecycle;
  clock?: ClockPort;
  onExitLevel?: () => void;
}

const browserClock: ClockPort = {
  setInterval: (callback, milliseconds) => window.setInterval(callback, milliseconds),
  clearInterval: (handle) => window.clearInterval(handle as number),
};

export class GameController {
  phase: GamePhase = 'idle';
  secondsRemaining = 0;
  levelState: LevelState = createLevelState(1);

  private level = getLevelConfig(1);
  private question?: Question;
  private mechanic?: MechanicLifecycle;
  private timerHandle?: unknown;
  private lastOutcome?: AttemptOutcome;
  private excludedIds: string[] = [];
  private excludedPrompts: string[] = [];

  constructor(private readonly dependencies: ControllerDependencies) {}

  async startLevel(levelId: number): Promise<void> {
    this.level = getLevelConfig(levelId);
    this.levelState = createLevelState(levelId);
    this.excludedIds = [];
    this.excludedPrompts = [];
    await this.prepareQuestion(true);
  }

  startAttempt(): void {
    if (this.phase !== 'ready') return;
    this.phase = 'running';
    this.dependencies.ui.closeModal();
    this.dependencies.ui.setStatus('演奏开始：跳上代表正确答案的平台。');
    this.mechanic?.start();
    this.dependencies.scene.setRunning(true);
    this.startTimer();
  }

  async selectAnswer(selectedIndex: number): Promise<void> {
    if (this.phase !== 'running' || !this.question) return;
    const outcome: AttemptOutcome = selectedIndex === this.question.correctIndex ? 'correct' : 'wrong';
    await this.finishAttempt(outcome, selectedIndex);
  }

  pause(): void {
    if (this.phase !== 'running') return;
    this.stopMotionAndTimer();
    this.phase = 'paused';
    this.dependencies.ui.showPause(() => this.resume(), () => this.exitLevel());
  }

  resume(): void {
    if (this.phase !== 'paused') return;
    this.dependencies.ui.closeModal();
    this.phase = 'running';
    this.dependencies.scene.setRunning(true);
    this.mechanic?.start();
    this.startTimer();
  }

  dispose(): void {
    this.stopMotionAndTimer();
    this.phase = 'disposed';
  }

  private async prepareQuestion(loadNew: boolean): Promise<void> {
    this.stopMotionAndTimer();
    this.phase = 'loading';
    this.dependencies.ui.setStatus(loadNew ? '正在请乐师准备下一道题…' : '重新排列答案平台…');

    if (loadNew || !this.question) {
      this.question = await this.dependencies.questionService.next(
        this.level.id,
        this.level.era,
        this.level.difficulty,
        this.excludedIds,
        this.excludedPrompts,
      );
      this.excludedIds.push(this.question.id);
      this.excludedPrompts.push(this.question.prompt);
    }

    this.dependencies.ui.showQuestion(this.question);
    const offsets = this.retryOffsets();
    this.dependencies.scene.presentQuestion(this.question, offsets);
    this.mechanic = this.dependencies.createMechanic(this.level);
    this.secondsRemaining = this.level.timeLimit;
    this.updateHud();
    this.phase = 'preview';
    this.dependencies.ui.setStatus('平台正在预演一个完整乐句，请观察节奏。');
    await this.mechanic.preview();
    if (this.isDisposed()) return;
    this.phase = 'ready';
    this.dependencies.ui.setStatus('预演完成，准备好后开始跑酷。');
    this.dependencies.ui.showReady(() => this.startAttempt());
  }

  private async finishAttempt(outcome: AttemptOutcome, selectedIndex: number): Promise<void> {
    if (!this.question) return;
    this.stopMotionAndTimer();
    this.lastOutcome = outcome;
    const result = applyAttempt(
      this.levelState,
      outcome,
      this.secondsRemaining,
      this.level.timeLimit,
    );
    this.levelState = result.state;
    this.updateHud();
    this.persistProgress();

    const analysis = await this.dependencies.analysisService.get({
      question: this.question,
      selectedIndex,
    });
    this.phase = 'analysis';
    this.dependencies.ui.showAnalysis({
      ...analysis,
      verdict: outcome === 'correct' ? '回答正确' : outcome === 'timeout' ? '本乐句超时' : '答案不正确',
    }, () => { void this.continueAfterAnalysis(); });
  }

  private async continueAfterAnalysis(): Promise<void> {
    this.dependencies.ui.closeModal();
    if (this.lastOutcome === 'correct' && this.levelState.phase === 'cleared') {
      this.phase = 'level-cleared';
      this.persistProgress(true);
      this.dependencies.ui.showLevelComplete(
        this.level,
        this.levelState.score,
        () => this.exitLevel(),
      );
      return;
    }
    await this.prepareQuestion(this.lastOutcome === 'correct');
  }

  private startTimer(): void {
    if (this.timerHandle !== undefined) return;
    this.timerHandle = (this.dependencies.clock ?? browserClock).setInterval(() => {
      if (this.phase !== 'running') return;
      this.secondsRemaining = Math.max(0, this.secondsRemaining - 1);
      this.updateHud();
      if (this.secondsRemaining === 0 && this.question) {
        const wrongIndex = (this.question.correctIndex + 1) % 3;
        void this.finishAttempt('timeout', wrongIndex);
      }
    }, 1_000);
  }

  private stopMotionAndTimer(): void {
    this.dependencies.scene.setRunning(false);
    this.mechanic?.stop();
    if (this.timerHandle !== undefined) {
      (this.dependencies.clock ?? browserClock).clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }

  private updateHud(): void {
    this.dependencies.ui.updateHud({
      levelTitle: `第 ${this.level.id} 乐章 · ${this.level.title}`,
      questionNumber: Math.min(3, this.levelState.completedQuestions + 1),
      completedQuestions: this.levelState.completedQuestions,
      secondsRemaining: this.secondsRemaining,
      lives: this.levelState.lives,
      score: this.levelState.score,
    });
  }

  private persistProgress(cleared = false): void {
    const save = this.dependencies.saveStore.load();
    const bestScores = cleared
      ? { ...save.bestScores, [this.level.id]: Math.max(save.bestScores[this.level.id] ?? 0, this.levelState.score) }
      : save.bestScores;
    const recentQuestionIds = this.question
      ? [...save.recentQuestionIds.filter((id) => id !== this.question?.id), this.question.id].slice(-36)
      : save.recentQuestionIds;
    this.dependencies.saveStore.save({
      ...save,
      unlockedLevel: cleared ? Math.min(9, Math.max(save.unlockedLevel, this.level.id + 1)) : save.unlockedLevel,
      bestScores,
      recentQuestionIds,
    });
  }

  private retryOffsets(): readonly [number, number, number] {
    if (this.lastOutcome === 'wrong' || this.lastOutcome === 'timeout') {
      const [first, second, third] = this.level.verticalOffsets;
      return [third, first, second];
    }
    return this.level.verticalOffsets;
  }

  private exitLevel(): void {
    this.dispose();
    this.dependencies.onExitLevel?.();
  }

  private isDisposed(): boolean {
    return this.phase === 'disposed';
  }
}
