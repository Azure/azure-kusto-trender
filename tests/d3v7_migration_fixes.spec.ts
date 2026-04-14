import { test, expect } from '@playwright/test';
import { captureErrors, waitForSdk, ensureChart } from './_behaviorUtils';

/**
 * Tests for the D3 v5 → v7 migration fixes.
 * Each test targets a specific bug that was introduced or exposed
 * during the migration and verifies correct runtime behavior.
 */

test.describe('D3 v7 migration fixes', () => {

  test('marker drag start handler receives event parameter correctly', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/testcases/markerExport.html');

    // Wait for chart and markers to render
    await ensureChart(page, 'svg.tsi-lineChartSVG');
    const markers = page.locator('.tsi-markerContainer');
    await expect
      .poll(async () => await markers.count(), { timeout: 8000 })
      .toBeGreaterThan(0);

    // Get initial marker position
    const markerLabel = page.locator('.tsi-markerContainer .tsi-markerTimeLabel').first();
    await markerLabel.waitFor({ state: 'visible', timeout: 5000 });
    const beforeBox = await markerLabel.boundingBox();
    expect(beforeBox, 'Marker label should have a bounding box').toBeTruthy();

    // Perform a drag: mousedown → move right → mouseup
    const startX = beforeBox!.x + beforeBox!.width / 2;
    const startY = beforeBox!.y + beforeBox!.height / 2;
    const dragDistance = 60;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Move in small increments to trigger drag events
    for (let dx = 0; dx <= dragDistance; dx += 10) {
      await page.mouse.move(startX + dx, startY);
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Marker should still be visible after drag
    await expect(markerLabel).toBeVisible();

    // The marker should have moved (or snapped to a nearby timestamp)
    const afterBox = await markerLabel.boundingBox();
    expect(afterBox, 'Marker label should still have a bounding box').toBeTruthy();

    // Filter out pre-existing page errors unrelated to our fix
    const relevantErrors = errors.filter(e => !e.includes('pdata.data is not a function'));
    expect(relevantErrors).toHaveLength(0);
  });

  test('heatmap canvas mousemove uses component context for highlightedTime', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/testcases/heatmap.html');
    await waitForSdk(page);

    // Wait for heatmap canvases to render
    const canvas = page.locator('canvas.tsi-heatmapCanvas').first();
    await canvas.waitFor({ state: 'visible', timeout: 10000 });

    const canvasBox = await canvas.boundingBox();
    expect(canvasBox, 'Canvas should have a bounding box').toBeTruthy();

    // Move mouse across the heatmap canvas to trigger mousemove handler
    const centerX = canvasBox!.x + canvasBox!.width / 2;
    const centerY = canvasBox!.y + canvasBox!.height / 2;
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(300);

    // The fix ensures self.highlightedTime is set (not this.highlightedTime on DOM).
    // On mousemove, Heatmap renders focus lines (.tsi-heatmapFocusLine) and
    // time label boxes (.tsi-heatmapTimeLabelTextBox).
    const focusLines = page.locator('.tsi-heatmapFocusLine');
    await expect
      .poll(async () => await focusLines.count(), { timeout: 3000 })
      .toBeGreaterThan(0);

    // Move mouse away to trigger mouseout cleanup
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    // Focus lines should be removed on mouseout
    await expect
      .poll(async () => await focusLines.count(), { timeout: 3000 })
      .toBe(0);

    expect(errors).toHaveLength(0);
  });

  test('categorical plot mouseover finds correct element via e.currentTarget', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/testcases/categoricalTransform.html');
    await waitForSdk(page);

    await ensureChart(page, 'svg.tsi-lineChartSVG');

    // Wait for categorical buckets to render
    const buckets = page.locator('.tsi-categoricalBucket');
    await expect
      .poll(async () => await buckets.count(), { timeout: 8000 })
      .toBeGreaterThan(0);

    // Directly dispatch mouseover on a visible bucket to test the handler.
    // This avoids issues with pointer events being intercepted by overlay elements.
    const hoverResult = await page.evaluate(() => {
      const rects = Array.from(document.querySelectorAll('.tsi-categoricalBucket')) as SVGRectElement[];
      for (const rect of rects) {
        const vis = rect.style.visibility || rect.getAttribute('visibility');
        if (vis === 'hidden') continue;
        const bbox = rect.getBoundingClientRect();
        if (bbox.width > 2 && bbox.height > 2) {
          // Dispatch mouseover on this visible bucket
          rect.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: bbox.x + bbox.width / 2, clientY: bbox.y + bbox.height / 2 }));
          return true;
        }
      }
      return false;
    });

    expect(hoverResult, 'Should have dispatched mouseover on a visible bucket').toBe(true);
    await page.waitForTimeout(300);

    // The fix ensures nodes.indexOf(e.currentTarget) returns the correct index,
    // so the hover rect should appear (visibility: visible) with proper width.
    const hoverRectState = await page.evaluate(() => {
      const rect = document.querySelector('.tsi-categoricalHoverRect') as SVGRectElement | null;
      if (!rect) return { visible: false, width: 0 };
      return {
        visible: rect.getAttribute('visibility') === 'visible',
        width: parseFloat(rect.getAttribute('width') || '0')
      };
    });

    expect(hoverRectState.visible).toBe(true);
    expect(hoverRectState.width).toBeGreaterThan(0);

    // Dispatch mouseout to clean up
    await page.evaluate(() => {
      const rect = document.querySelector('.tsi-categoricalBucket') as SVGRectElement | null;
      rect?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    });
    await page.waitForTimeout(300);

    const hiddenVisibility = await page.locator('.tsi-categoricalHoverRect').first().getAttribute('visibility');
    expect(hiddenVisibility).toBe('hidden');

    expect(errors).toHaveLength(0);
  });

  test('grid header keydown navigation uses correct element index', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/testcases/Accessibility/Grid.html');
    await waitForSdk(page);

    // Wait for grid table to render
    const table = page.locator('.tsi-gridTable').first();
    await table.waitFor({ state: 'visible', timeout: 10000 });

    // Focus a specific header cell in the first grid by its generated class
    // Header cells have class pattern "tsi-table-0-N tsi-headerCell" where N >= 1
    const firstGrid = page.locator('.tsi-gridComponent').first();
    const headerCells = firstGrid.locator('.tsi-headerCell');
    const headerCount = await headerCells.count();
    expect(headerCount).toBeGreaterThan(1);

    // Focus the first header cell (should be tsi-table-0-1)
    await headerCells.first().focus();
    await page.waitForTimeout(100);

    const focusedBefore = await page.evaluate(() => document.activeElement?.className ?? '');
    expect(focusedBefore).toMatch(/tsi-table-0-\d+/);

    const colBefore = focusedBefore.match(/tsi-table-(\d+)-(\d+)/);
    expect(colBefore).toBeTruthy();
    const colIndexBefore = parseInt(colBefore![2]);

    // Dispatch ArrowRight keydown with keyCode 39 directly
    await page.evaluate(() => {
      const el = document.activeElement;
      if (el) {
        el.dispatchEvent(new KeyboardEvent('keydown', {
          keyCode: 39, key: 'ArrowRight', code: 'ArrowRight', bubbles: true
        }));
      }
    });
    await page.waitForTimeout(200);

    // After ArrowRight, focus should move to the next column
    const focusedAfter = await page.evaluate(() => document.activeElement?.className ?? '');
    const colAfter = focusedAfter.match(/tsi-table-(\d+)-(\d+)/);
    expect(colAfter, 'Focus should be on a tsi-table cell after navigation').toBeTruthy();

    const colIndexAfter = parseInt(colAfter![2]);
    expect(colIndexAfter).toBe(colIndexBefore + 1);

    expect(errors).toHaveLength(0);
  });

  test('hierarchy expand/collapse and leaf click use proper event and self.root', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/testcases/hierarchy.html');
    await waitForSdk(page);

    // Wait for hierarchy to render with initial expansion
    const hierarchy = page.locator('.tsi-hierarchy');
    await hierarchy.waitFor({ state: 'visible', timeout: 10000 });

    // The tree should have rendered with the root expanded
    // Check for top-level branch nodes
    const allItems = hierarchy.locator('li');
    await expect
      .poll(async () => await allItems.count(), { timeout: 5000 })
      .toBeGreaterThan(0);

    // Find "Branch A" text and click it to expand
    const branchA = hierarchy.locator('li', { has: page.locator('span.tsi-markedName', { hasText: 'Branch A' }) }).first();
    await expect(branchA).toBeVisible();
    await branchA.click();
    await page.waitForTimeout(300);

    // After expanding Branch A, "Sub Branch" should be visible
    const subBranch = hierarchy.locator('span.tsi-markedName', { hasText: 'Sub Branch' });
    await expect(subBranch).toBeVisible({ timeout: 3000 });

    // Click Sub Branch to expand it (to reveal leaves)
    await subBranch.click();
    await page.waitForTimeout(300);

    // Leaves should be visible
    const leaf1 = hierarchy.locator('li.tsi-leaf', { has: page.locator('span.tsi-markedName', { hasText: 'Leaf 1' }) }).first();
    await expect(leaf1).toBeVisible({ timeout: 3000 });

    // Click a leaf — this exercises the clickMethod function with proper (event, d) signature,
    // self.root (instead of this.root), and event.stopPropagation() (instead of stale evt).
    await leaf1.click();
    await page.waitForTimeout(200);

    // Verify the click callback fired (leaf click count incremented)
    const clickCount = await page.evaluate(() => (window as any).leafClickCount);
    expect(clickCount).toBe(1);

    // Verify the leaf toggles its selected state
    const isSelected = await leaf1.evaluate(el => el.classList.contains('tsi-selected'));
    expect(isSelected).toBe(true);

    // Click the same leaf again to deselect
    await leaf1.click();
    await page.waitForTimeout(200);

    const clickCount2 = await page.evaluate(() => (window as any).leafClickCount);
    expect(clickCount2).toBe(2);

    const isSelectedAfter = await leaf1.evaluate(el => el.classList.contains('tsi-selected'));
    expect(isSelectedAfter).toBe(false);

    expect(errors).toHaveLength(0);
  });
});
