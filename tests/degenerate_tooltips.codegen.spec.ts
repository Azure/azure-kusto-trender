import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('degenerateTooltips smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/degenerateTooltips.html');
});
