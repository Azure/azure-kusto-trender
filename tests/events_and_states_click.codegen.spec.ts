import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('EventsAndStatesClick smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/EventsAndStatesClick.html');
});
