import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('dateLocale smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/dateLocale.html');
});
