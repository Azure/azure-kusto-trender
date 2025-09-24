import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('sBVisibilityTest smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/sBVisibilityTest.html');
});
