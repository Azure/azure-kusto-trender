import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('singleDateTimeButtonRange smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/DateTimePicker/singleDateTimeButtonRange.html', { hostSelectors: ['#rangeButtonWrapper'] });
});
