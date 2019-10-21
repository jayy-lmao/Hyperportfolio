import React, { Component } from 'react';

import {
  Item, Icon, Container, Modal, Label, Loader, Divider, Step,
} from 'semantic-ui-react';
import {
  descending, nest, sum,
} from 'd3';
import axios from 'axios';
import PortfolioItemDetail from './PortfolioListItemDetail';
import PortfolioItemSummary from './PortfolioListItemSummary';
import Navbar from '../../navbar/Navbar';
import CreatePortfolioModal from './CreatePortfolioModal';
import portfolioService from '../../../services/portfolioService';
import instrumentService from '../../../services/instrumentService';

const { CancelToken } = axios;


/**
 * Constructs a list page of all portfolios, comprised of numerous components
 */
export default class PorfolioListPage extends Component {
  /**
   * Initial state
   */
  state = {
    source: CancelToken.source(),
    portfolios: [],
    data: [],
    dataByPortfolio: [],
    symbols: [],
    creator: false,
    isLoaded: false,
  };

  /**
   * Load portfolios
   * @param {Array<String>} portfolios - portfolios to set within list
   */
  setPortfolios = (portfolios) => {
    if (portfolios) {
      const symbols = [];
      symbols.null = [0, 0];
      this.setState({ symbols });
      this.setState({ portfolios });
    }
  };


  /**
   * Set the overall prices within each portfolio
   * @param {Array<double>} prices - prices to set within each portfolio
   */
  setPrices = (prices) => {
    if (prices.length !== 0) {
      const { data } = this.state;
      const results = [];
      prices.result.forEach((price) => {
        results[price.symbol] = [price.regularMarketPrice, price.regularMarketPreviousClose];
      });
      results.null = [0, 0];
      this.setState({ symbols: results });
      let newdata = Array.from(data);
      const { dataByPortfolio } = this.state;

      /**
       * Sort through incoming new data
       */
      newdata = newdata.map((datum) => {
        const { value, key } = datum;
        const { totalUnits, totalValue } = value;
        value.marketValue = key !== 'null' ? totalUnits * results[key][0] : 0;
        value.marketValueChange = key !== 'null' ? value.marketValue - totalValue : 0;
        return { value, ...datum };
      });

      newdata.sort((x, y) => {
        const xVal = x.value.marketValueChange;
        const yVal = y.value.marketValueChange;
        return descending(xVal, yVal);
      });
      this.setState({ data: newdata });

      /**
       * Map appropriately to each portfolio
       */
      const newmap = new Map(dataByPortfolio);
      newmap.forEach((value, i) => {
        newmap[i] = value.map((item) => {
          const { value: itemValue } = item;
          itemValue.marketValue = item.key !== 'null' ? item.value.totalUnits * results[item.key][0] : 0;
          itemValue.marketValueChange = item.value.marketValue - item.value.totalValue;
          return { value: itemValue, ...item };
        });
        value.sort((x, y) => descending(x.value.marketValueChange, y.value.marketValueChange));
      });

      this.setState({ dataByPortfolio: newmap });
      this.setState({ isLoaded: true });
    }
  };

  /**
   * Set symbols within each portfolio to retrieve relvant information for overall portfolio
   * and individual display
   * @param {Array<String>} portfolios - portfolios to set symbols within
   */
  setSymbols = (portfolios) => {
    if (portfolios) {
      const data = nest()
        .key(portfolio => portfolio.symbol)
        .rollup((v) => {
          const totalUnits = sum(v, portfolio => +portfolio.units);
          const totalValue = sum(v, portfolio => +portfolio.value);

          return {
            totalUnits,
            totalValue,
            average_price: totalValue / totalUnits,
          };
        })
        .entries(portfolios);

      /**
       * Sum overall portfolio units and value
       */
      const temp = nest()
        .key(portfolio => portfolio.portfolio_id)
        .key(portfolio => portfolio.symbol)
        .rollup((v) => {
          const totalUnits = sum(v, portfolio => +portfolio.units);
          const totalValue = sum(v, portfolio => +portfolio.value);

          return {
            totalUnits,
            totalValue,
            average_price: totalValue / totalUnits,
          };
        })
        .entries(portfolios);

      const dataByPortfolio = new Map();
      temp.forEach((portfolio) => {
        dataByPortfolio.set(+portfolio.key, portfolio.values);
      });
      this.setState({ dataByPortfolio });

      /**
       * Retrieve data of each symbol
       */
      const symbols = [];
      data.forEach((entry) => {
        if (entry.key !== 'null') symbols.push(entry.key);
      });
      this.setState({ data });

      /**
       * Retrieve quotes of each symbol
       */
      if (symbols.length > 0) {
        const { source } = this.state;
        instrumentService.quotes({ symbols, callback: this.setPrices, cancelToken: source.token });
      } else {
        this.setState({ isLoaded: true });
      }
    }
  };

  /**
   * Lifecycle method that runs when this component mounts
   */
  componentDidMount = async () => {
    const { history } = this.props;
    portfolioService.getPortfolios(this.setPortfolios).catch(() => history.push('/')); // Sends user to home if there's a permission error
    portfolioService
      .getOwnerPortfolioSummarySymbols(this.setSymbols)
      .catch(() => history.push('/')); // Sends user to home if there's a permission error
  };

  /**
   * Uses source to cancel axios requests
   */
  componentWillUnmount = () => {
    const { source } = this.state;
    source.cancel('Operation canceled by the user.');
  };

  /**
   * Toggle portfolio creation modal
   */
  toggleCreator = () => {
    const { creator } = this.state;
    this.setState({ creator: !creator });
    if (creator) {
      this.componentDidMount();
    }
  };


  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      portfolios, isLoaded, creator, dataByPortfolio, data, symbols,
    } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Container>
          <Navbar page="Portfolios" />
          <Step.Group unstackable size="mini">
            <Step active as="a" onClick={() => history.push('/portfolios/')}>
              <Icon size="small" name="chart line" />
              <Step.Content>
                <Step.Title>Portfolios</Step.Title>
                <Step.Description>Manage Portfolios</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
          <br />
          <Modal
            basic
            dimmer="inverted"
            open={creator}
            onClose={this.componentDidMount}
          >
            <CreatePortfolioModal toggleCreator={this.toggleCreator} portfolios={portfolios} />
          </Modal>
          <Label as="a" onClick={() => this.toggleCreator()}>
            <Icon size="large" name="plus square" />
            New Portfolio
          </Label>
          {portfolios.length > 0 && (
            <Label as="a" onClick={() => history.push('/report')}>
              <Icon size="large" name="plus square" />
              Print Report
            </Label>
          )}

          {isLoaded ? (
            <div className="animated fadeInUp faster">
              <PortfolioItemSummary data={data} symbols={symbols} />
            </div>
          ) : (
            <Loader size="large">Getting Portfolio Summary.</Loader>
          )}

          <Divider />
          {isLoaded ? (
            <div className="page-padding animated fadeIn faster">
              <Item.Group divided>
                {portfolios.map(portfolio => (
                  <PortfolioItemDetail
                    key={portfolio.id}
                    id={portfolio.id}
                    redirect={history.push}
                    title={portfolio.name}
                    data={dataByPortfolio.get(portfolio.id)}
                    symbols={symbols}
                  />
                ))}
              </Item.Group>
            </div>
          ) : (
            <Loader size="large">Getting Portfolios.</Loader>
          )}
        </Container>
      </div>
    );
  }
}
