import { test, expect } from '@playwright/test';

test('grid trigger show/hide', async ({ page }) => {
  await page.goto('/testcases/Accessibility/gridTrigger.html');
  const chart = page.getByRole('img', { name: /line chart/i });
  await expect(chart).toBeVisible();
  const show = page.getByRole('button', { name: /show grid/i });
  const hide = page.getByRole('button', { name: /hide grid/i });
  await show.click();
  await hide.click();
  await expect.soft(chart).toBeVisible();
});