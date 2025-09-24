import { test, expect } from '@playwright/test';

test('availability bad warm data chart renders', async ({ page }) => {
  await page.goto('/testcases/availability/badWarmData.html');
  await expect(page.locator('#availability')).toBeVisible();
  await expect(page.locator('#availability svg.tsi-lineChartSVG').first()).toBeVisible();
});