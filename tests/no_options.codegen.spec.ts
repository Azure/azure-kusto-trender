import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('nooptions smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/nooptions.html');
});
