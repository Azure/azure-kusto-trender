import { test, expect } from '@playwright/test';

test('availability bad input blank chart is expected', async ({ page }) => {
  await page.goto('/testcases/availability/availabilityBadInput.html');
  await expect(page.locator('#availability')).toBeVisible();
  await expect(page.locator('#availability svg.tsi-lineChartSVG')).toHaveCount(0);
});