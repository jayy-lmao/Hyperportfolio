import React, { Component } from 'react';
import { Dropdown, Popup, Menu } from 'semantic-ui-react';
import axios from 'axios';
import watchlistService from '../../../services/watchlistService';

const { CancelToken } = axios;

/**
 * Component to add item to a watchlist
 */
class AddToWatchlistMenu extends Component {
  /**
   * State of component.
   * Holds information about contained watchlists, their details, and existing modal.
   */
  state = {
    watchlists: [],
    popUp: false,
    details: [],
    source: CancelToken.source(),
  };

  /**
   * Lifecycle function that runs upon component loading
   */
  componentDidMount = () => {
    const { source } = this.state;
    const cancelToken = source.token;
    watchlistService.getWatchlists(watchlists => this.setState({ watchlists }), cancelToken);
    watchlistService.getAllWatchlistDetails(details => this.setState({ details }), cancelToken);
  };

  /**
   * Cancels active axios XHR requests if the page is changed.
   */
  componentWillUnmount = () => {
    const { source } = this.state;
    source.cancel('Operation canceled by the user.');
  };

  /**
   * Handles a new symbol added with a given watchlist
   * @param {String} watchlistId - id of watchlist to be added to
   */
  addNewDetail = (watchlistId) => {
    this.popUp();
    const { details } = this.state;
    const { symbol } = this.props;
    details.push({ symbol, watchlist_id: watchlistId });
  };

  /**
   * Handles the toggling of pop up/modal
   */
  popUp = () => {
    this.setState({ popUp: true }, () => setTimeout(() => this.setState({ popUp: false }), 1500));
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { watchlists, popUp, details } = this.state;
    const { symbol } = this.props;
    return (
      <Popup
        open={popUp}
        position="right center"
        content="Added to watchlist!"
        trigger={(
          <Menu compact>
            <Dropdown disabled={watchlists.length === 0} className="icon link item" text="Add to Watchlist" pointing>
              <Dropdown.Menu>
                {watchlists.map(watchlist => (
                  <Dropdown.Item
                    key={`${watchlist.id}_${symbol}`}
                    disabled={Boolean(
                      details.find(
                        item => item.watchlist_id === watchlist.id && item.symbol === symbol,
                      ),
                    )}
                    onClick={() => watchlistService.createWatchlistDetails({
                      symbol,
                      watchlistId: watchlist.id,
                      onSuccess: () => this.addNewDetail(watchlist.id),
                    })
                    }
                  >
                    {watchlist.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu>
)}
      />
    );
  }
}

export default AddToWatchlistMenu;
