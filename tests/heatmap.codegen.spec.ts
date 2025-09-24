import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('heatmap smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/heatmap.html');
});
