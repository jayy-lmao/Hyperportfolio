import React, { Component } from 'react';
import {
  Table, Loader, Button, Modal, Icon,
} from 'semantic-ui-react';
import { map as loMap, remove as loRemove, sortBy } from 'lodash';
import portfolioService from '../../../services/portfolioService';
import history from '../../../helpers/history';
import SparkLine from '../../charts/Sparkline';
import MiniBarChart from '../../charts/MiniBarChart';
import OptionsModal from '../OptionsModal';

/**
 * Format a number to include commas
 */
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Default options to display the portfolio summary table
 */
const defaultOptions = [
  {
    name: 'Avg. Price',
    identifier: 'avgPrice',
    enabled: true,
    getValue: ({ detail }) => numberWithCommas(parseFloat(detail.average_price).toFixed(2)),
  },
  {
    name: 'Market Price',
    identifier: 'marketPrice',
    enabled: true,
    getValue: ({ stock }) => numberWithCommas(parseFloat(stock.regularMarketPrice).toFixed(2)),
  },
  {
    name: 'Market Value',
    identifier: 'marketValue',
    enabled: true,
    getValue: ({ stock, detail }) => numberWithCommas(
      parseFloat(detail.units * stock.regularMarketPrice).toFixed(2),
    ),
  },
  {
    name: 'Daily Gain/Loss',
    identifier: 'dailyGainLoss',
    enabled: true,
    getValue: ({ stock, detail }) => (
      /**
       * Apply appropriate class for red/green highlighting with negative/positive numbers
       */
      <p className={stock.regularMarketChangePercent > 0 ? 'dailyGain' : 'dailyLoss'}>
        {`${(stock.regularMarketChangePercent > 0 ? '+' : '')
          + parseFloat(
            (stock.regularMarketPrice - stock.regularMarketPreviousClose) * detail.units,
          ).toFixed(2)}
        (${stock.regularMarketChangePercent > 0 ? '+' : ''}
        ${numberWithCommas(
          parseFloat(stock.regularMarketChangePercent).toFixed(2),
        )} %)`}
      </p>
    ),
  },
  {
    name: 'Total Gain/Loss',
    identifier: 'totalGainLoss',
    enabled: true,
    getValue: ({ stock, detail }) => (
      /**
       * Apply appropriate class for red/green highlighting with negative/positive numbers
       */
      <p className={stock.regularMarketPrice > detail.average_price ? 'dailyGain' : 'dailyLoss'}>
        {`${(stock.regularMarketPrice > detail.average_price ? '+' : '')
          + numberWithCommas(
            parseFloat(detail.units * stock.regularMarketPrice - detail.value).toFixed(2),
          )} (${(stock.regularMarketPrice > detail.average_price ? '+' : '')
          + numberWithCommas(
            parseFloat(
              ((detail.units * stock.regularMarketPrice - detail.value) / detail.value) * 100,
            ).toFixed(2),
          )} %)`}
      </p>
    ),
  },
];

/**
 * Portfolio table for display of portfolios in a list
 */
class PortfolioTable extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { summary } = this.props;
    this.state = {
      column: null,
      stockData: [],
      data: [],
      direction: null,
      showOptions: false,
      options: defaultOptions,
      isLoaded: false,
      summary,
    };
  }

  /**
   * Lifecycle function which runs after a component has loaded
   */
  componentDidMount() {
    const { stockData, isLoaded, summary } = this.props;
    this.setState({ stockData, isLoaded, summary });
  }

  /**
   * Fuction that runs to load state after component mounting
   * @param {Object} relevant information to set state
   */
  componentWillReceiveProps({ stockData, isLoaded, summary }) {
    this.setState({ stockData, isLoaded, summary });
  }

  /**
   * Updates the state with given options
   * @param {Object} new options to update state
   */
  updateOptions = (newOptions) => {
    this.setState({ options: newOptions, showOptions: false });
  };

  /**
   * Opens options modal for sorting table
   */
  openOptions = () => {
    this.setState({ showOptions: true });
  };

  /**
   * Formats number to include commas
   */
  numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * Sorter for table - identifies if a number requires parsing
   */
  bySorter = key => elements => (
    !Number.isNaN(elements[key]) ? elements[key] : parseFloat(elements[key])
  );

  /**
   * Handles the sorting of data depending on chosen column
   */
  handleSort = clickedColumn => () => {
    const {
      column, data, stockData, direction,
    } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: sortBy(data, this.bySorter(clickedColumn)),
        stockData: sortBy(stockData, this.bySorter(clickedColumn)),
        direction: 'ascending',
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      stockData: stockData.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  /**
   * Handles the deletion of portfolio details
   * @param {String} id - id of portfolio details to delete
   */
  handleDelete = (id) => {
    const { data } = this.state;
    portfolioService.deletePortfolioDetails(id);
    const newData = loRemove(data, datum => datum.detailId !== id);
    this.setState({ data: newData });
  };

  /**
   * Formats numbers depending on if it is required
   */
  tidy = value => (
    !Number.isNaN(value) ? value : this.numberWithCommas(value)
  );

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      column, summary, direction, isLoaded, stockData, options, showOptions,
    } = this.state;
    const { portfolioId } = this.props;

    return isLoaded ? (
      <Table basic padded>
        {/* <Table sortable celled padded basic fixed> */}
        <Table.Header>
          {/* Overall portfolio analysis and summary */}
          <Table.Row key="headers">
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={this.handleSort('name')}
            >
              Instrument
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'units' ? direction : null}
              onClick={this.handleSort('units')}
            >
              Units
            </Table.HeaderCell>
            {loMap(
              options,
              option => option.enabled && (
              <Table.HeaderCell
                key={`header${option.identifier}`}
                sorted={column === option.identifier ? direction : null}
                onClick={this.handleSort(option.identifier)}
              >
                {option.name}
              </Table.HeaderCell>
              ),
            )}
            <Table.HeaderCell>Price/Volume Trends</Table.HeaderCell>
            <Table.HeaderCell>
              <Modal
                open={showOptions}
                trigger={(
                  <Button
                    alt="settings"
                    basic
                    floated="right"
                    icon
                    onClick={() => this.openOptions()}
                  >
                    <Icon name="settings" />
                  </Button>
)}
                basic
                dimmer="inverted"
              >
                <OptionsModal options={options} updateOptions={this.updateOptions} />
              </Modal>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {/* All categories for portfolio summaries in table */}
        <Table.Body>
          {loMap(summary, (detail) => {
            const stock = stockData.find(item => item.symbol === detail.symbol);
            if (stock) {
              const { symbol, longName } = stock;
              return (
                <Table.Row
                  key={`row-${detail.symbol}`}
                  className={
                    parseFloat(detail.units * stock.regularMarketPrice - detail.value) >= 0
                      ? 'positive'
                      : 'negative'
                  }
                  id="portfolio-table"
                  onClick={() => history.push(`/portfolios/${portfolioId}/transactions/${detail.symbol}`)
                  }
                >
                  <Table.Cell key="longName" onClick={() => history.push(`/instruments/${symbol}`)}>
                    <b>{symbol}</b>
                    {' '}
                    <br />
                    {' '}
                    {longName}
                    {' '}
                  </Table.Cell>
                  <Table.Cell>{parseFloat(detail.units).toFixed(2)}</Table.Cell>
                  {loMap(
                    options,
                    option => option.enabled && (
                    <Table.Cell key={`${detail.symbol}${option.identifier}`}>
                      {this.tidy(option.getValue({ detail, stock }))}
                      {option.identifier === 'marketPrice'
                            && (stock.regularMarketChange >= 0 ? (
                              <Icon name="caret up" />
                            ) : (
                              <Icon name="caret down" />
                            ))}
                    </Table.Cell>
                    ),
                  )}
                  <Table.Cell key="sparkline">
                    <SparkLine symbol={detail.symbol} range="1d" interval="60m" />
                  </Table.Cell>
                  <Table.Cell key="mini-bar-chart">
                    <MiniBarChart symbol={detail.symbol} range="1d" interval="60m" />
                  </Table.Cell>
                </Table.Row>
              );
            }
            return <Table.Row key="loader"><Table.Cell><Loader active inline="centered" /></Table.Cell></Table.Row>;
          })
          }
        </Table.Body>
      </Table>
    ) : (
      <Loader active inline="centered" />
    );
  }
}

export default PortfolioTable;
