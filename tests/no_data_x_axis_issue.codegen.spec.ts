import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

test('noDataXAxisIssue smoke', async ({ page }) => {
  await smokeVisit(page, '/testcases/noDataXAxisIssue.html');
});
