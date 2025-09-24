import { test, expect } from '@playwright/test';

test('tooltip basic render', async ({ page }) => {
  await page.goto('/testcases/tooltipTest.html');
  const chartImg = page.getByRole('img', { name: /line chart/i });
  await expect(chartImg).toBeVisible();
});