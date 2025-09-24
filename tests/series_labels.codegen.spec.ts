import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('seriesLabels smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/seriesLabels.html');
});
