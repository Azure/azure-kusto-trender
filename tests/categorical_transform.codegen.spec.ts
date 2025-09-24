import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('categoricalTransform smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/categoricalTransform.html');
});
