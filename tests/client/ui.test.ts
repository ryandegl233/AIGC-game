// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppShell } from '../../src/client/app-shell';
import { bindTouchControls } from '../../src/client/ui/touch-controls';

describe('AppShell', () => {
  const shells: AppShell[] = [];

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    shells.splice(0).forEach((shell) => shell.destroy());
  });

  const createShell = () => {
    const shell = new AppShell(document.querySelector('#app')!);
    shells.push(shell);
    return shell;
  };

  it('renders one accessible start heading and labeled action', () => {
    const shell = createShell();
    shell.renderStart(vi.fn());

    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('h1')?.textContent).toContain('金色谱号');
    expect(document.querySelector<HTMLButtonElement>('[data-action="start"]')?.textContent).toContain('开始');
  });

  it('renders a centered HUD, game mount, and three touch controls', () => {
    const shell = createShell();
    shell.renderGame();

    expect(document.querySelector('[data-hud="timer"]')).not.toBeNull();
    expect(document.querySelector('[data-game-mount]')).not.toBeNull();
    expect(document.querySelector('[data-answer-grid]')).not.toBeNull();
    expect(document.querySelectorAll<HTMLButtonElement>('[data-touch-control]')).toHaveLength(3);
    expect(document.querySelector('[aria-label="向左移动"]')).not.toBeNull();
    expect(document.querySelector('[aria-label="跳跃"]')).not.toBeNull();
  });

  it('shows the current classical work in the game HUD', () => {
    const shell = createShell();
    shell.renderGame();
    shell.showNowPlaying({ composer: '莫扎特', title: '《小夜曲》K.525·主题编曲' });

    expect(document.querySelector('[data-now-playing]')?.textContent)
      .toBe('正在演奏：莫扎特 · 《小夜曲》K.525·主题编曲');
  });

  it('announces analysis and moves focus to the continue button', () => {
    const shell = createShell();
    shell.renderGame();
    shell.showAnalysis({
      verdict: '回答正确', correctAnswer: '蒙特威尔第', reason: '他创作了《奥菲欧》。',
      misconception: '维瓦尔第属于更晚阶段。', context: '作品于1607年首演。',
      memoryTip: '奥菲欧属于蒙特威尔第。', source: 'offline',
    }, vi.fn());

    const dialog = document.querySelector('[role="dialog"]');
    const button = document.querySelector<HTMLButtonElement>('[data-action="continue"]');
    expect(dialog?.getAttribute('aria-live')).toBe('polite');
    expect(document.activeElement).toBe(button);
  });

  it('dispatches a pause request when the page becomes hidden', () => {
    const listener = vi.fn();
    window.addEventListener('golden-clef:pause-requested', listener);
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    createShell();

    document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('touch controls', () => {
  it('reports press and release for held movement', () => {
    document.body.innerHTML = '<button data-touch-control="left"></button>';
    const onChange = vi.fn();
    const cleanup = bindTouchControls(document.body, onChange);
    const button = document.querySelector<HTMLButtonElement>('button')!;

    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    button.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(onChange).toHaveBeenNthCalledWith(1, 'left', true);
    expect(onChange).toHaveBeenNthCalledWith(2, 'left', false);
    cleanup();
  });
});
