import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart, openEllipsis } from './_behaviorUtils';

test('heatmap twin charts basic interactions', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/testcases/heatmap.html');
  await waitForSdk(page);

  const first = await ensureChart(page, '#chart4 svg.tsi-heatmapSVG');
  const second = await ensureChart(page, '#chart5 svg.tsi-heatmapSVG');

  // Open ellipsis on first if present
  await openEllipsis(page);

  // Click inside (interaction smoke)
  await page.mouse.click((await first.boundingBox())!.x + 10, (await first.boundingBox())!.y + 10);

  await expect(first).toBeVisible();
  await expect(second).toBeVisible();
  expect(errors).toHaveLength(0);
});