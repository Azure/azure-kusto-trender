import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('heatmapToLinechart smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/heatmapToLinechart.html');
});
