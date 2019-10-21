import React, { Component } from 'react';
import {
  Label, Table, Icon, Loader, Modal, Button,
} from 'semantic-ui-react';
import { map as loMap, sortBy } from 'lodash';
import moment from 'moment';
import history from '../../../helpers/history';
import OptionsModal from '../OptionsModal';

/**
 * Default options given to transaction table population
 */
const defaultOptions = [
  {
    name: 'Transaction Date',
    identifier: 'transactionDate',
    enabled: true,
    getValue: ({ detail }) => (
      <div>
        {moment(detail.transaction_date).format('DD-MM-YYYY, HH:mm ')}
        <br />
        {moment() > moment(detail.transaction_date).add(1, 'year') && (
          <Label color="teal">Capital Gains eligible</Label>
        )}
      </div>
    ),
  },
  {
    name: 'Market Price',
    identifier: 'marketPrice',
    enabled: true,
    getValue: ({ stock, detail }) => (detail.transaction_type_id === 1 ? parseFloat(stock.regularMarketPrice).toFixed(2) : ''),
  },
  {
    name: 'Market Value',
    identifier: 'totalCurrentValue',
    enabled: true,
    getValue: ({ stock, detail }) => (detail.transaction_type_id === 1
      ? parseFloat(detail.units * stock.regularMarketPrice).toFixed(2)
      : ''),
  },
  {
    name: 'Daily Gain/Loss',
    identifier: 'dailyGainLoss',
    enabled: true,
    getValue: ({ stock, detail }) => (
      <div className={stock.regularMarketChangePercent > 0 ? 'dailyGain' : 'dailyLoss'}>
        {`${(stock.regularMarketChangePercent > 0 ? '+' : '')
          + parseFloat(
            (stock.regularMarketPrice - stock.regularMarketPreviousClose) * detail.units,
          ).toFixed(2)}
        (${stock.regularMarketChangePercent > 0 ? '+' : ''}
        ${parseFloat(stock.regularMarketChangePercent).toFixed(2)} %)`}
      </div>
    ),
  },
  {
    name: 'Total Gain/Loss',
    identifier: 'totalGainLoss',
    enabled: true,
    getValue: ({ stock, detail }) => (
      <div className={stock.regularMarketPrice > detail.price ? 'dailyGain' : 'dailyLoss'}>
        {detail.transaction_type_id === 1
          ? `${(stock.regularMarketPrice > detail.price ? '+' : '')
              + parseFloat(
                detail.units * stock.regularMarketPrice - detail.units * detail.price,
              ).toFixed(2)} (${stock.regularMarketChangePercent > 0 ? '+' : ''}${parseFloat(
            ((detail.units * stock.regularMarketPrice - detail.units * detail.price)
                / (detail.units * stock.regularMarketPrice))
                * 100,
          ).toFixed(2)} %)`
          : ''}
      </div>
    ),
  },
];

/**
 * A table to display the transactions within a portfolio in a sorted fashion
 */
class SortedTransactionTable extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    const { summary } = this.props;
    this.state = {
      column: null,
      stockData: [],
      summary,
      direction: null,
      isLoaded: false,
      options: defaultOptions,
      showOptions: false,
    };
  }

  /**
   * Lifecycle method that runs when this component mounts
   */
  componentDidMount() {
    const { stockData, isLoaded, summary } = this.props;
    this.setState({ stockData, isLoaded, summary });
  }

  /**
   * Setting state after component mounting
   * @param {Object} - relevant stockdata, where component has loaded, and its summary
   */
  componentWillReceiveProps({ stockData, isLoaded, summary }) {
    this.setState({ stockData, isLoaded, summary });
  }

  /**
   * Formatting numbers to include commas
   */
  numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * Sorting rule/function for table depending on catgeory selection
   */
  bySorter = key => elements => (
    !Number.isNaN(elements[key]) ? elements[key] : parseFloat(elements[key])
  );

  /**
   * Updates the sorting options
   * @param {Objection} newOptions - options for sorting the table of transactions
   */
  updateOptions = (newOptions) => {
    this.setState({ options: newOptions, showOptions: false });
  };

  /**
   * Opens sorting options (shows modal)
   */
  openOptions = () => {
    this.setState({ showOptions: true });
  };

  /**
   * Handles re-sorting upon changing the sorting rule for the table
   */
  handleSort = clickedColumn => () => {
    const { column, summary, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        summary: sortBy(summary, this.bySorter(clickedColumn)),
        direction: 'ascending',
      });

      return;
    }

    this.setState({
      summary: summary.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  /**
   * Ensure numbers are formatted the same
   * @param {string} value - a number to have commas added
   * @returns {string} tidyValue - a number separated by commas at the thousands places.
   */
  tidy = value => (!Number.isNaN(value) ? value : this.numberWithCommas(value));

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      column, summary, direction, isLoaded, stockData, options, showOptions,
    } = this.state;
    const { portfolio_id: portfolioID, handleDelete } = this.props;

    return isLoaded ? (
      <Table padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'transaction_type_id' ? direction : null}
              onClick={this.handleSort('transaction_type_id')}
            >
              Transaction
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'units' ? direction : null}
              onClick={this.handleSort('units')}
            >
              Units
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'value' ? direction : null}
              onClick={this.handleSort('value')}
            >
              Price
            </Table.HeaderCell>
            {loMap(
              options,
              option => option.enabled && (
              <Table.HeaderCell
                key={option.identifier}
                sorted={column === option.identifier ? direction : null}
                onClick={this.handleSort(option.identifier)}
              >
                {option.name}
              </Table.HeaderCell>
              ),
            )}
            <Table.HeaderCell>
              <Modal
                open={showOptions}
                trigger={(
                  <Button alt="settings" basic icon onClick={() => this.openOptions()}>
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
        <Table.Body>
          {loMap(summary, (detail) => {
            const stock = stockData.find(item => item.symbol === detail.symbol);
            return (
              <Table.Row
                key={detail.id}
                className={
                  parseFloat(stock.regularMarketPrice) >= parseFloat(detail.price)
                    ? 'positive'
                    : 'negative'
                }
                onClick={() => history.push(`/portfolios/${portfolioID}/transactions/${detail.symbol}`)
                }
              >
                <Table.Cell>{detail.transaction_type_id === 1 ? 'BUY' : 'SELL'}</Table.Cell>
                <Table.Cell>{parseFloat(detail.units).toFixed(2)}</Table.Cell>
                <Table.Cell>
$
                  {parseFloat(detail.price).toFixed(2)}
                </Table.Cell>
                {loMap(
                  options,
                  option => option.enabled && (
                  <Table.Cell key={option.identifier}>
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
                <Table.Cell collapsing>
                  <Label as="a" onClick={() => handleDelete(detail.id)} basic>
                    <Icon floated="right" name="minus" />
                  </Label>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    ) : (
      <Loader active inline="centered" />
    );
  }
}

export default SortedTransactionTable;
