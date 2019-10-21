import moment from 'moment';
import React, { Component } from 'react';
import { DateTimeInput } from 'semantic-ui-calendar-react';

import {
  Card, Form, Button, Label, Dropdown, Icon,
} from 'semantic-ui-react';
import portfolioService from '../../../services/portfolioService';
import SearchBar from '../../searchbars/SearchBar';

/**
 * A modal for creating a transaction for an instrument
 */
export default class CreateTransactionModal extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    const { portfolioId, defaultPrice, defaultsymbol } = this.props;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString();
    this.state = {
      portfolioId,
      error: false,
      isoDate,
      date: currentDate.toLocaleString(),
      price: defaultPrice || 0,
      selectedSymbol: defaultsymbol,
      portfolios: [],
    };
  }

  /**
   * Sets the default values for specified props
   * @param {object} default symbol and price to load into modal
   */
  componentWillReceiveProps({ defaultSymbol, defaultPrice }) {
    this.setState({ price: defaultPrice || 0, selectedSymbol: defaultSymbol });
  }

  /**
   * Lifecycle method that runs when this component mounts
   */
  componentDidMount = () => {
    const { portfolioId } = this.state;

    if (!portfolioId) {
      this.populatePortfolios();
    }
  };

  /**
   * Loads relevant portfolios upon component mounting
   */
  populatePortfolios = () => {
    portfolioService.getPortfolios(portfolios => this.setState({ portfolios }));
  };

  /**
   * Creates a given transaction upon user submission with the data entered
   * Utilises the portfolio service
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleSubmit = async (event) => {
    const {
      selectedSymbol,
      isoDate,
      transactionType,
      price,
      portfolioId,
      selectedPortfolio,
    } = this.state;
    const { toggleCreator } = this.props;
    const units = event.target.units.value;
    const symbol = selectedSymbol;
    const date = isoDate;
    /* Creation of transaction object to construct in service */
    const transaction = {
      price,
      symbol,
      units,
      date,
      portfolioId: portfolioId || selectedPortfolio,
      transactionType,
    };
    portfolioService
      .createTransaction(transaction, () => {})
      .then(() => toggleCreator({ added: symbol }));
  };

  /**
   * Handles changing of the date from selection within calendar popup
   * Requires attention to formatting
   * @param {String} value - actual date decided for transaction to be formatted and converted
   * to date object
   */
  handleDateChange = (event, { value }) => {
    const dateObj = moment(value, 'DD/MM/YYYY hh/mm').toDate();
    this.setState({ date: dateObj.toLocaleString(), isoDate: dateObj.toISOString() });
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      error,
      date,
      price,
      portfolios,
      portfolioId,
      selectedSymbol,
      selectedPortfolio,
    } = this.state;
    const { toggleCreator, defaultSymbol } = this.props;
    return (
      <Card className="centered">
        <Card.Content className="raised">
          <Card.Header>Add a Transaction</Card.Header>
          {/* Card to add a transaction via a form, using search bar, calendar, and text input */}
          <Card.Description>
            <Form onSubmit={this.handleSubmit}>
              {!portfolioId && (
                <Form.Field>
                  <Dropdown
                    label="Portfolio"
                    placeholder="Select a portfolio"
                    fluid
                    name="portfolio"
                    selection
                    onChange={(e, { value }) => this.setState({ selectedPortfolio: value })}
                    options={portfolios.map(portfolio => ({
                      key: portfolio.id,
                      text: portfolio.name,
                      value: portfolio.id,
                    }))}
                  />
                </Form.Field>
              )}
              <Form.Field>
                <label htmlFor="symbolSearch">Search for Symbol</label>

                <SearchBar
                  id="symbolSearch"
                  defaultsymbol={defaultSymbol}
                  onSelect={(newSelectedSymbol) => {
                    if (typeof newSelectedSymbol === 'string') {
                      this.setState({ selectedSymbol: newSelectedSymbol });
                    }
                  }}
                />
              </Form.Field>
              <Form.Field name="Purchased Date">
                <DateTimeInput
                  label="Purchased Date"
                  name="date"
                  clearable
                  clearIcon={<Icon name="remove" color="red" />}
                  placeholder="Date"
                  animation="false"
                  maxDate={new Date()}
                  value={date}
                  iconPosition="left"
                  onChange={this.handleDateChange}
                />
              </Form.Field>
              <Form.Input name="units" label="units" type="number" step=".0001" />
              <Form.Input
                name="price"
                label="price"
                type="number"
                step=".01"
                value={price}
                onChange={e => this.setState({ price: e.target.value })}
              />
              {/* Provide both buy and cell options */}
              <Button
                alt="Buy"
                className="brandButton"
                primary
                disabled={!(selectedSymbol && (portfolioId || selectedPortfolio))}
                type="submit"
                onClick={() => this.setState({ transactionType: 1 })}
              >
                Buy
              </Button>
              <Button
                secondary
                alt="sell"
                disabled={!(selectedSymbol && (portfolioId || selectedPortfolio))}
                type="submit"
                onClick={() => this.setState({ transactionType: 2 })}
              >
                Sell
              </Button>
              {error && <Label className="errorText">{error}</Label>}
              <Button alt="cancel" basic floated="right" onClick={() => toggleCreator()}>
                Cancel
              </Button>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
