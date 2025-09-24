import { test, expect } from '@playwright/test';

test('two grids render', async ({ page }) => {
  await page.goto('/testcases/Accessibility/Grid.html');
  await expect(page.locator('#chart1')).toBeVisible();
  await expect(page.locator('#chart2')).toBeVisible();

  await page.locator('#chart2').scrollIntoViewIfNeeded();
  const grids = page.locator('.tsi-gridComponent');
  await expect(grids).toHaveCount(2);
  await expect(grids.nth(0).locator('.tsi-gridContentRow').first()).toBeVisible();
  await expect(grids.nth(1).locator('.tsi-gridContentRow').first()).toBeVisible();
});