import { test, expect } from '@playwright/test';

test('eventsWithOP renders events table', async ({ page }) => {
  await page.goto('/testcases/eventsWithOP.html');
  const table = page.locator('.tsi-eventsTable').first();
  await table.waitFor({ state: 'visible', timeout: 10000 });
  await expect(table).toBeVisible();
});