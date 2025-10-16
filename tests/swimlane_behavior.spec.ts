import { test, expect } from '@playwright/test';
import {
  captureErrors,
  waitForSdk,
  ensureChart,
  collectEventsGroupYPositions,
} from './_behaviorUtils';

function formatCount(values: number[], digits = 3) {
  return new Set(values.map(v => v.toFixed(digits))).size;
}

test('swimlane labels interactions and collapse toggle', async ({ page }) => {
  const errors = captureErrors(page);

  const consoleMessages: string[] = [];
  page.on('console', message => consoleMessages.push(message.text()));

  const response = await page.goto('/testcases/swimLanes/swimLaneLabels.html');
  expect(response, 'Page should load successfully').not.toBeNull();
  expect(response?.ok(), `Expected 2xx/304, got ${response?.status()}`).toBeTruthy();
  await expect(page).not.toHaveURL(/about:blank/);

  await waitForSdk(page);
  await ensureChart(page, 'svg.tsi-lineChartSVG');

  const labels = page.locator('text.tsi-swimLaneLabel');
  await expect(labels.first()).toBeVisible();
  expect(await labels.count(), 'Need at least two swimlane labels').toBeGreaterThan(1);

  // Update lane 2 label via the control panel and ensure chart reflects it
  const lane2Input = page.locator('#group1Label');
  const lane2Label = labels.nth(1);
  const originalLane2 = (await lane2Label.textContent())?.trim() ?? '';

  await lane2Input.fill('Maintenance Lane');
  await page.evaluate(() =>
    document.getElementById('group1Label')?.dispatchEvent(new Event('change', { bubbles: true }))
  );

  await expect
    .poll(async () => (await lane2Label.textContent())?.trim() ?? '', { timeout: 4000 })
    .toContain('Maintenance Lane');
  expect((await lane2Label.textContent())?.trim() ?? '').not.toBe(originalLane2);

  const getLane4Height = async () =>
    await page.evaluate(() => {
      const label = document.querySelector('.tsi-swimLaneLabel-4') as SVGTextElement & {
        __data__?: { height?: number };
      } | null;
      const bound = label?.__data__;
      return bound && typeof bound.height === 'number' ? bound.height : null;
    });

  const initialLaneHeight = await getLane4Height();
  expect(initialLaneHeight, 'Lane 4 height should be available').not.toBeNull();

  const initialPositions = await collectEventsGroupYPositions(page);
  expect(initialPositions.length).toBeGreaterThan(0);
  const initialSpread = Math.max(...initialPositions) - Math.min(...initialPositions);
  const initialUniqueCount = formatCount(initialPositions);

  const collapseToggle = page.locator('#group3Collapse');
  await collapseToggle.check();
  await page.waitForTimeout(400);

  const collapsedLaneHeight = await getLane4Height();
  expect(collapsedLaneHeight, 'Collapsed lane height missing').not.toBeNull();
  expect(collapsedLaneHeight!).toBeLessThan(initialLaneHeight!);

  const collapsedPositions = await collectEventsGroupYPositions(page);
  expect(collapsedPositions.length).toBeGreaterThan(0);
  const collapsedSpread = Math.max(...collapsedPositions) - Math.min(...collapsedPositions);
  const collapsedUniqueCount = formatCount(collapsedPositions);

  if (initialUniqueCount > 1) {
    expect(collapsedSpread).toBeLessThan(initialSpread);
  } else {
    expect(collapsedUniqueCount).toBeLessThanOrEqual(initialUniqueCount);
  }

  await collapseToggle.uncheck();
  await page.waitForTimeout(400);

  const expandedLaneHeight = await getLane4Height();
  expect(expandedLaneHeight, 'Expanded lane height missing').not.toBeNull();
  expect(expandedLaneHeight!).toBeGreaterThan(collapsedLaneHeight!);
  expect(expandedLaneHeight!).toBeCloseTo(initialLaneHeight!, 1);

  const expandedPositions = await collectEventsGroupYPositions(page);
  expect(expandedPositions.length).toBeGreaterThan(0);
  const expandedSpread = Math.max(...expandedPositions) - Math.min(...expandedPositions);

  if (initialUniqueCount > 1) {
    expect(expandedSpread).toBeGreaterThanOrEqual(collapsedSpread);
  } else {
    expect(formatCount(expandedPositions)).toBe(collapsedUniqueCount);
  }

  await page.evaluate(() => {
    document
      .querySelector('.tsi-swimLaneLabel-2')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  await expect
    .poll(
      () => consoleMessages.filter(msg => /lane 2/i.test(msg) || /2 clicked/i.test(msg)).length,
      { timeout: 2000 }
    )
    .toBeGreaterThan(0);

  expect(errors).toHaveLength(0);
});