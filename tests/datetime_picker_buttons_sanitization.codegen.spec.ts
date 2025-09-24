import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('sanitization DateTimePickerButtons smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/Sanitization/DateTimePickerButtons.html', { hostSelectors: ['#dtp', '#sdtp'] });
});
