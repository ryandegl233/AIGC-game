import type { DisplayAnalysis } from '../state/analysis-service';
import type { LevelConfig } from '../game/level-config';

export function startTemplate(): string {
  return `
    <main class="screen screen-start">
      <div class="stage-frame stage-frame-start" aria-labelledby="game-title">
        <div class="ornament ornament-top" aria-hidden="true">❦ · ♩ · 𝄞 · ♩ · ❦</div>
        <p class="kicker">一场跨越三百年的音乐史冒险</p>
        <h1 id="game-title"><span>金色谱号</span><small>古典音乐闯关</small></h1>
        <p class="lead">在倒计时结束前，操控金色高音谱号跃上正确答案的平台。</p>
        <div class="start-actions">
          <button class="button button-primary" data-action="start">开始第一乐章</button>
          <button class="button button-quiet" data-action="levels">选择关卡</button>
          <button class="button button-quiet" data-action="settings">设置</button>
        </div>
        <p class="controls-note">移动 A D 或方向键 · 跳跃 W / ↑ / 空格 · 暂停 Esc</p>
        <div class="ornament ornament-bottom" aria-hidden="true">⚜ · ❦ · ⚜</div>
      </div>
    </main>`;
}

export function levelSelectTemplate(levels: readonly LevelConfig[], unlockedLevel: number): string {
  return `
    <main class="screen screen-menu">
      <section class="menu-panel" aria-labelledby="level-title">
        <button class="back-button" data-action="back" aria-label="返回主菜单">← 返回</button>
        <p class="kicker">九个乐章</p><h1 id="level-title">选择音乐史关卡</h1>
        <div class="level-grid">
          ${levels.map((level) => {
            const locked = level.id > unlockedLevel;
            return `<button class="level-card" data-level="${level.id}" ${locked ? 'disabled' : ''}>
              <span class="level-number">${String(level.id).padStart(2, '0')}</span>
              <strong>${level.title}</strong><small>${level.dateLabel}</small>
              <span class="level-status">${locked ? '尚未解锁' : `每题 ${level.timeLimit} 秒`}</span>
            </button>`;
          }).join('')}
        </div>
      </section>
    </main>`;
}

export function gameTemplate(): string {
  return `
    <main class="screen screen-game">
      <header class="game-hud">
        <div class="hud-block hud-left"><span data-hud="level">第一乐章</span><strong data-hud="question">题目 1/3</strong><small class="now-playing" data-now-playing>正在演奏：准备乐谱…</small></div>
        <div class="hud-timer" data-hud="timer" aria-live="polite">00:30</div>
        <div class="hud-block hud-right"><span data-hud="lives">♥ ♥ ♥</span><strong data-hud="score">0000</strong></div>
      </header>
      <section class="question-ribbon" aria-live="polite">
        <span class="question-label">羽管键琴之问</span>
        <h1 data-question>正在翻开乐谱档案…</h1>
      </section>
      <div class="game-stage">
        <div class="game-mount" data-game-mount></div>
        <div class="answer-grid-guide" data-answer-grid aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
      <nav class="touch-controls" aria-label="触屏游戏控制">
        <button data-touch-control="left" aria-label="向左移动">←</button>
        <button data-touch-control="jump" aria-label="跳跃">↑</button>
        <button data-touch-control="right" aria-label="向右移动">→</button>
      </nav>
      <div class="status-line" data-status aria-live="polite">观察平台节奏，准备后开始。</div>
      <div class="modal-layer" data-modal-layer></div>
    </main>`;
}

export interface AnalysisView extends DisplayAnalysis {
  verdict: string;
}

export function analysisTemplate(analysis: AnalysisView): string {
  return `
    <section class="scroll-dialog" role="dialog" aria-modal="true" aria-live="polite" aria-labelledby="analysis-title">
      <div class="scroll-finial" aria-hidden="true">❦</div>
      <p class="verdict">${analysis.verdict}</p>
      <h2 id="analysis-title">${analysis.correctAnswer}</h2>
      <div class="analysis-copy"><p>${analysis.reason}</p><p>${analysis.misconception}</p><p>${analysis.context}</p></div>
      <blockquote>记忆提示：${analysis.memoryTip}</blockquote>
      <span class="source-badge">${analysis.source === 'ai' ? 'DeepSeek 乐师解析' : '离线乐谱档案'}</span>
      <button class="button button-primary" data-action="continue">继续下一乐句</button>
    </section>`;
}

export function pauseTemplate(): string {
  return `<section class="small-dialog" role="dialog" aria-modal="true" aria-labelledby="pause-title">
    <p class="kicker">休止符</p><h2 id="pause-title">演奏已暂停</h2>
    <button class="button button-primary" data-action="resume">继续演奏</button>
    <button class="button button-quiet" data-action="exit-level">返回关卡选择</button>
  </section>`;
}

export function readyTemplate(): string {
  return `<section class="ready-card" role="dialog" aria-label="准备开始">
    <span>平台预演完成</span><button class="button button-primary" data-action="begin-run">开始跑酷</button>
  </section>`;
}

export function levelCompleteTemplate(level: LevelConfig, score: number): string {
  return `<section class="small-dialog" role="dialog" aria-modal="true" aria-labelledby="complete-title">
    <p class="kicker">乐章终止式</p><h2 id="complete-title">${level.title} 通关</h2>
    <p>本关得分 <strong>${score}</strong></p>
    <button class="button button-primary" data-action="level-menu">返回关卡选择</button>
  </section>`;
}
