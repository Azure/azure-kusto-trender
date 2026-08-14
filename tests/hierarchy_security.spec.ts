import { test, expect } from '@playwright/test';
import { waitForSdk } from './_behaviorUtils';

test('hierarchy renders untrusted labels as text', async ({ page }) => {
  await page.goto('/testcases/hierarchy.html');
  await waitForSdk(page);

  const payload = '<img src=x onerror="window.__hierarchyXss = true">Danger';
  await page.evaluate((maliciousLabel) => {
    const host = document.createElement('div');
    host.id = 'hierarchy-security-test';
    document.body.appendChild(host);

    (window as any).__hierarchyXss = false;
    const trender = new (window as any).KustoTrender();
    const hierarchy = new trender.ux.Hierarchy(host);
    hierarchy.render({
      [maliciousLabel]: {
        Leaf: { '$leaf': true }
      }
    }, { theme: 'light' });
  }, payload);

  const hierarchy = page.locator('#hierarchy-security-test');
  const label = hierarchy.locator('.tsi-markedName', { hasText: 'Danger' });
  await expect(label).toHaveText(payload);
  await expect(hierarchy.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__hierarchyXss)).toBe(false);

  await hierarchy.locator('input').fill('Danger');
  await expect(label.locator('mark')).toHaveText('Danger');
  await expect(label).toHaveText(payload);
  await expect(hierarchy.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__hierarchyXss)).toBe(false);
});

test('model autocomplete renders untrusted suggestions as text', async ({ page }) => {
  await page.goto('/testcases/hierarchy.html');
  await waitForSdk(page);

  const payload = '<img src=x onerror="window.__autocompleteXss = true">Danger';
  await page.evaluate((maliciousSuggestion) => {
    const host = document.createElement('div');
    host.id = 'autocomplete-security-test';
    document.body.appendChild(host);

    (window as any).__autocompleteXss = false;
    const delegate = {
      getInstancesSuggestions: async () => [
        { searchString: maliciousSuggestion },
        { searchString: 'İXINDIGO' }
      ]
    };
    const trender = new (window as any).KustoTrender();
    const autocomplete = new trender.ux.ModelAutocomplete(host, delegate);
    autocomplete.render({ theme: 'light' });
  }, payload);

  const autocomplete = page.locator('#autocomplete-security-test');
  const input = autocomplete.locator('input');
  await input.fill('Danger');

  const suggestion = autocomplete.locator('li[role="option"]');
  await expect(suggestion).toHaveText(payload);
  await expect(suggestion.locator('mark')).toHaveText('Danger');
  await expect(autocomplete.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__autocompleteXss)).toBe(false);

  await suggestion.click();
  await expect(input).toHaveValue(payload);
  expect(await page.evaluate(() => (window as any).__autocompleteXss)).toBe(false);

  await input.fill('indigo');
  const unicodeSuggestion = autocomplete.locator('li[role="option"]');
  await expect(unicodeSuggestion).toHaveText('İXINDIGO');
  await expect(unicodeSuggestion.locator('mark')).toHaveText('INDIGO');
});

test('model search renders entity-encoded highlights as text', async ({ page }) => {
  await page.goto('/testcases/hierarchy.html');
  await waitForSdk(page);

  const payload = '&lt;img src=x onerror="window.__modelSearchXss = true"&gt;<hit>Danger</hit>';
  await page.evaluate(async (maliciousHighlight) => {
    const host = document.createElement('div');
    host.id = 'model-search-security-test';
    document.body.appendChild(host);

    (window as any).__modelSearchXss = false;
    const delegate = {
      getInstancesSuggestions: async () => [],
      getInstancesSearch: async () => ({
        instances: {
          hits: [{
            timeSeriesId: ['test-id'],
            highlights: {
              name: `${maliciousHighlight}<hit>unfinished`,
              timeSeriesId: ['test-id'],
              typeName: 'TestType',
              description: maliciousHighlight,
              instanceFieldNames: ['<hit>Field</hit>'],
              instanceFieldValues: [maliciousHighlight]
            }
          }]
        }
      }),
      getHierarchies: async () => [],
      getTimeSeriesTypes: async () => []
    };
    const trender = new (window as any).KustoTrender();
    const modelSearch = new trender.ux.ModelSearch(host, delegate);
    await modelSearch.render({}, { theme: 'light' });
  }, payload);

  const modelSearch = page.locator('#model-search-security-test');
  const input = modelSearch.getByRole('combobox', { name: 'Search Time Series Instances' });
  await input.fill('Danger');
  await input.press('Enter');

  const result = modelSearch.locator('.tsi-modelResult').first();
  await expect(result).toContainText('Danger');
  await expect(result).toContainText('<hit>unfinished');
  await expect(result.locator('mark')).not.toHaveCount(0);
  await expect(modelSearch.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__modelSearchXss)).toBe(false);
});