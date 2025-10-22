import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart } from './_behaviorUtils';

test('linechart basic structure', async ({ page }) => {
  const errors = captureErrors(page);

  const response = await page.goto('/testcases/seriesLabels.html');
  expect(response).not.toBeNull();
  expect(response?.ok(), `Expected 2xx/304, got ${response?.status()}`).toBeTruthy();
  await expect(page).not.toHaveURL(/about:blank/);

  await waitForSdk(page);
  const svg = await ensureChart(page, 'svg.tsi-lineChartSVG');

  const firstLegendItem = page.locator('.tsi-legend .tsi-splitByLabel').first();
  await expect(firstLegendItem).toBeVisible();

  await expect(svg).toBeVisible();
  expect(errors).toHaveLength(0);
});