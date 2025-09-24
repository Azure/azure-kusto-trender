import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('resizeableLegend smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/resizeableLegend.html');
});
