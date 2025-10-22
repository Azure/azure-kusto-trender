import { Page, expect } from '@playwright/test';

interface SmokeOptions {
  hostSelectors?: string[];
  renderButtonNames?: (string | RegExp)[];
  allowMissingChart?: boolean;
  skipIfAuth?: boolean;
  softErrors?: boolean;              // If true, do soft assertions (keeps old behavior)
  allowConsoleErrors?: boolean;      // Override to ignore console errors for a page
  sdkWaitMs?: number;                // Custom SDK wait timeout
}

/**
 * Hardened smoke visit:
 *  - Loads page
 *  - Ensures SDK (if chart expected)
 *  - Optionally clicks "render" buttons
 *  - Fails on runtime console errors (unless allowConsoleErrors)
 *  - Verifies at least one chart/table/grid surface when expected
 */
export async function smokeVisit(
  page: Page,
  url: string,
  options: SmokeOptions = {}
) {
  const {
    hostSelectors = [
      '#chart1', '#chart2', '#chart3', '#chart4', '#chart5',
      '#availability', '#rangeButtonWrapper', '#dtp', '#sdtp', '#cp'
    ],
    renderButtonNames = [/^render$/i],
    allowMissingChart = false,
    skipIfAuth = false,
    softErrors = false,
    allowConsoleErrors = false,
    sdkWaitMs = 8000
  } = options;

  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Pages considered "non-chart" by pattern (date/time pickers, sanitize pages, color picker)
  const nonChartHeuristic = /colorPicker|DateTimePicker|sanitize/i.test(url);
  const expectChart = !(allowMissingChart || nonChartHeuristic);

  // 1. Host container presence (best-effort)
  for (const sel of hostSelectors) {
    const loc = page.locator(sel).first();
    if (await loc.count()) {
      await loc.waitFor({ state: 'visible', timeout: 4000 }).catch(() => {});
      break;
    }
  }

  // 2. Skip early if auth page and user not logged in
  if (skipIfAuth) {
    const loginLink = page.getByRole('link', { name: /log in/i });
    if (await loginLink.isVisible().catch(() => false)) {
      // Still assert no *unexpected* console explosions prior to auth
      if (!allowConsoleErrors && errors.length) {
        (softErrors ? expect.soft(errors) : expect(errors)).toHaveLength(0);
      }
      return;
    }
  }

  // 3. Ensure SDK loaded (only if we expect a chart)
  const hasSdk = async () =>
    await page.evaluate(() => !!(window as any).KustoTrender).catch(() => false);

  if (expectChart) {
    const start = Date.now();
    let loaded = await hasSdk();
    if (!loaded) {
      // Attempt fallback script tag injections (ordered)
      const candidates = [
        '/dist/kustotrender.js',
        '../../dist/kustotrender.js',
        '../dist/kustotrender.js',
        '../../../dist/kustotrender.js'
      ];
      for (const c of candidates) {
        await page.addScriptTag({ url: c }).catch(() => {});
        loaded = await hasSdk();
        if (loaded) break;
        if (Date.now() - start > sdkWaitMs) break;
      }
    }
    if (!loaded) {
      const assertion = softErrors ? expect.soft(true, `SDK failed to load: ${url}`) : expect(true, `SDK failed to load: ${url}`);
      assertion.toBe(false); // Force failure
      // Bail early; subsequent checks meaningless
      return;
    }
  }

  // Small settle delay (optional)
  if (expectChart) await page.waitForTimeout(150);

  // 4. Trigger any render buttons
  for (const name of renderButtonNames) {
    const btn = page.getByRole('button', { name });
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click().catch(() => {});
    }
  }

  // 5. Locate a chart-ish element if expected
  if (expectChart) {
    const chartSelector =
      'svg.tsi-lineChartSVG, svg.tsi-heatmapSVG, svg.tsi-swimLaneSVG, ' +
      'svg.tsi-scatterPlotSVG, .tsi-eventsTable, .tsi-tableComponent, ' +
      '.tsi-gridComponent, canvas';

    const chartLoc = page.locator(chartSelector).first();

    // Try a direct wait first
    let chartVisible = await chartLoc.isVisible().catch(() => false);
    const deadline = Date.now() + 6000;
    while (!chartVisible && Date.now() < deadline) {
      await page.waitForTimeout(250);
      chartVisible = await chartLoc.isVisible().catch(() => false);
    }

    const msg = `Expected a chart/table element to appear on ${url}`;
    if (softErrors) {
      expect.soft(chartVisible, msg).toBeTruthy();
    } else {
      expect(chartVisible, msg).toBeTruthy();
    }
  }

  // 6. Fail on runtime console errors unless explicitly allowed
  if (!allowConsoleErrors && errors.length) {
    const assertion = softErrors ? expect.soft(errors, `Console errors on ${url}`) : expect(errors, `Console errors on ${url}`);
    assertion.toHaveLength(0);
  }
}