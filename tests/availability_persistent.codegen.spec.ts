import { test, expect } from '@playwright/test';

test('availability persistent button toggles compact', async ({ page }) => {
  await page.goto('/testcases/availability/availabilityPersistentButton.html');
  const container = page.locator('#availability');
  await expect(container).toBeVisible();

  const render = page.getByRole('button', { name: /render/i });
  await render.click();

  // Chart renders inside availability div as svg.tsi-lineChartSVG (not necessarily an <img>)
  const svg = container.locator('svg.tsi-lineChartSVG');
  await expect(svg.first()).toBeVisible();

  const initialHeight = await container.evaluate(e => getComputedStyle(e).height);

  const compact = page.locator('#compact');
  await compact.check();
  await render.click();

  // After re-render with compact the container inline height changes from 160px to 76px
  await expect.poll(async () => await container.evaluate(e => getComputedStyle(e).height), { timeout: 3000 })
    .toBe('76px');

  await expect(svg.first()).toBeVisible();
  expect(initialHeight).not.toBe('76px');
});