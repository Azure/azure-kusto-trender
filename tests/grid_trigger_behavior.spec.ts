import { test, expect } from '@playwright/test';

test('grid trigger show/hide keeps chart visible', async ({ page }) => {
  await page.goto('/testcases/Accessibility/gridTrigger.html');
  const chartSvg = page.locator('svg.tsi-lineChartSVG, canvas').first();
  await chartSvg.waitFor({ state: 'visible', timeout: 10000 });

  const showBtn = page.getByRole('button', { name: /show grid/i });
  const hideBtn = page.getByRole('button', { name: /hide grid/i });
  if (await showBtn.isVisible().catch(() => false)) await showBtn.click();
  if (await hideBtn.isVisible().catch(() => false)) await hideBtn.click();
  await expect.soft(chartSvg).toBeVisible();
});