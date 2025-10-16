import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk } from './_behaviorUtils';

test('events table renders with headers & rows', async ({ page }) => {
  const errors = captureErrors(page);

  // 1. Navigate
  const response = await page.goto('/testcases/csvExportWithCommas.html');
  expect(response?.ok(), `Navigation failed: status ${response?.status()}`).toBeTruthy();

  // 2. Wait for SDK (defensive)
  await waitForSdk(page);

  // 3. Wait for table root
  const tableRoot = page.locator('.tsi-eventsTable').first();
  await tableRoot.waitFor({ state: 'visible', timeout: 15000 });

  // 4. Headers
  const headers = page.locator('.tsi-columnHeaders .tsi-columnHeader');
  await headers.first().waitFor({ state: 'visible', timeout: 10000 });
  expect(await headers.count(), 'Should have at least one column header').toBeGreaterThan(0);

  // 5. Rows
  const rows = page.locator('.tsi-eventRow');
  await rows.first().waitFor({ state: 'visible', timeout: 10000 });
  expect(await rows.count(), 'Should have at least one event row').toBeGreaterThan(0);

  // 6. Optional: download button (soft)
  const downloadBtn = page.locator('.tsi-eventsDownload').first();
  if (!(await downloadBtn.isVisible().catch(() => false))) {
    expect.soft(false, 'Download button not found (non-fatal)').toBeTruthy();
  }

  // 7. No runtime exceptions
  expect(errors).toHaveLength(0);
});