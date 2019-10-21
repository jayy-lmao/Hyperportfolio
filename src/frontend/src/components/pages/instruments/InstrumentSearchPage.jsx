import React, { Component } from 'react';
import {
  Container, Header, Input, Divider, Modal, Card, Popup, Menu,
} from 'semantic-ui-react';
import { debounce as loDebounce } from 'lodash';
import axios from 'axios';
import AddToWatchlistMenu from './AddToWatchlistMenu';
import Navbar from '../../navbar/Navbar';
import instrumentService from '../../../services/instrumentService';
import CreateTransactionModal from '../transactions/CreateTransactionModal';
import authenticationService from '../../../services/authenticationService';
import history from '../../../helpers/history';

const { CancelToken } = axios;

/**
 * A standalone page that displays the results of a search query and its
 * found instruments that match this query.
 */
class SearchPage extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { defaultValue } = this.props;
    const source = CancelToken.source();

    this.state = {
      source,
      value: defaultValue || '',
      isLoading: false,
      response: [],
      creator: false,
      selectedSymbol: '',
      loggedIn: false,
    };
  }

  /**
   * Retrieves results from the instrument service that has query fed into it
   */
  getResults = loDebounce(() => {
    const { value,source } = this.state;
    instrumentService.search({
      searchQuery: value,
      cancelToken: source.token,
      onSuccess: response => this.setState({ response, isLoading: false }),
    });
  }, 750);

  /**
   * Toggles pop up upon a stock being added from this page (transaction)
   * @paramm {object} result - holds information about transaction added
   */
  toggleCreator = (result) => {
    const { creator } = this.state;
    this.setState({ creator: !creator });
    if (result && result.added) {
      this.setState({ lastAdded: result.added });
      this.popUp();
    }
  };

  /**
   * Uses source to cancel axios requests
   */
  componentWillUnmount = () => {
    const { source } = this.state;
    source.cancel('Operation canceled by the user.');
  };

  /**
   * Handles pop-up properties
   */
  popUp = () => {
    this.setState({ popUp: true }, () => setTimeout(() => this.setState({ popUp: false }), 1500));
  };

  /**
   * Handles loading toggling upon searching occurring (a change)
   * @param {Object} target - search query
   */
  handleChange = ({ target }) => {
    const { value } = target;
    this.setState({ value, isLoading: true }, this.getResults);
  };

  /**
   * Lifecycle function that runs upon completion of component loading
   */
  componentDidMount = () => {
    this.setState({ loggedIn: !!authenticationService.currentUserValue });
    const { location } = this.props;
    const { search } = location;
    const query = search && search.split('=')[1];
    if (query) {
      this.setState({ value: query, isLoading: true }, this.getResults);
    }
  };

  /**
   * renders component
   * @return {ReactElement} markup
   */
  render() {
    const {
      value,
      isLoading,
      response,
      creator,
      popUp,
      lastAdded,
      selectedSymbol,
      loggedIn,
    } = this.state;
    return (
      <Container className="centered page-padding">
        <Navbar page="Search" />
        <Header as="h1">
          <Header.Content>Search!</Header.Content>
        </Header>
        <Input
          loading={isLoading}
          name="search"
          icon="search"
          placeholder="Search..."
          value={value}
          size="large"
          onChange={loDebounce(this.handleChange, 1000, { leading: true })}
        />
        <Divider />
        <Modal className="CreatorModal" basic dimmer="inverted" open={creator}>
          <CreateTransactionModal
            defaultsymbol={selectedSymbol}
            toggleCreator={this.toggleCreator}
          />
        </Modal>
        <Card.Group centered>
          {response.map(item => (
            <Card className="animated fadeIn fastest" key={item.symbol}>
              <Card.Content>
                <Card.Header as="a" onClick={() => history.push(`/instruments/${item.symbol}`)}>
                  <h4>{item.symbol}</h4>
                </Card.Header>
                <Card.Description>
                  <h3>{item.name}</h3>
                  {' '}
                  <br />
                  <br />
                  {loggedIn && (
                    <Container>
                      {/* Modal to add to watchlist */}
                      <AddToWatchlistMenu symbol={item.symbol} />
                      <Popup
                        content="Added to porfolio!"
                        open={popUp && lastAdded === item.symbol}
                        position="right center"
                        disabled={!popUp}
                        trigger={(
                          <Menu
                            compact
                            onClick={
                              () => this.setState({
                                selectedSymbol: item.symbol,
                              }, this.toggleCreator)
                            }
                            content="Buy/Sell"
                          >
                            <Menu.Item as="a">Buy/Sell</Menu.Item>
                          </Menu>
)}
                      />
                    </Container>
                  )}
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
        {' '}
      </Container>
    );
  }
}

export default SearchPage;
