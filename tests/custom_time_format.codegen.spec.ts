import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('customTimeFormat smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/customTimeFormat.html');
});
