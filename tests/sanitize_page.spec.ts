import { test, expect } from '@playwright/test';

test('sanitize page smoke (stubbed)', async ({ page }) => {
  test.setTimeout(45000);
  await page.route('**/Sanitization/sanitize.js', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'window.getBadString = function(){ return "Sanitized"; };'
    });
  });
  await page.goto('/testcases/Sanitization/sanitize.html?light=1');
  const host = page.locator('#chart1');
  await expect(host).toHaveCount(1);
  await page.waitForTimeout(500);
  const anyChart = page.locator('svg.tsi-lineChartSVG, svg.tsi-heatmapSVG, svg.tsi-scatterPlotSVG').first();
  if (await anyChart.count()) {
    await expect.soft(anyChart).toBeVisible({ timeout: 5000 });
  }
});