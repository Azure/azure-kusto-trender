import { test, expect } from '@playwright/test';

test('changeData re-render keeps chart visible', async ({ page }) => {
  await page.goto('/testcases/changeData.html');
  const chart = page.locator('svg.tsi-lineChartSVG').first();
  await chart.waitFor({ state: 'visible', timeout: 10000 });
  // Wait slightly past the 5s re-render timer
  await page.waitForTimeout(6000);
  await expect(chart).toBeVisible();
});