import { test, expect } from '@playwright/test';

test('availability compact toggle shrinks height', async ({ page }) => {
  await page.goto('/testcases/availability/availabilityPersistentButton.html');
  const container = page.locator('#availability');
  await expect(container).toBeVisible();

  const before = parseInt((await container.evaluate(e => getComputedStyle(e).height)).replace('px',''), 10);

  await page.locator('#compact').check();
  await page.getByRole('button', { name: /render/i }).click();

  await expect
    .poll(async () => parseInt((await container.evaluate(e => getComputedStyle(e).height)).replace('px',''), 10),
      { timeout: 8000 })
    .toBeLessThan(before);
});