import React, { Component } from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import MultiSearchBar from './MultiChartSearchBar';
import MultiStockChart from './MultiStockChart';
import instrumentService from '../../services/instrumentService';

/**
 * A stock chart component with accompanying gui
 */
class StockChartWithGui extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { symbol } = props;
    this.state = {
      symbol,
      range: props.range || '5y',
      interval: props.interval || '1d',
      selectedSymbols: [],
      series: [],
      yScale: [
        { key: 'linear', value: 'linear', text: 'Linear' },
        { key: 'logarithmic', value: 'logarithmic', text: 'Logarithmic' },
      ],
      rangeOptions: [
        { key: '1d', value: '1d', text: '1d' },
        { key: '5d', value: '5d', text: '5d' },
        { key: '1mo', value: '1mo', text: '1mo' },
        { key: '3mo', value: '3mo', text: '3mo' },
        { key: '6mo', value: '6mo', text: '6mo' },
        { key: '1y', value: '1y', text: '1y' },
        { key: '2y', value: '2y', text: '2y' },
        { key: '5y', value: '5y', text: '5y' },
        { key: '10y', value: '10y', text: '10y' },
        { key: 'ytd', value: 'ytd', text: 'ytd' },
        { key: 'max', value: 'max', text: 'max' },
      ],
      intervalOptions: [
        { key: '1m', value: '1m', text: '1m' },
        { key: '2m', value: '2m', text: '2m' },
        { key: '5m', value: '5m', text: '5m' },
        { key: '15m', value: '15m', text: '15m' },
        { key: '60m', value: '60m', text: '60m' },
        { key: '1d', value: '1d', text: '1d' },
      ],
      yScaleValue: 'linear',
    };
    this.handleSelectedSymbols = this.handleSelectedSymbols.bind(this);
    this.selectScale = this.selectScale.bind(this);
    this.selectRange = this.selectRange.bind(this);
    this.selectInterval = this.selectInterval.bind(this);
  }

  /**
   * Lifecycle method that runs upon the completed loading of a component
   */
  componentDidMount() {
    this.loadData();
  }


  /**
   * Handles incoming selected symbols to save for display
   * @param {Array} incomingSymbols - sets the state with symbols to display data of
   */
  handleSelectedSymbols(incomingSymbols) {
    let symbols;
    const { range, interval } = this.state;

    if (incomingSymbols.length > 0) {
      symbols = incomingSymbols.join(',');
    }
    this.setState({ selectedSymbols: incomingSymbols });
    this.loadData(symbols, range, interval);
  }

  /**
   * Sets scaling type for graph
   * @param {Object} e - unused
   * @param {String} value - desired scale for graph
   */
  selectScale(e, { value }) {
    const { selectedSymbols, range, interval } = this.state;
    this.setState({ yScaleValue: value });
    this.loadData(selectedSymbols.join(','), range, interval);
  }

  /**
   * Sets time period for data series display
   * @param {Object} e - unused
   * @param {int} range - desired overall time period to display data series
   */
  selectRange(e, { value }) {
    const { selectedSymbols, interval } = this.state;
    this.setState({ range: value });
    this.loadData(selectedSymbols.join(','), value, interval);
  }

  /**
   * Set interval between data series should be plotted
   * @param {Object} e - unused
   * @param {int} interval - interval between data series should be plotted
   */
  selectInterval(e, { value }) {
    const { selectedSymbols, range } = this.state;
    this.setState({ interval: value });

    this.loadData(selectedSymbols.join(','), range, value);
  }

  /**
   * Load all relevant data for graph construction
   * @param {Array} symbols - symbols to be display
   * @param {int} inputRange - range over which to display symbols
   * @param {int} inputInterval - interval between data points
   */
  loadData(symbols, inputRange, inputInterval) {
    /**
     * Initial state
     */
    const { symbol, range, interval } = this.state;

    /**
     * create a multichart using the instrument service
     */
    instrumentService.chartmulti({
      region: 'AU',
      symbol,
      yScale: 'linear',
      interval: inputInterval || interval,
      range: inputRange || range,
      lang: 'en',
      comparisons: symbols,
      callback: (data) => {
        const { open } = data.chart.result[0].indicators.quote[0];
        const { high } = data.chart.result[0].indicators.quote[0];
        const { low } = data.chart.result[0].indicators.quote[0];
        const { close } = data.chart.result[0].indicators.quote[0];
        const volumes = data.chart.result[0].indicators.quote[0].volume;
        const dates = data.chart.result[0].timestamp.map(item => item * 1000);
        const mergedSeries = dates.map((x, i) => [x, open[i], high[i], low[i], close[i]]);

        const mergedVolumes = dates.map((x, i) => [x, volumes[i]]);
        const newSeries = [
          {
            name: `${symbol} Price`, type: 'ohlc', yAxis: 0, data: mergedSeries, id: `${symbol}-price`,
          },
          {
            name: `${symbol} Volume`, type: 'column', yAxis: 1, data: mergedVolumes, id: `${symbol}-volume`,
          },
        ];

        /**
         * Use comparisons in chart if specified
         */
        if ('comparisons' in data.chart.result[0]) {
          data.chart.result[0].comparisons.forEach((symbolItem) => {
            const newData = dates.map((x, i) => [x, symbolItem.close[i]]);
            newSeries.push({
              name: `${symbolItem.symbol} Close`, type: 'line', yAxis: 0, data: newData,
            });
          });
        }
        this.setState({ series: newSeries });
      },
    });
  }

  /**
   * Renders component - formatting
   * @return {ReactElement} markup
   */
  render() {
    const {
      series,
      yScaleValue,
      yScale,
      range,
      rangeOptions,
      interval,
      intervalOptions,
    } = this.state;

    /**
     * Renders component
     * Chart is constructed by wedging components into grid layout
     * @return {ReactElement} markup
     */
    return (
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <MultiStockChart
              yScale={yScaleValue}
              series={series}
              range={range}
              interval={interval}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Dropdown
              options={rangeOptions}
              onChange={this.selectRange}
              value={range}
            />
            <Dropdown
              options={intervalOptions}
              onChange={this.selectInterval}
              value={interval}
            />
            <Dropdown
              options={yScale}
              onChange={this.selectScale}
              value={yScaleValue}
            />
          </Grid.Column>
          <Grid.Column>
            <MultiSearchBar onSelectedSymbols={this.handleSelectedSymbols} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default StockChartWithGui;
