import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import axios from 'axios';
import instrumentService from '../../services/instrumentService';

const { CancelToken } = axios;

/**
 * Small chart for portfolio graph summaries
 * Uses Highcharts
 */
class SparkLine extends React.Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const source = CancelToken.source();
    const { symbol, range, interval } = this.props;
    this.state = {
      source,
      symbol,
      range,
      interval,
      chart_options: {
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

          // small optimalization, saves 1-2 ms each sparkline
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
            color: '#006600',
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
   * Lifecycle method that runs upon the mounting of a component
   */
  componentDidMount() {
    const {
      source, symbol, interval, range,
    } = this.state;
    instrumentService.chartmulti({
      cancelToken: source.token,
      region: 'AU',
      symbol,
      interval,
      range,
      lang: 'en',
      callback: (data) => {
        const series = data.chart.result[0].indicators.quote[0].close;
        const dates = data.chart.result[0].timestamp.map(item => item * 1000);
        const mergedSeries = dates.map((x, i) => [x, series[i]]);
        this.setState({
          chart_options: {
            series: [
              {
                type: 'area',
                name: 'Close',
                yAxis: 0,
                data: mergedSeries,
              },
            ],
            plotOptions: {
              series: {
                threshold: data.chart.result[0].indicators.quote[0].open[0],
              },
            },
          },
        });
      },
    });
  }

  /**
   * Uses source to cancel axios requests
   */
  componentWillUnmount = () => {
    const { source } = this.state;
    source.cancel('Operation canceled by the user.');
  };

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  render() {
    const { chart_options: chartOptions } = this.state;
    return (
      <div className="animated fadeIn">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  }
}

export default SparkLine;
