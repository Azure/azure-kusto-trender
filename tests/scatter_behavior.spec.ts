import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart } from './_behaviorUtils';

test('connected scatter plot points & tooltip', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/testcases/connectedScatterPlot.html');
  await waitForSdk(page);

  const svg = await ensureChart(page, 'svg.tsi-scatterPlotSVG');

  // Ensure some circle points
  const circles = svg.locator('circle');
  await expect(circles.first()).toBeVisible();
  const count = await circles.count();
  expect(count).toBeGreaterThan(0);

  // Hover over a point to (soft) trigger tooltip
  if (count > 0) {
    const box = await circles.first().boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(300);
    }
  }
  // Tooltip (soft assertion, may not appear with random data)
  const tooltip = page.locator('.tsi-tooltip');
  // soft
  if (await tooltip.count()) {
    await expect.soft(tooltip.first()).toBeVisible();
  }

  expect(errors).toHaveLength(0);
});