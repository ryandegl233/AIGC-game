import type Phaser from 'phaser';

import './styles.css';
import { AudioDirector } from './audio/audio-director';
import { BrowserAudioEngine } from './audio/browser-audio-engine';
import { getMusicPiece } from './audio/music-catalog';
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
const audioDirector = new AudioDirector(new BrowserAudioEngine());
audioDirector.configure(saveStore.load().settings);
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
      audioDirector.configure(settings);
    });
  });
}

function startLevel(levelId: number): void {
  disposeSession();
  void audioDirector.unlock();
  shell.renderGame();
  shell.showNowPlaying(getMusicPiece(levelId));
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
      audio: audioDirector,
      createMechanic: (level) => createPhaserMechanic(scene, scene.getRoutePlatforms(), level.mechanic),
      onExitLevel: showLevels,
    });

    const answerHandler = ({ selectedIndex }: AnswerSelectedPayload) => {
      void controller?.selectAnswer(selectedIndex);
    };
    scene.events.on('answer-selected', answerHandler);
    const penaltyHandler = () => controller?.applyRoutePenalty();
    scene.events.on('route-penalty', penaltyHandler);
    const jumpHandler = () => audioDirector.jump();
    const landHandler = () => audioDirector.land();
    scene.events.on('player-jump', jumpHandler);
    scene.events.on('player-land', landHandler);
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
      scene.events.off('route-penalty', penaltyHandler);
      scene.events.off('player-jump', jumpHandler);
      scene.events.off('player-land', landHandler);
      window.removeEventListener('keydown', keyboardHandler);
      window.removeEventListener('golden-clef:pause-requested', pauseHandler);
    };

    void controller.startLevel(levelId);
  };

  const bootWhenSceneReady = () => {
    if (game !== activeGame) return;
    const scene = activeGame.scene.getScene('game') as GameScene | null;
    if (!scene || !scene.isReady()) {
      window.requestAnimationFrame(bootWhenSceneReady);
      return;
    }
    boot(scene);
  };
  window.requestAnimationFrame(bootWhenSceneReady);
}

showMenu();
