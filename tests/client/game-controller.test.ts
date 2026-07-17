import { describe, expect, it, vi } from 'vitest';

import { GameController, type ControllerDependencies } from '../../src/client/state/game-controller';
import { offlineQuestionBank } from '../../src/client/data/offline-bank';
import { createDefaultSave, type SaveData } from '../../src/client/state/save-store';

function createHarness() {
  const question = offlineQuestionBank[1]![0]!;
  let save = createDefaultSave();
  let tick: (() => void) | undefined;
  let continueAnalysis: (() => void) | undefined;
  const ui = {
    updateHud: vi.fn(), showQuestion: vi.fn(), setStatus: vi.fn(), showReady: vi.fn(),
    showAnalysis: vi.fn((_analysis, onContinue: () => void) => { continueAnalysis = onContinue; }),
    showLevelComplete: vi.fn(), closeModal: vi.fn(), showPause: vi.fn(),
  };
  const scene = { presentQuestion: vi.fn(), setRunning: vi.fn() };
  const mechanic = { preview: vi.fn(async () => undefined), start: vi.fn(), stop: vi.fn(), isRunning: vi.fn() };
  const audio = {
    startLevel: vi.fn(), startRun: vi.fn(), showAnalysis: vi.fn(), pause: vi.fn(),
    resume: vi.fn(), stop: vi.fn(), routePenalty: vi.fn(),
  };
  const dependencies: ControllerDependencies = {
    ui,
    scene,
    questionService: { next: vi.fn(async () => question) },
    analysisService: { get: vi.fn(async () => ({
      source: 'offline' as const, correctAnswer: question.options[0], reason: question.explanation,
      misconception: '容易混淆。', context: '早期巴洛克。', memoryTip: question.memoryTip,
    })) },
    saveStore: {
      load: () => save,
      save: (next: SaveData) => { save = next; },
    },
    createMechanic: () => mechanic,
    audio,
    clock: {
      setInterval: (callback) => { tick = callback; return 1; },
      clearInterval: () => { tick = undefined; },
    },
  };
  const controller = new GameController(dependencies);
  return {
    controller, dependencies, ui, scene, mechanic, audio, question,
    tick: () => tick?.(),
    continueAnalysis: () => continueAnalysis?.(),
    getSave: () => save,
  };
}

describe('GameController', () => {
  it('previews platforms and waits for readiness before starting the countdown', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);

    expect(harness.mechanic.preview).toHaveBeenCalledTimes(1);
    expect(harness.controller.phase).toBe('ready');
    expect(harness.scene.setRunning).not.toHaveBeenCalledWith(true);
    harness.tick();
    expect(harness.controller.secondsRemaining).toBe(34);

    harness.controller.startAttempt();
    expect(harness.scene.setRunning).toHaveBeenCalledWith(true);
    harness.tick();
    expect(harness.controller.secondsRemaining).toBe(33);
  });

  it('judges a correct platform locally and advances after analysis', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    harness.controller.startAttempt();
    await harness.controller.selectAnswer(harness.question.correctIndex);

    expect(harness.controller.levelState.completedQuestions).toBe(1);
    expect(harness.controller.phase).toBe('analysis');
    expect(harness.ui.showAnalysis).toHaveBeenCalledWith(
      expect.objectContaining({ verdict: '回答正确' }), expect.any(Function),
    );

    harness.continueAnalysis();
    await Promise.resolve();
    expect(harness.dependencies.questionService.next).toHaveBeenCalledTimes(2);
  });

  it('deducts a life for a wrong platform and retries the same question', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    harness.controller.startAttempt();
    await harness.controller.selectAnswer((harness.question.correctIndex + 1) % 3);

    expect(harness.controller.levelState.lives).toBe(2);
    harness.continueAnalysis();
    expect(harness.scene.presentQuestion).toHaveBeenCalledTimes(2);
    expect(harness.dependencies.questionService.next).toHaveBeenCalledTimes(1);
  });

  it('unlocks the next level after three correct answers', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    for (let index = 0; index < 3; index += 1) {
      harness.controller.startAttempt();
      await harness.controller.selectAnswer(harness.question.correctIndex);
      harness.continueAnalysis();
      await vi.waitFor(() => {
        expect(['ready', 'level-cleared']).toContain(harness.controller.phase);
      });
    }

    expect(harness.controller.phase).toBe('level-cleared');
    expect(harness.getSave().unlockedLevel).toBe(2);
    expect(harness.ui.showLevelComplete).toHaveBeenCalledTimes(1);
  });

  it('freezes and restores running play when paused', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    harness.controller.startAttempt();
    harness.controller.pause();
    expect(harness.controller.phase).toBe('paused');
    expect(harness.scene.setRunning).toHaveBeenLastCalledWith(false);
    harness.controller.resume();
    expect(harness.controller.phase).toBe('running');
    expect(harness.scene.setRunning).toHaveBeenLastCalledWith(true);
  });

  it('deducts three seconds for a route hazard without costing a life', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    harness.controller.startAttempt();

    harness.controller.applyRoutePenalty();

    expect(harness.controller.secondsRemaining).toBe(31);
    expect(harness.controller.levelState.lives).toBe(3);
    expect(harness.ui.setStatus).toHaveBeenLastCalledWith('撞上升号障碍：退回起点，扣除 3 秒。');
  });

  it('coordinates level music with running, analysis, pause, and route hazards', async () => {
    const harness = createHarness();
    await harness.controller.startLevel(1);
    harness.controller.startAttempt();
    harness.controller.applyRoutePenalty();
    harness.controller.pause();
    harness.controller.resume();
    await harness.controller.selectAnswer(harness.question.correctIndex);
    harness.controller.dispose();

    expect(harness.audio.startLevel).toHaveBeenCalledWith(1);
    expect(harness.audio.startRun).toHaveBeenCalledTimes(1);
    expect(harness.audio.routePenalty).toHaveBeenCalledTimes(1);
    expect(harness.audio.pause).toHaveBeenCalledTimes(1);
    expect(harness.audio.resume).toHaveBeenCalledTimes(1);
    expect(harness.audio.showAnalysis).toHaveBeenCalledWith(true);
    expect(harness.audio.stop).toHaveBeenCalled();
  });
});
