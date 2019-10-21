import React, { Component } from 'react';
import {
  Button, Container, Confirm, Modal, Divider, Step, Icon,
} from 'semantic-ui-react';
import instrumentService from '../../../services/instrumentService';
import Navbar from '../../navbar/Navbar';
import EditPortfolioPage from './EditPortfolioModal';
import portfolioService from '../../../services/portfolioService';
import PortfolioTable from './PortfolioTable';
import CreateTransactionModal from '../transactions/CreateTransactionModal';
import history from '../../../helpers/history';

/**
 * Overall portfolio component that constructs portfolio page comprised of numerous elements
 */
class PortfolioPage extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      portfolio: null,
      id: null,
      editor: false,
      creator: false,
      confirmOpen: false,
      summary: [],
      data: [],
      isLoaded: [],
      symbols: [],
    };
    const { match } = this.props;
    const { id } = match.params;
    portfolioService.getPortfolio(id, (portfolio) => {
      this.setState({ portfolio, id });
    });
    portfolioService.getPortfolioSummaries(id, (summary) => {
      const symbols = summary.map(item => item.symbol);
      this.setState({ summary, symbols });
      this.tracker(symbols);
    });
  }

  /**
   * Called upon deletion of portfolio
   */
  onDelete = () => {
    this.toggleConfirmOpen();
    history.push('/portfolios');
  };

  /**
   * Handles deletion of portfolio
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleDelete = async (event) => {
    event.preventDefault();
    const { id } = this.state;
    portfolioService.deletePortfolio(id, this.onDelete);
  };

  /**
   * Toggle confirmation of portofolio manipulation modal open/close
   */
  toggleConfirmOpen = () => {
    const { confirmOpen } = this.state;
    this.setState({ confirmOpen: !confirmOpen });
  };

  /**
   * Toggles portfolio edit modal
   * @param {object} portfolio - A portfolio to edit.
   */
  toggleEditor = (portfolio) => {
    const { editor } = this.state;
    this.setState({ editor: !editor });
    if (editor && portfolio) {
      this.setState({ portfolio });
    }
  };

  /**
   * Toggles portfolio item creation modal
   */
  toggleCreator = () => {
    const { creator, id } = this.state;
    this.setState({ creator: !creator });
    if (creator) {
      portfolioService.getPortfolioSummaries(id, summary => this.setState(
        {
          summary,
          symbols: summary.map(item => item.symbol),
        },
        () => {
          const { symbols } = this.state;
          this.getTableData(symbols);
        },
      ));
    }
  };

  /**
   * Retrieves symbol data
   * @param {Object} response - response from service with relevant symbol data
   */
  getSymbolData = (response) => {
    this.setState({ data: response.result, isLoaded: true });
  };

  /**
   * Retrieves overall table data for portfolios
   * @param {Object} symbols - all symbols within portfolio
   */
  getTableData = async (symbols) => {
    instrumentService.quotes({
      symbols,
      callback: this.getSymbolData,
    });
  };

  /**
   * Tracks retrieval of symbol data with a timeout
   * @param {Object} symbols - list of symbols to get table data for
   */
  tracker = (symbols) => {
    if (symbols.length !== 0) {
      this.getTableData(symbols);
      setInterval(() => this.getTableData(symbols), 300000);
    }
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      portfolio, summary, confirmOpen, id, editor, creator, data, isLoaded,
    } = this.state;
    const summaryLoaded = summary && summary.length !== 0;
    return (
      <Container>
        <Navbar page="Portfolios" />
        <Step.Group unstackable size="mini">
          <Step as="a" onClick={() => history.push('/portfolios/')}>
            <Icon size="small" name="chart line" />
            <Step.Content>
              <Step.Title>Portfolios</Step.Title>
              <Step.Description>Manage Portfolios</Step.Description>
            </Step.Content>
          </Step>
          {portfolio && (
            <Step active as="a">
              <Icon size="small" name="file alternate outline" />
              <Step.Content>
                <Step.Title>{portfolio.name}</Step.Title>
                <Step.Description>{portfolio.description}</Step.Description>
              </Step.Content>
            </Step>
          )}
        </Step.Group>
        <br />
        <Button
          alt="delete"
          compact
          color="red"
          size="tiny"
          content="Delete"
          icon="trash"
          labelPosition="right"
          onClick={this.toggleConfirmOpen}
        />
        <Confirm
          content="Are you sure you want to delete this Portfolio for good?"
          open={confirmOpen}
          onCancel={this.toggleConfirmOpen}
          onConfirm={this.handleDelete}
        />
        <Modal
          className="EditorModal"
          basic
          dimmer="inverted"
          onClose={this.componentDidMount}
          open={editor}
        >
          <EditPortfolioPage id={id} portfolio={portfolio} toggleEditor={this.toggleEditor} />
        </Modal>
        <Modal
          className="CreatorModal"
          basic
          dimmer="inverted"
          onClose={this.componentDidMount}
          open={creator}
        >
          {portfolio && (
            <CreateTransactionModal toggleCreator={this.toggleCreator} portfolioId={portfolio.id} />
          )}
        </Modal>
        <Button
          alt="open editor"
          basic
          compact
          onClick={() => this.toggleEditor()}
          size="tiny"
          content="Edit"
          icon="edit"
          labelPosition="right"
        />
        <br />
        <br />
        <Divider />
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
          <PortfolioTable
            portfolioId={portfolio.id}
            stockData={data}
            isLoaded={isLoaded}
            summary={summary}
            portfolio={portfolio}
          />
        )}
      </Container>
    );
  }
}

export default PortfolioPage;
