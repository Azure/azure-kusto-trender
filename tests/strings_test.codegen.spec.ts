import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('strings test smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/stringsTest.html');
});
