import { expect, test } from '@playwright/test';

test('navigates the Baroque menu and shows nine ordered levels', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /金色谱号/ })).toBeVisible();
  await page.getByRole('button', { name: '选择关卡' }).click();
  await expect(page.getByRole('heading', { name: '选择音乐史关卡' })).toBeVisible();
  await expect(page.locator('[data-level]')).toHaveCount(9);
  await expect(page.locator('[data-level="1"]')).toBeEnabled();
  await expect(page.locator('[data-level="2"]')).toBeDisabled();
});

test('starts fully offline, waits for readiness, and pauses safely', async ({ page }) => {
  page.on('pageerror', (error) => console.log('PAGE_ERROR', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') console.log('BROWSER_ERROR', message.text());
  });
  await page.goto('/');
  await page.getByRole('button', { name: '开始第一乐章' }).click();

  await expect(page.locator('[data-question]')).not.toContainText('正在翻开乐谱档案');
  await expect(page.getByRole('button', { name: '开始跑酷' })).toBeVisible();
  if (process.env.CAPTURE_QA === '1') {
    await page.screenshot({ path: 'output/playwright/gameplay-ready.png', fullPage: true });
  }
  await page.getByRole('button', { name: '开始跑酷' }).click();
  await expect(page.locator('[data-status]')).toContainText('演奏开始');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: '演奏已暂停' })).toBeVisible();
  await page.getByRole('button', { name: '继续演奏' }).click();
  await expect(page.getByRole('heading', { name: '演奏已暂停' })).toBeHidden();
});

test('shows holdable touch controls on a mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/');
  await page.getByRole('button', { name: '开始第一乐章' }).click();
  await expect(page.getByRole('button', { name: '向左移动' })).toBeVisible();
  await expect(page.getByRole('button', { name: '向右移动' })).toBeVisible();
  await expect(page.getByRole('button', { name: '跳跃' })).toBeVisible();
});

test('lands the golden clef on an answer platform and opens analysis', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.getByRole('button', { name: '开始第一乐章' }).click();
  await page.getByRole('button', { name: '开始跑酷' }).click();
  await page.waitForTimeout(300);

  await page.keyboard.down('ArrowLeft');
  await page.keyboard.down('w');
  await page.waitForTimeout(120);
  await page.keyboard.up('w');
  await page.waitForTimeout(850);
  await page.keyboard.up('ArrowLeft');

  await expect(page.locator('.scroll-dialog')).toBeVisible({ timeout: 4_000 });
  await expect(page.locator('.scroll-dialog')).toContainText(/回答正确|答案不正确/);
});
