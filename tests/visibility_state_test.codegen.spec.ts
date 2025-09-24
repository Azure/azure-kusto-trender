import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('visibilityStateTest smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/visibilityStateTest.html');
});
