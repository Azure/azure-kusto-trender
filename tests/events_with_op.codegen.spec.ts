import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('eventsWithOP smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/eventsWithOP.html');
});
