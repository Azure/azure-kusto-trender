import { test, expect } from '@playwright/test';

test('availability ADX shows chart when authed else login link', async ({ page }) => {
  await page.goto('/testcases/availability/availabilityAdx.html');
  const host = page.locator('#availability');
  await expect(host).toBeVisible();
  const chartSvg = host.locator('svg.tsi-lineChartSVG');
  if (await chartSvg.first().isVisible().catch(() => false)) return;
  await expect(page.getByRole('link', { name: /^Log in$/i })).toBeVisible();
});