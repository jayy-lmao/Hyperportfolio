import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import instrumentService from '../../services/instrumentService';

/**
 * Displays a small bar chart that maps relevant instrument data
 */
class MiniBarChart extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { symbol, range, interval } = props;

    this.state = {
      symbol,
      range,
      interval,
      chartOptions: {
        title: {
          text: null,
        },
        chart: {
          backgroundColor: null,
          borderWidth: 0,
          type: 'area',
          margin: [2, 0, 2, 0],
          width: 100,
          height: 20,
          style: {
            overflow: 'visible',
          },
          skipClone: true,
        },
        tooltip: {
          hideDelay: 0,
          outside: true,
          shared: true,
        },
        xAxis: {
          type: 'datetime',
          labels: {
            enabled: false,
          },
          title: {
            text: null,
          },
          startOnTick: false,
          endOnTick: false,
          tickPositions: [],
        },
        yAxis: {
          labels: {
            enabled: false,
          },
          title: {
            text: null,
          },
          startOnTick: false,
          endOnTick: false,
          tickPositions: [0],
        },
        plotOptions: {
          series: {
            color: '#0000FF',
            negativeColor: '#FF0000',
            threshold: 0,
            animation: false,
            lineWidth: 1,
            shadow: false,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            marker: {
              radius: 1,
              states: {
                hover: {
                  radius: 2,
                },
              },
            },
            fillOpacity: 0.25,
          },
        },
        legend: {
          enabled: false,
        },
        series: [],
      },
    };
  }

  /**
   * Lifecycle function that runs upon component loading
   */
  componentDidMount() {
    const { symbol, interval, range } = this.state;
    instrumentService.chartmulti({
      region: 'AU',
      symbol,
      interval,
      range,
      lang: 'en',
      callback: (data) => {
        const volumes = data.chart.result[0].indicators.quote[0].volume;
        const dates = data.chart.result[0].timestamp.map(item => item * 1000);
        const mergedVolumes = dates.map((x, i) => [x, volumes[i]]);
        this.setState({
          chartOptions: {
            series: [
              {
                type: 'column', name: 'Volume', yAxis: 0, data: mergedVolumes,
              },
            ],
          },
        });
      },
    });
  }

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  render() {
    const { chartOptions } = this.state;
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    );
  }
}

export default MiniBarChart;
