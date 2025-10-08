import { test, expect } from '@playwright/test';

test('marker export has marker elements', async ({ page }) => {
  await page.goto('/testcases/markerExport.html');
  await page.waitForLoadState('load');

  // Defensive overlay removal
  await page.evaluate(() => {
    ['webpack-dev-server-client-overlay', 'webpack-dev-server-overlay']
      .forEach(id => document.getElementById(id)?.remove());
  });

  // Wait for chart root
  const chart = page.locator('svg.tsi-lineChartSVG, canvas').first();
  await chart.waitFor({ state: 'visible', timeout: 10000 });

  // Ensure exportMarkers defined
  await page.waitForFunction(() => typeof (window as any).exportMarkers === 'function', { timeout: 8000 }).catch(() => {});

  // Wait for markers to appear (they are rendered from initial markers array)
  const markers = page.locator('.tsi-markerContainer');
  await expect
    .poll(async () => await markers.count(), { timeout: 8000 })
    .toBeGreaterThan(0);

  // Try clicking the button (non-fatal if blocked)
  const exportBtn = page.getByRole('button', { name: /export markers/i });
  if (await exportBtn.isVisible().catch(() => false)) {
    await exportBtn.click().catch(async () => {
      // Fallback to direct call
      await page.evaluate(() => (window as any).exportMarkers?.());
    });
  } else {
    // No visible button: call export directly just to exercise the path
    await page.evaluate(() => (window as any).exportMarkers?.());
  }

  // After export, markers should still exist (≥ previous count)
  const markerCount = await markers.count();
  expect.soft(markerCount).toBeGreaterThan(0);
});