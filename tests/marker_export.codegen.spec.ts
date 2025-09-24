import { test, expect } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('marker export smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/markerExport.html');
  const exportBtn = page.getByRole('button', { name: /export/i });
  if (await exportBtn.isVisible().catch(() => false)) {
    await exportBtn.click();
    await expect.soft(exportBtn).toBeVisible();
  }
});
