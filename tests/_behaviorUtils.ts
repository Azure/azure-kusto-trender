import { Page, expect, Locator } from '@playwright/test';

export function captureErrors(page: Page) {
  const runtimeErrors: string[] = [];
  page.on('pageerror', e => runtimeErrors.push(e.message));
  return runtimeErrors;
}

export async function waitForSdk(page: Page, timeout = 8000) {
  await page.waitForFunction(() => !!(window as any).KustoTrender, { timeout }).catch(() => {});
}

export async function openEllipsis(page: Page) {
  const btn = page.locator('.tsi-ellipsisButton').first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(150);
    return true;
  }
  return false;
}

export async function clickChartCenter(page: Page, chart: Locator) {
  const box = await chart.boundingBox();
  expect(box, 'Chart bounding box should exist').toBeTruthy();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
}

export async function ensureChart(page: Page, selector: string) {
  const chart = page.locator(selector).first();
  await chart.waitFor({ state: 'visible', timeout: 15000 });
  return chart;
}

// Collect y translation values for events groups (used for swimlane collapse test)
export async function collectEventsGroupYPositions(page: Page) {
  return await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll('.tsi-eventsGroup')) as SVGGElement[];
    return groups
      .map(g => {
        const tr = g.getAttribute('transform') || '';
        const m = /translate\([^,]+,\s*([^)]+)\)/.exec(tr);
        return m ? parseFloat(m[1]) : 0;
      })
      .sort((a, b) => a - b);
  });
}