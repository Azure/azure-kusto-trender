import { test, expect } from '@playwright/test';

test('swimlane tester basic lane reassignment', async ({ page }) => {
  await page.goto('/testcases/swimLanes/swimLaneTester.html');
  await page.waitForLoadState('load');
  await page.waitForFunction(() => !!(window as any).KustoTrender, { timeout: 8000 }).catch(() => {});

  // Defensive overlay removal
  await page.evaluate(() => {
    ['webpack-dev-server-client-overlay', 'webpack-dev-server-overlay']
      .forEach(id => document.getElementById(id)?.remove());
  });

  const chartSvg = page.locator('svg.tsi-lineChartSVG').first();
  await chartSvg.waitFor({ state: 'visible', timeout: 15000 });

  // Presence of lane select controls is the distinguishing feature
  const laneSelect = page.locator('#group0Select');
  await expect(laneSelect).toBeVisible();

  // Capture current value and switch to a different one (if possible)
  const currentVal = await laneSelect.inputValue();
  const newVal = currentVal === '1' ? '2' : '1';
  await laneSelect.selectOption(newVal);

  // Small wait to allow re-render
  await page.waitForTimeout(500);

  // Chart still present (smoke behavior)
  await expect(chartSvg).toBeVisible();
  // Confirm the value actually changed
  await expect(laneSelect).toHaveValue(newVal);
});