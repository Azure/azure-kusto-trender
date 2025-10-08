import { test } from '@playwright/test';
import { smokeVisit } from './_smokeHelpers';

// Pages that only need a generic mount / render smoke check.
// If a page has no chart (color picker, date-time pickers), mark allowMissingChart.
// If it may show an auth/login link, set skipIfAuth.
const smokePages: {
  name: string;
  path: string;
  allowMissingChart?: boolean;
  skipIfAuth?: boolean;
  renderButtonNames?: (string | RegExp)[];
}[] = [
    { name: 'adxClient', path: '/testcases/adxClient.html', allowMissingChart: true, skipIfAuth: true },
  { name: 'categoricalTransform', path: '/testcases/categoricalTransform.html' },
  { name: 'colorPicker', path: '/testcases/colorPicker.html', allowMissingChart: true },
  { name: 'connectedScatterPlot', path: '/testcases/connectedScatterPlot.html' },
  { name: 'csvExportWithCommas', path: '/testcases/csvExportWithCommas.html' },
  { name: 'customTimeFormat', path: '/testcases/customTimeFormat.html' },
  { name: 'dateLocale', path: '/testcases/dateLocale.html' },
  { name: 'DateTimePickerButtons', path: '/testcases/DateTimePickerButtons.html', allowMissingChart: true },
  { name: 'degenerateTooltips', path: '/testcases/degenerateTooltips.html' },
  { name: 'denseData', path: '/testcases/denseData.html' },
  { name: 'eventsImprovements', path: '/testcases/eventsImprovements.html' },
  { name: 'eventsNoLines', path: '/testcases/eventsNoLines.html' },
  { name: 'heatmap', path: '/testcases/heatmap.html' },
  { name: 'heatmapToLinechart', path: '/testcases/heatmapToLinechart.html' },
  { name: 'hierarchyNav', path: '/testcases/hierarchyNav.html', allowMissingChart: true, renderButtonNames: [] },
  { name: 'isoStandardization', path: '/testcases/isoStandardization.html' },
  { name: 'markerInterpolation', path: '/testcases/markerInterpolation.html' },
  { name: 'mergeAvailabilityTest', path: '/testcases/mergeAvailabilityTest.html' },
  { name: 'nestedContextMenu', path: '/testcases/nestedContextMenu.html' },
  { name: 'newLinechartArch', path: '/testcases/newLinechartArch.html' },
  { name: 'noDataXAxisIssue', path: '/testcases/noDataXAxisIssue.html' },
  { name: 'nooptions', path: '/testcases/nooptions.html' },
  { name: 'nullFormatting', path: '/testcases/nullFormatting.html' },
  { name: 'resizeableLegend', path: '/testcases/resizeableLegend.html' },
  { name: 'sBVisibilityTest', path: '/testcases/sBVisibilityTest.html' },
  { name: 'scatterPlotColinear', path: '/testcases/scatterPlotColinear.html' },
  { name: 'seriesLabels', path: '/testcases/seriesLabels.html' },
  { name: 'showMoreLegend', path: '/testcases/showMoreLegend.html' },
  { name: 'sparseData', path: '/testcases/sparseData.html' },
  { name: 'stringsTest', path: '/testcases/stringsTest.html' },
  { name: 'tooltipPositioning', path: '/testcases/tooltipPositioning.html' },
  { name: 'tooltipTest', path: '/testcases/tooltipTest.html' },
  { name: 'updatingEvents', path: '/testcases/updatingEvents.html' },
  { name: 'variableAlias', path: '/testcases/variableAlias.html' },
  { name: 'visibilityStateTest', path: '/testcases/visibilityStateTest.html' },
  { name: 'visibleWithoutSplitBy', path: '/testcases/visibleWithoutSplitBy.html' },
  { name: 'yMinMax', path: '/testcases/yMinMax.html' },
  // Accessibility
  { name: 'accessibilityGrid', path: '/testcases/Accessibility/Grid.html' },
  // Availability simple pages
  { name: 'availabilityAdx', path: '/testcases/availability/availabilityAdx.html', skipIfAuth: true, allowMissingChart: true },
  { name: 'availabilityBadInput', path: '/testcases/availability/availabilityBadInput.html', allowMissingChart: true },
  { name: 'badWarmData', path: '/testcases/availability/badWarmData.html' },
  // DateTime pickers (non-chart)
  { name: 'DateTimePicker', path: '/testcases/DateTimePicker/DateTimePicker.html', allowMissingChart: true },
  { name: 'singleDateTimeButtonRange', path: '/testcases/DateTimePicker/singleDateTimeButtonRange.html', allowMissingChart: true },
  // Sanitization DateTimePickerButtons (non-chart)
  { name: 'SanitizationDateTimePickerButtons', path: '/testcases/Sanitization/DateTimePickerButtons.html', allowMissingChart: true },
  // Swimlane simple page (labels only)
  { name: 'swimLaneLabels', path: '/testcases/swimLanes/swimLaneLabels.html' }
];

// Generate one test per entry.
for (const p of smokePages) {
  test(`${p.name} smoke`, async ({ page }) => {
    const extraHost = p.name === 'hierarchyNav' ? ['#hierarchyNav'] : (p.name === 'availabilityAdx' ? ['#availability'] : []);
    await smokeVisit(page, p.path, {
      allowMissingChart: p.allowMissingChart,
      skipIfAuth: p.skipIfAuth,
      renderButtonNames: p.renderButtonNames,
      hostSelectors: extraHost.length ? extraHost.concat(['#chart1', '#availability']) : undefined
    });
  });
}