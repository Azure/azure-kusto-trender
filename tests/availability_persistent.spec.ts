import { test, expect } from '@playwright/test';

test('availability persistent compact toggle', async ({ page }) => {
  await page.goto('/testcases/availability/availabilityPersistentButton.html');
  await page.waitForLoadState('load');
  const container = page.locator('#availability');
  await expect(container).toBeVisible();
  await page.locator('#compact').check();
  await page.getByRole('button', { name: /render/i }).click();
  await expect
    .poll(async () => await container.evaluate(e => getComputedStyle(e).height), { timeout: 8000 })
    .toBe('76px');
});