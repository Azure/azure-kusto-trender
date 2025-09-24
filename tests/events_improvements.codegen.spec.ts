import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('eventsImprovements smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/eventsImprovements.html');
});
