import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('nullFormatting smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/nullFormatting.html');
});
