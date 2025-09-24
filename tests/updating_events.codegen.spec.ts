import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('updatingEvents smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/updatingEvents.html');
});
