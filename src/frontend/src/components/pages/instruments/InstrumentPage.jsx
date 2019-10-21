import React, { Component } from 'react';
import {
  Container, Header, Segment, Divider, Loader,
} from 'semantic-ui-react';
import Navbar from '../../navbar/Navbar';
import NewsFeed from '../../news/NewsFeed';
import instrumentService from '../../../services/instrumentService';
import authenticationService from '../../../services/authenticationService';
import InstrumentPageDirectors from './InstrumentPageDirectors';
import InstrumentCompanyInfo from './InstrumentCompanyInfo';
import InstrumentPageChart from './InstrumentPageChart';
import InstrumentPageTracking from './InstrumentPageTracking';

/**
 * A component comprised of all smaller components to display a summary of a given instrument.
 * Handles the management of these separate components.
 */
class InstrumentDisplayPage extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { symbol } = match.params;
    this.state = {
      symbol,
      activeIndex: 1,
      creator: false,
      loggedIn: false,
    };
  }

  /**
   * Lifecycle function that runs upon successful loading of component
   */
  componentDidMount = () => {
    this.setState({ loggedIn: !!authenticationService.currentUserValue });
    this.pullCompanyData();
    this.pullNews();
  };

  /**
   * Retrieves newsfeed of instrument upon component loading
   */
  pullNews = () => {
    const { symbol } = this.state;
    instrumentService.news({
      symbol,
      callback: (news) => {
        this.setState({
          news,
        });
      },
    });
  };

  /**
   * Retrieves company data of instrument upon component loading
   */
  pullCompanyData = () => {
    const { symbol } = this.state;
    instrumentService.company({
      symbol,
      callback: (data) => {
        this.setState({
          data,
        });
      },
    });
  };

  /**
   * Loading of state when component properly loads
   */
  componentWillReceiveProps = ({ match }) => {
    const { params } = match;
    const { symbol } = params;
    this.setState({ symbol });
    window.location.reload();
  };

  /**
   * Toggles popup upon instruments being added/manipulated from a user portfolio/watchlist from
   * this page
   * @param {Object} result - checking for function callback and ensuring we tried to add through this
   */
  toggleCreator = (result) => {
    const { creator } = this.state;
    this.setState({ creator: !creator });
    if (result && result.added) {
      this.popUp();
    }
  };

  /**
   * Handles popup toggling and behaviour
   */
  popUp = () => {
    this.setState({ popUp: true }, () => setTimeout(() => this.setState({ popUp: false }), 1500));
  };

  /**
   * Toggles company directors upon clicking expansion
   * @param {Object} titleProps - relevant event data to retrieve submission value
   */
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  /**
   * Component that displays relevant company directors for instrument
   * @param {int} activeIndex - current index within response to look for instrument directors
   * @param {Array} - wide range of asset profiles to easily map directors
   */
  getDirectors = (activeIndex, assetProfile) => (
    <InstrumentPageDirectors
      handleClick={this.handleClick}
      activeIndex={activeIndex}
      assetProfile={assetProfile}
    />
  );

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  render() {
    const {
      data, news, symbol, activeIndex, popUp, creator, loggedIn,
    } = this.state;
    if (!data) {
      return (
        <Container>
          <Navbar page="Instrument" />
          <Loader active inline="centered">
            Retrieving Stock information.
          </Loader>
        </Container>
      );
    }

    const {
      quoteType, assetProfile, price, summaryDetail, calendarEvents,
    } = data;
    const { regularMarketPrice } = price;
    const { volume } = summaryDetail;
    const { shortName } = quoteType;
    return (
      <Container>
        <Navbar page="Instrument" />
        <Header as="h2">
          <Header.Content>
            {symbol}
            {' '}
-
            {shortName}
            <Header.Subheader>
              <b>Price:</b>
              {' '}
$
              {regularMarketPrice.fmt}
              <br />
              <b>Volume:</b>
              {' '}
              {volume ? volume.fmt : 'n/a'}
            </Header.Subheader>
          </Header.Content>
        </Header>
        <InstrumentPageTracking
          toggleCreator={this.toggleCreator}
          symbol={symbol}
          popUp={popUp}
          creator={creator}
          loggedIn={loggedIn}
          price={price}
          regularMarketPrice={regularMarketPrice}
        />
        <InstrumentCompanyInfo
          assetProfile={assetProfile}
          fmt={price.marketCap.fmt}
          summaryDetail={summaryDetail}
          calendarEvents={calendarEvents}
        />
        <Divider />
        <InstrumentPageChart symbol={symbol} />
        {news && <NewsFeed data={news} />}
        <Segment>
          {assetProfile && (
            <InstrumentPageDirectors
              handleClick={this.handleClick}
              activeIndex={activeIndex}
              assetProfile={assetProfile}
            />
          )}
        </Segment>
      </Container>
    );
  }
}

export default InstrumentDisplayPage;
