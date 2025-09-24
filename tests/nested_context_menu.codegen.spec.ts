import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('nestedContextMenu smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/nestedContextMenu.html');
});
