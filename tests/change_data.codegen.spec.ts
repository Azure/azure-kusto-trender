import { test, expect } from '@playwright/test';

test('changeData smoke', async ({ page }) => {
  await page.goto('/testcases/changeData.html');
  const chart = page.locator('svg.tsi-lineChartSVG');
  await chart.waitFor({ state: 'visible', timeout: 10000 });

  // After ~5s the page re-renders with (near) empty data; chart container should remain.
  await page.waitForTimeout(6500);
  await expect(chart).toBeVisible();
});