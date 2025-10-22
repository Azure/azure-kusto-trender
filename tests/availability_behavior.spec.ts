import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart, openEllipsis } from './_behaviorUtils';

test('merged availability chart basic interactions', async ({ page }) => {
  const errors = captureErrors(page);

  const response = await page.goto('/testcases/mergeAvailabilityTest.html');
  expect(response).not.toBeNull();
  expect(response?.ok(), `Expected 2xx/304, got ${response?.status()}`).toBeTruthy();
  await expect(page).not.toHaveURL(/about:blank/);

  await waitForSdk(page);

  // The merged chart target (#chart3)
  const availabilitySvg = await ensureChart(page, '#chart3 svg');

  // Try marker drop via ellipsis (best-effort only)
  if (await openEllipsis(page)) {
    const markerOption = page.getByText(/drop a marker/i);
    if (await markerOption.isVisible().catch(() => false)) {
      await markerOption.click().catch(() => {});
      const marker = page.locator('.tsi-markerContainer').first();
      await marker.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    }
  }

  // Basic click smoke
  const box = await availabilitySvg.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }

  expect(errors).toHaveLength(0);
});