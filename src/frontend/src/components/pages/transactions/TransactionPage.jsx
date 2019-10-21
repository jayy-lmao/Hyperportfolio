import React, { Component } from 'react';
import { remove as loRemove } from 'lodash';
import {
  Button, Container, Divider, Icon, Modal, Step,
} from 'semantic-ui-react';
import Navbar from '../../navbar/Navbar';
import portfolioService from '../../../services/portfolioService';
import instrumentService from '../../../services/instrumentService';
import CreateTransactionModal from './CreateTransactionModal';
import SortedTransactionTable from './TransactionTable';
import history from '../../../helpers/history';

/**
 * Displays the history of transactions in a table
 */
class TransactionList extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      portfolio: null,
      id: null,
      editor: false,
      creator: false,
      summary: [],
      data: [],
      isLoaded: false,
    };
    const { match } = this.props;
    const { id } = match.params;
    const { symbol } = match.params;
    this.tracker([symbol]);
    portfolioService.getPortfolio(id, (portfolio) => {
      this.setState({ portfolio, id });
    });
    portfolioService.getPortfolioInstrumentTransactions(id, symbol, (summary) => {
      this.setState({ summary });
    });
  }

  /**
   * Toggles a modal upon user clicking delete with transactions
   */
  onDelete = () => {
    this.toggleConfirmOpen();
    history.push('/portfolios');
  };

  /**
   * Handles deletion of portfolio upon user submission
   * @param {object} event - provides relevant page functionality
   */
  handleDelete = async (event) => {
    event.preventDefault();
    const { id } = this.state;
    portfolioService.deletePortfolio(id, this.onDelete);
  };

  /**
   * Toggles confirmation modal
   */
  toggleConfirmOpen = () => {
    const { confirmOpen } = this.state;
    this.setState({ confirmOpen: !confirmOpen });
  };

  /**
   * Toggles editor modal and saves result
   * @param {object} portfolio - portfolio to toggle editor for
   */
  toggleEditor = (portfolio) => {
    const { editor } = this.state;
    this.setState({ editor: !editor });
    if (editor && portfolio) {
      this.setState({ portfolio });
    }
  };

  /**
   * Retrieves relevant symbol data (setting state)
   * @param {Object} response - response from service call with relevant symbol data
   */
  getSymbolData = (response) => {
    this.setState({ data: response.result, isLoaded: true });
  };

  /**
   * Retrieves table data with relevant symbols inputted
   * @param {Array<String>} symbols - list of symbols to table data for
   */
  getTableData = async (symbols) => {
    instrumentService.quotes({
      symbols,
      callback: this.getSymbolData,
    });
  };

  /**
   * Loads tracker for table display
   * @param {Array<String>} symbols - list of symbols to load tracker for
   */
  tracker = (symbols) => {
    if (symbols.length !== 0) {
      this.getTableData(symbols);
      setInterval(() => this.getTableData(symbols), 300000);
    }
  };

  /**
   * Handles the deletion of a transaction upon user submission, updating summaries
   * @param {string} id - id of the transaction to delete.
   */
  handleTransactionDelete = (id) => {
    const { portfolio, summary } = this.state;
    portfolioService.deletePortfolioTransaction(id, () => {});
    const newSummary = loRemove(summary, datum => datum.id !== id);
    this.setState({ summary: newSummary });
    if (newSummary.length === 0) {
      history.push(`/portfolios/${portfolio.id}/`);
    }
  };

  /**
   * Toggles transaction creator and utilises portfolio services to retrieve existing transactions
   */
  toggleCreator = () => {
    const { creator } = this.state;
    this.setState({ creator: !creator });
    const { match } = this.props;
    const { id } = match.params;
    const { symbol } = match.params;
    if (creator) {
      portfolioService.getPortfolioInstrumentTransactions(id, symbol, (summary) => {
        const symbols = summary.map(item => item.symbol);
        this.setState({ summary });
        this.tracker(symbols);
      });
    }
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      portfolio, summary, id, creator, data, isLoaded,
    } = this.state;
    const { match } = this.props;
    const { symbol } = match.params;
    const summaryLoaded = summary && summary.length !== 0;
    return (
      <Container>
        <Navbar page="Portfolios" />
        {/* Step component for path history */}
        <Step.Group unstackable size="mini">
          <Step as="a" onClick={() => history.push('/portfolios/')}>
            <Icon size="small" name="chart line" />
            <Step.Content>
              <Step.Title>Portfolios</Step.Title>
              <Step.Description>Manage Portfolios</Step.Description>
            </Step.Content>
          </Step>
          {portfolio && (
            <Step as="a" onClick={() => history.push(`/portfolios/${id}`)}>
              <Icon size="small" name="file alternate outline" />
              <Step.Content>
                <Step.Title>{portfolio.name}</Step.Title>
                <Step.Description>{portfolio.description}</Step.Description>
              </Step.Content>
            </Step>
          )}
          {portfolio && (
            <Step
              active
              as="a"
              onClick={() => history.push(`/portfolios/${id}/transactions/${symbol}`)}
            >
              <Icon size="small" name="lightbulb outline" />
              <Step.Content>
                <Step.Title>{symbol}</Step.Title>
                <Step.Description>{data.length > 0 && data[0].longName}</Step.Description>
              </Step.Content>
            </Step>
          )}
        </Step.Group>
        <br />
        {/* Modal for creation and edit */}
        <Modal
          className="CreatorModal"
          basic
          dimmer="inverted"
          onClose={this.componentDidMount}
          open={creator}
        >
          {portfolio && (
            <CreateTransactionModal
              defaultsymbol={symbol}
              defaultPrice={data.length > 0 && data[0].regularMarketPrice}
              toggleCreator={this.toggleCreator}
              portfolioId={portfolio.id}
            />
          )}
        </Modal>
        <br />
        <br />
        <Divider />
        {/* Transaction functionality */}
        <Button
          alt="add transaction"
          basic
          compact
          onClick={() => this.toggleCreator()}
          size="tiny"
          content="Add transaction"
          icon="plus"
          labelPosition="right"
        />
        {summaryLoaded && portfolio && (
          <SortedTransactionTable
            portfolioId={portfolio.id}
            stockData={data}
            isLoaded={isLoaded}
            summary={summary}
            portfolio={portfolio}
            handleDelete={this.handleTransactionDelete}
          />
        )}
      </Container>
    );
  }
}

export default TransactionList;
