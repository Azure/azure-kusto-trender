import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('visibleWithoutSplitBy smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/visibleWithoutSplitBy.html');
});
