import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('y min max smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/yMinMax.html');
});
