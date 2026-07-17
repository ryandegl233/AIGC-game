import Phaser from 'phaser';

import './styles.css';
import { AppShell } from './app-shell';
import { aiApi } from './api-client';
import { createGame } from './game/game';
import type { GameScene, AnswerSelectedPayload } from './game/GameScene';
import { LEVELS } from './game/level-config';
import { createPhaserMechanic } from './game/mechanics';
import { AnalysisService } from './state/analysis-service';
import { GameController } from './state/game-controller';
import { QuestionService } from './state/question-service';
import { SaveStore } from './state/save-store';
import { bindTouchControls } from './ui/touch-controls';

const rootElement = document.querySelector<HTMLDivElement>('#app');
if (!rootElement) throw new Error('Missing #app root');
const root: HTMLDivElement = rootElement;

const shell = new AppShell(root);
const saveStore = new SaveStore();
const questionService = new QuestionService(aiApi);
const analysisService = new AnalysisService(aiApi);
let game: Phaser.Game | undefined;
let controller: GameController | undefined;
let cleanupSession: (() => void) | undefined;

function disposeSession(): void {
  cleanupSession?.();
  cleanupSession = undefined;
  controller?.dispose();
  controller = undefined;
  game?.destroy(true);
  game = undefined;
}

function showMenu(): void {
  disposeSession();
  shell.renderStart(
    () => startLevel(1),
    showLevels,
    showSettings,
  );
}

function showLevels(): void {
  disposeSession();
  shell.renderLevelSelect(
    LEVELS,
    saveStore.load().unlockedLevel,
    (levelId) => startLevel(levelId),
    showMenu,
  );
}

function showSettings(): void {
  disposeSession();
  const save = saveStore.load();
  shell.renderSettings(save.settings, showMenu);
  root.querySelectorAll<HTMLInputElement>('[data-setting]').forEach((input) => {
    input.addEventListener('input', () => {
      const current = saveStore.load();
      const key = input.dataset.setting;
      const settings = { ...current.settings };
      if (key === 'masterVolume') settings.masterVolume = Number(input.value);
      if (key === 'effectsVolume') settings.effectsVolume = Number(input.value);
      if (key === 'reducedMotion') settings.reducedMotion = input.checked;
      saveStore.save({ ...current, settings });
    });
  });
}

function startLevel(levelId: number): void {
  disposeSession();
  shell.renderGame();
  game = createGame(shell.getGameMount());
  const activeGame = game;

  const boot = (scene: GameScene) => {
    const save = saveStore.load();
    scene.setReducedMotion(save.settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    controller = new GameController({
      ui: shell,
      scene,
      questionService,
      analysisService,
      saveStore,
      createMechanic: (level) => createPhaserMechanic(scene, scene.getAnswerPlatforms(), level.mechanic),
      onExitLevel: showLevels,
    });

    const answerHandler = ({ selectedIndex }: AnswerSelectedPayload) => {
      void controller?.selectAnswer(selectedIndex);
    };
    scene.events.on('answer-selected', answerHandler);
    const cleanupTouch = bindTouchControls(root, (control, active) => scene.setVirtualInput(control, active));
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        if (controller?.phase === 'paused') controller.resume();
        else controller?.pause();
      }
      if ((event.code === 'Space' || event.code === 'Enter') && controller?.phase === 'ready') {
        event.preventDefault();
        controller.startAttempt();
      }
    };
    const pauseHandler = () => controller?.pause();
    window.addEventListener('keydown', keyboardHandler);
    window.addEventListener('golden-clef:pause-requested', pauseHandler);
    cleanupSession = () => {
      cleanupTouch();
      scene.events.off('answer-selected', answerHandler);
      window.removeEventListener('keydown', keyboardHandler);
      window.removeEventListener('golden-clef:pause-requested', pauseHandler);
    };

    void controller.startLevel(levelId);
  };

  activeGame.events.once(Phaser.Core.Events.READY, () => {
    const scene = activeGame.scene.getScene('game') as GameScene | null;
    if (!scene) throw new Error('Phaser game scene was not registered');
    if (scene.isReady()) boot(scene);
    else scene.events.once(Phaser.Scenes.Events.CREATE, () => boot(scene));
  });
}

showMenu();
