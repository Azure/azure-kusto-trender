import { test, expect } from '@playwright/test';

// Lightweight sanitize smoke: stub heavy script to keep run fast & deterministic.
test('sanitize page smoke', async ({ page }) => {
  test.setTimeout(45000);

  // Stub heavy sanitize.js
  await page.route('**/Sanitization/sanitize.js', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'window.getBadString = function(){ return "Sanitized"; };'
    });
  });

  await page.goto('/testcases/Sanitization/sanitize.html?light=1');

  // Host exists
  const host = page.locator('#chart1');
  await expect(host).toHaveCount(1);

  // Brief settle
  await page.waitForTimeout(500);

  // Optional soft chart check
  const anyChart = page.locator('svg.tsi-lineChartSVG, svg.tsi-heatmapSVG, svg.tsi-scatterPlotSVG').first();
  if (await anyChart.count()) {
    await expect.soft(anyChart, 'A chart svg should become visible').toBeVisible({ timeout: 5000 });
  }
});
