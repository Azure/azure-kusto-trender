import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('newLinechartArch smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/newLinechartArch.html');
});
