import React, { Component } from 'react';
import {
  Label, Table, Icon, Loader, Modal, Button,
} from 'semantic-ui-react';
import { map as loMap, sortBy } from 'lodash';
import OptionsModal from '../OptionsModal';
import history from '../../../helpers/history';

/**
 * Default watchlist sorting options
 */
const defaultOptions = [
  {
    name: 'Market Volume',
    identifier: 'regularMarketVolume',
    enabled: true,
    getValue: stock => stock.regularMarketVolume,
  },
];

/**
 * A react class that displays a table of created watchlists.
 */
class WatchlistTable extends Component {
  /**
 * constructor
 * @param {object} props
 */
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      data: [],
      direction: null,
      isLoaded: false,
      options: defaultOptions,
      showOptions: false,
    };
  }

  /**
   * Lifecycle function for setting state after mounting of component
   */
  componentWillReceiveProps({ data, isLoaded }) {
    this.setState({ data, isLoaded });
  }

  /**
   * Updates the class' state with new options provided
   * @param {Array<String>} newOptions - new options for what the watchlist table should display.
   *  */
  updateOptions = (newOptions) => {
    this.setState({ options: newOptions, showOptions: false });
  };

  /**
   * Opens the options to sort watchlists
   */
  openOptions = () => {
    this.setState({ showOptions: true });
  };

  /**
   * Parses and reformats a numbers to include commas in display
   */
  numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * A sorting function to re-sort display depending on the column clicked
   */
  bySorter = key => elements => (
    Number.isNaN(elements[key]) ? elements[key] : parseFloat(elements[key])
  );

  /**
   * Handles sorting upon a column click from a user, wrapping around the bySorter function
   */
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: sortBy(data, this.bySorter(clickedColumn)),
        direction: 'ascending',
      });

      return;
    }
    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  /**
   * Reformats values to include commas
   */
  tidy = value => (Number.isNaN(value) ? value : this.numberWithCommas(value));

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      column, data, direction, isLoaded, options, showOptions,
    } = this.state;
    if (isLoaded) {
      const { watchlist, onDelete } = this.props;
      const { watchlist_details: watchlistDetails } = watchlist;
      if (watchlistDetails) {
        return (
          <Table sortable padded basic>
            {/* <Table sortable celled padded basic fixed> */}
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  key="symbol"
                  sorted={column === 'symbol' ? direction : null}
                  onClick={this.handleSort('symbol')}
                >
                  Instrument
                </Table.HeaderCell>
                <Table.HeaderCell
                  key="regularMarketPrice"
                  sorted={column === 'regularMarketPrice' ? direction : null}
                  onClick={this.handleSort('regularMarketPrice')}
                >
                  Market Price
                </Table.HeaderCell>
                {loMap(
                  options,
                  option => option.enabled && (
                  <Table.HeaderCell
                    key={option.identifier}
                    sorted={column === option.identifier ? direction : null}
                    onClick={() => {
                      this.handleSort(option.identifier);
                    }}
                  >
                    {option.name}
                  </Table.HeaderCell>
                  ),
                )}
                <Table.HeaderCell key="trash">
                  <Modal
                    open={showOptions}
                    trigger={(
                      <Button alt="options" basic icon onClick={() => this.openOptions()}>
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
              {loMap(data, (stock) => {
                const {
                  symbol, regularMarketPrice, regularMarketChange, longName,
                } = stock;
                const watchlistDetail = watchlistDetails.find(detail => detail.symbol === symbol);
                return (
                  <Table.Row key={watchlistDetail.id}>
                    <Table.Cell key="name" onClick={() => history.push(`/instruments/${symbol}`)}>
                      <b>{symbol}</b>
                      {' '}
                      <br />
                      {' '}
                      {longName}
                      {' '}
                    </Table.Cell>
                    <Table.Cell key="regularMarketPrice">
                      $
                      {regularMarketPrice}
                      {' '}
                      {regularMarketChange >= 0 ? (
                        <Icon name="caret up" />
                      ) : (
                        <Icon name="caret down" />
                      )}
                    </Table.Cell>
                    {loMap(
                      options,
                      option => option.enabled && (
                      <Table.Cell key={option.identifier}>
                        {this.tidy(option.getValue(stock))}
                      </Table.Cell>
                      ),
                    )}
                    <Table.Cell collapsing>
                      <Label as="a" onClick={() => onDelete(watchlistDetail.id)} basic>
                        <Icon floated="right" name="minus" />
                      </Label>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        );
      }
    }
    return <Loader active inline="centered" />;
  }
}

export default WatchlistTable;
