import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('mergeAvailabilityTest smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/mergeAvailabilityTest.html');
});
