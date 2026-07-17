import type { SaveData } from '../state/save-store';

export function settingsTemplate(settings: SaveData['settings']): string {
  return `<main class="screen screen-menu"><section class="menu-panel settings-panel" aria-labelledby="settings-title">
    <button class="back-button" data-action="back" aria-label="返回主菜单">← 返回</button>
    <p class="kicker">调音</p><h1 id="settings-title">演奏设置</h1>
    <label>主音量 <input type="range" data-setting="masterVolume" min="0" max="1" step="0.05" value="${settings.masterVolume}"></label>
    <label>效果音量 <input type="range" data-setting="effectsVolume" min="0" max="1" step="0.05" value="${settings.effectsVolume}"></label>
    <label class="check-row"><input type="checkbox" data-setting="reducedMotion" ${settings.reducedMotion ? 'checked' : ''}> 减少装饰动态效果</label>
    <p class="settings-note">跑酷所需的平台移动仍会保留，金粉、浮动和旋转将被关闭。</p>
  </section></main>`;
}
