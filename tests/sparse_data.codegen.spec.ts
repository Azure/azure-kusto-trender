import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('sparseData smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/sparseData.html');
});
