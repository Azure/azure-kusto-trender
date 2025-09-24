import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('connectedScatterPlot smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/connectedScatterPlot.html');
});
