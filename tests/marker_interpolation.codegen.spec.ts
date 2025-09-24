import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('markerInterpolation smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/markerInterpolation.html');
});
