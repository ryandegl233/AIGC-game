import type { Question } from '../shared/question-schema';
import type { LevelConfig } from './game/level-config';
import { updateHud, type HudState } from './ui/hud';
import {
  analysisTemplate,
  gameTemplate,
  levelSelectTemplate,
  pauseTemplate,
  readyTemplate,
  levelCompleteTemplate,
  startTemplate,
  type AnalysisView,
} from './ui/templates';
import { settingsTemplate } from './ui/settings';
import type { SaveData } from './state/save-store';

export class AppShell {
  private readonly visibilityHandler = () => {
    if (document.hidden) window.dispatchEvent(new CustomEvent('golden-clef:pause-requested'));
  };

  constructor(private readonly root: HTMLElement) {
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  renderStart(
    onStart: () => void,
    onLevels: () => void = () => undefined,
    onSettings: () => void = () => undefined,
  ): void {
    this.root.innerHTML = startTemplate();
    this.root.querySelector('[data-action="start"]')?.addEventListener('click', onStart);
    this.root.querySelector('[data-action="levels"]')?.addEventListener('click', onLevels);
    this.root.querySelector('[data-action="settings"]')?.addEventListener('click', onSettings);
  }

  renderLevelSelect(
    levels: readonly LevelConfig[],
    unlockedLevel: number,
    onSelect: (levelId: number) => void,
    onBack: () => void,
  ): void {
    this.root.innerHTML = levelSelectTemplate(levels, unlockedLevel);
    this.root.querySelector('[data-action="back"]')?.addEventListener('click', onBack);
    this.root.querySelectorAll<HTMLButtonElement>('[data-level]').forEach((button) => {
      button.addEventListener('click', () => onSelect(Number(button.dataset.level)));
    });
  }

  renderSettings(settings: SaveData['settings'], onBack: () => void): void {
    this.root.innerHTML = settingsTemplate(settings);
    this.root.querySelector('[data-action="back"]')?.addEventListener('click', onBack);
  }

  renderGame(): void {
    this.root.innerHTML = gameTemplate();
  }

  getGameMount(): HTMLElement {
    const mount = this.root.querySelector<HTMLElement>('[data-game-mount]');
    if (!mount) throw new Error('Game mount is unavailable');
    return mount;
  }

  updateHud(state: HudState): void {
    updateHud(this.root, state);
  }

  showQuestion(question: Question): void {
    const heading = this.root.querySelector<HTMLElement>('[data-question]');
    if (heading) heading.textContent = question.prompt;
  }

  setStatus(message: string): void {
    const status = this.root.querySelector<HTMLElement>('[data-status]');
    if (status) status.textContent = message;
  }

  showReady(onStart: () => void): void {
    const status = this.root.querySelector<HTMLElement>('[data-status]');
    if (!status) return;
    status.innerHTML = readyTemplate();
    status.querySelector('[data-action="begin-run"]')?.addEventListener('click', onStart, { once: true });
  }

  showAnalysis(analysis: AnalysisView, onContinue: () => void): void {
    const layer = this.modalLayer();
    layer.innerHTML = analysisTemplate(analysis);
    layer.classList.add('is-open');
    const button = layer.querySelector<HTMLButtonElement>('[data-action="continue"]');
    button?.addEventListener('click', onContinue, { once: true });
    button?.focus();
  }

  showPause(onResume: () => void, onExit: () => void): void {
    const layer = this.modalLayer();
    layer.innerHTML = pauseTemplate();
    layer.classList.add('is-open');
    const resume = layer.querySelector<HTMLButtonElement>('[data-action="resume"]');
    resume?.addEventListener('click', onResume, { once: true });
    layer.querySelector('[data-action="exit-level"]')?.addEventListener('click', onExit, { once: true });
    resume?.focus();
  }

  showLevelComplete(level: LevelConfig, score: number, onMenu: () => void = () => undefined): void {
    const layer = this.modalLayer();
    layer.innerHTML = levelCompleteTemplate(level, score);
    layer.classList.add('is-open');
    const button = layer.querySelector<HTMLButtonElement>('[data-action="level-menu"]');
    button?.addEventListener('click', onMenu, { once: true });
    button?.focus();
  }

  closeModal(): void {
    const layer = this.root.querySelector<HTMLElement>('[data-modal-layer]');
    if (layer) { layer.innerHTML = ''; layer.classList.remove('is-open'); }
  }

  destroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  private modalLayer(): HTMLElement {
    const layer = this.root.querySelector<HTMLElement>('[data-modal-layer]');
    if (!layer) throw new Error('Modal layer is unavailable');
    return layer;
  }
}
