import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('denseData smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/denseData.html');
});
