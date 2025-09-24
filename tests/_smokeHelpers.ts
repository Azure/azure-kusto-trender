import { Page, expect } from '@playwright/test';

/**
 * Navigate to a sample page and (optionally) trigger rendering.
 * Intentionally minimal: verifies a host container and (for chart pages) a chart-like element.
 */
export async function smokeVisit(
  page: Page,
  url: string,
  options: {
    hostSelectors?: string[];
    renderButtonNames?: (string | RegExp)[];
    allowMissingChart?: boolean;
    skipIfAuth?: boolean;
  } = {}
) {
  const {
    hostSelectors = ['#chart1', '#availability', '#rangeButtonWrapper', '#dtp', '#sdtp', '#cp'],
    renderButtonNames = [/^render$/i],
    allowMissingChart = false,
    skipIfAuth = false
  } = options;

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const nonChartHeuristic = /colorPicker|DateTimePicker|sanitize/i.test(url);

  // Wait for first matching host (or fall back to body attached state)
  let hostFound = false;
  for (const sel of hostSelectors) {
    const loc = page.locator(sel).first();
    if (await loc.count()) {
      await loc.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      hostFound = true;
      break;
    }
  }
  if (!hostFound) {
    await page.locator('body').waitFor({ state: 'attached', timeout: 5000 });
  }

  // Ensure SDK present (late inject fallbacks if needed)
  const hasSdk = async () => await page.evaluate(() => !!(window as any).KustoTrender).catch(() => false);
  let loaded = await hasSdk();
  if (!loaded) {
    for (const p of [
      '../../../dist/kustotrender.js',
      '../../dist/kustotrender.js',
      '../dist/kustotrender.js',
      '/dist/kustotrender.js'
    ]) {
      await page.addScriptTag({ url: p }).catch(() => {});
      if ((loaded = await hasSdk())) break;
    }
    if (!loaded && !nonChartHeuristic && !allowMissingChart) {
      expect.soft(loaded, 'KustoTrender SDK failed to load').toBeTruthy();
    }
  } else {
    await page.waitForTimeout(300);
  }

  for (const name of renderButtonNames) {
    const btn = page.getByRole('button', { name });
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click().catch(() => {});
    }
  }

  if (skipIfAuth) {
    const loginLink = page.getByRole('link', { name: /log in/i });
    if (await loginLink.isVisible().catch(() => false)) return;
  }

  if (allowMissingChart || nonChartHeuristic) return;

  const chart = page.locator('svg.tsi-lineChartSVG, svg.tsi-heatmapSVG, svg.tsi-swimLaneSVG, svg.tsi-scatterPlotSVG, .tsi-eventsTable, .tsi-tableComponent, canvas, .tsi-gridComponent');
  for (let i = 0; i < 12; i++) {
    if (await chart.first().isVisible().catch(() => false)) return;
    await page.waitForTimeout(250);
  }
  await expect.soft(chart.first(), 'Expected a chart/grid/table element to render').toBeVisible();
}
