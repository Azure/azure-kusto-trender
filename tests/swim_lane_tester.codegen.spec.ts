import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('swimLaneTester smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/swimLanes/swimLaneTester.html');
});
