import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart, openEllipsis } from './_behaviorUtils';

test('heatmap to line and back conversion', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/testcases/heatmapToLinechart.html');
  await waitForSdk(page);

  await ensureChart(page, 'svg.tsi-heatmapSVG');

  // Convert to line
  await openEllipsis(page);
  await page.getByText(/convert to linechart/i).click();
  const line = await ensureChart(page, 'svg.tsi-lineChartSVG');

  // Assert line visible now
  await expect(line).toBeVisible();

  // Convert back
  await openEllipsis(page);
  await page.getByText(/convert to heatmap/i).click();
  await ensureChart(page, 'svg.tsi-heatmapSVG');

  // The old line svg should be gone
  expect(await page.locator('svg.tsi-lineChartSVG').count()).toBe(0);

  expect(errors, 'No runtime errors during conversion loop').toHaveLength(0);
});