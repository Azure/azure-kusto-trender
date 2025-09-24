import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('tooltip positioning smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/tooltipPositioning.html');
});
