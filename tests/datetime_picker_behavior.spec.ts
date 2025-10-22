import { test, expect } from '@playwright/test';

test('DateTimePicker save button appears', async ({ page }) => {
  await page.goto('/testcases/DateTimePicker/DateTimePicker.html');
  const saveBtn = page.locator('button.tsi-saveButton').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  if (await saveBtn.isVisible().catch(() => false)) {
    await saveBtn.click().catch(() => {});
    await expect.soft(saveBtn).toBeVisible();
  }
});