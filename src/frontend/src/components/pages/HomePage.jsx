import React from 'react';
import { Header } from 'semantic-ui-react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import instrumentService from '../../services/instrumentService';
import ChartList from '../charts/ChartList';
import MainSearchBar from '../searchbars/HomeSearchBar';
import history from '../../helpers/history';

const { CancelToken } = axios;

/**
 * A component that constructs elements that comprise the home page
 */
class HomePage extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    const source = CancelToken.source();

    this.state = {
      symbols: [],
      source,
    };
  }

  /**
   * Lifecycle method that runs when this component mounts
   */
  componentDidMount() {
    const { source } = this.state;
    instrumentService.markets({
      region: 'AU',
      lang: 'en',
      cancelToken: source.token,
      callback: (data) => {
        if ('marketSummaryResponse' in data) {
          this.getQuoteSymbols(data.marketSummaryResponse.result);
          this.setState({ symbols: data.marketSummaryResponse.result });
        }
      },
    });
  }

  /**
   * Retrieves the symbols of quotes to be displayed on home carousel
   * Utilises the instrument service to do so.
   * @param {Object} results - holds relvant data about the quotes to retrieve
   * we extract the symbol primrily from this
   */
  getQuoteSymbols(results) {
    const { source } = this.state;
    const quoteSymbols = [];

    results.forEach((result) => {
      quoteSymbols.push(result.symbol);
    });

    instrumentService.quotes({
      symbols: quoteSymbols,
      cancelToken: source.token,
      callback: (data) => {
        if ('result' in data) {
          const resultSymbols = new Map();
          data.result.forEach((d) => {
            resultSymbols[d.symbol] = d;
          });
          const { symbols: oldSymbols } = this.state;
          const newSymbols = oldSymbols.map((symbol) => {
            const { shortName } = resultSymbols[symbol.symbol];
            return { shortName, ...symbol };
          });
          this.setState({ symbols: newSymbols });
        }
      },
    });
  }

  /**
   * Cancels axios requests made by this page when it is unloaded.
   */
  componentWillUnmount = () => {
    const { source } = this.state;
    source.cancel('Operation canceled by the user.');
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { symbols, quotes } = this.state;
    return (
      <div className="homepage">
        <Navbar />
        <div>
          <br />
          <br />
          <Header inverted as="h2" align="center">
            <Header.Subheader className="animation fadeIn slower">Welcome to</Header.Subheader>
            <Header.Content>
              <p className="typewriter">hyperportfol.io</p>
              <Header.Subheader className="animation fadeIn slower">
                Start your search
              </Header.Subheader>
            </Header.Content>
          </Header>
        </div>
        <br />
        <br />
        <br />
        <div>
          <MainSearchBar
            style={{
              width: '75vw',
              margin: 'auto',
            }}
            onSelect={(newSelectedSymbol) => {
              if (typeof newSelectedSymbol === 'string' && newSelectedSymbol !== '') {
                history.push(`/instruments/${newSelectedSymbol}`);
              }
            }}
          />
        </div>
        <br />
        <br />
        <br />
        <ChartList charts={symbols} quotes={quotes} />
      </div>
    );
  }
}

export default HomePage;
