import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('swimLaneLabels smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/swimLanes/swimLaneLabels.html');
});
