import { test, expect } from '@playwright/test';

test('dateTimePicker composite renders and save clickable', async ({ page }) => {
  await page.goto('/testcases/DateTimePicker/DateTimePicker.html');
  await expect(page.locator('#dtp')).toBeVisible();
  await expect(page.locator('#sdtp')).toBeVisible();
  await page.locator('#dtp').getByRole('button', { name: /save/i }).click();
});