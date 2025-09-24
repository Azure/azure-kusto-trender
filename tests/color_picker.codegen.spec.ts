import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('colorPicker smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/colorPicker.html');
});
