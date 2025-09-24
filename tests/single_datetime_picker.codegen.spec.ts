import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('SingleDateTimePicker smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/SingleDateTimePicker.html', { hostSelectors: ['#sdtp', '#dtp'] });
});
