import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('scatterPlotColinear smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/scatterPlotColinear.html');
});
