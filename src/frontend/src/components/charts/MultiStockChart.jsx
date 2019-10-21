import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Indicators from 'highcharts/indicators/indicators-all';
import DragPanes from 'highcharts/modules/drag-panes';
import AnnotationsAdvanced from 'highcharts/modules/annotations-advanced';
import PriceIndicator from 'highcharts/modules/price-indicator';
import FullScreen from 'highcharts/modules/full-screen';
import StockTools from 'highcharts/modules/stock-tools';
import './StockChart.css';

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);

/**
 * Populates the chart options (Highcharts source/structure) for the rendering of an
 * instrument chart
 * @param {Object} series - holds data about series to plot
 * @param {String} yScale - gives the type of scale to plot data aginst the yaxis
 */
const chartOptions = (series, yScale) => ({
  yAxis: [{
    labels: {
      align: 'left',
    },
    height: '80%',
    resize: {
      enabled: true,
    },
    type: yScale,
  }, {
    labels: {
      align: 'left',
    },
    top: '80%',
    height: '20%',
    offset: 0,
  }],
  legend: {
    enabled: true,
  },
  tooltip: {
    shape: 'square',
    headerShape: 'callout',
    borderWidth: 0,
    shadow: false,
    positioner(width, height, point) {
      const { chart } = this; let
        position;

      if (point.isHeader) {
        position = {
          x: Math.max(
            // Left side limit
            chart.plotLeft,
            Math.min(
              point.plotX + chart.plotLeft - width / 2,
              // Right side limit
              chart.chartWidth - width - chart.marginRight,
            ),
          ),
          y: point.plotY,
        };
      } else {
        position = {
          x: point.series.chart.plotLeft,
          y: point.series.yAxis.top - chart.plotTop,
        };
      }

      return position;
    },
  },
  // Charting options
  stockTools: {
    gui: {
      buttons: [
        'indicators',
        'separator',
        'simpleShapes',
        'lines',
        'crookedLines',
        'measure',
        'advanced',
        'toggleAnnotations',
        'separator',
        'verticalLabels',
        'flags',
        'separator',
        'zoomChange',
        'fullScreen',
        'typeChange',
        'separator',
        'currentPriceIndicator',
      ],
      enabled: true,
    },
  },
  series: series.map(serie => ({
    ...serie,
  })),
  responsive: {
    rules: [{
      condition: {
        maxWidth: 800,
      },
      chartOptions: {
        rangeSelector: {
          inputEnabled: false,
        },
      },
    }],
  },
});

/**
 * Constructs a chart using HighCharts
 * @param {Object} contains both data series to plot
 */
const MultiStockChart = ({ series, yScale }) => (
  <HighchartsReact
    highcharts={Highcharts}
    constructorType="stockChart"
    options={chartOptions(series, yScale)}
    allowChartUpdate
    oneToOne
  />
);

export default MultiStockChart;
