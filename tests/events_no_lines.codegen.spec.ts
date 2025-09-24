import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('eventsNoLines smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/eventsNoLines.html');
});
