import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('show more legend smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/showMoreLegend.html');
});
