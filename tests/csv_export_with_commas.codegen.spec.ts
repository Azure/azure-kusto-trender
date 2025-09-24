import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('csvExportWithCommas smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/csvExportWithCommas.html');
});
