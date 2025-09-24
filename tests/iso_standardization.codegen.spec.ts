import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('isoStandardization smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/isoStandardization.html');
});
