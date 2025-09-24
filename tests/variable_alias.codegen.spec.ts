import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('variableAlias smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/variableAlias.html');
});
