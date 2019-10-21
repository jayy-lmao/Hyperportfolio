import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Search,
} from 'semantic-ui-react';
import watchlistService from '../../../services/watchlistService';
import instrumentService from '../../../services/instrumentService';

/**
 * Initial state of search component within watchlist
 */
const initialState = {
  isLoading: false, results: [], value: '', symbols: instrumentService.currentInstrumentListValue,
};

/**
 * Search bar component within watchlist
 */
class WatchListInstrumentSearch extends Component {
  /* Initial state of search */
  state = initialState;

  /**
   * Saves the title of the search upon selection
   * @param {String} result - search query
   */
  handleResultSelect = (e, { result }) => {
    const { watchlist, symbolChange } = this.props;
    watchlistService.createWatchlistDetails(result.id, watchlist.id, symbolChange);
    this.setState({ value: result.title });
  };

  /**
   * Handles a change in the search component including loading
   * @param {String} value - search query
   */
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    const { symbols } = this.state;
    const symbolObjs = symbols.map(symbol => ({
      id: symbol.id, title: symbol.code, description: 'A company of some un-api retrieved description', price: String(1.0),
    }));

    /* Bounceback functionality */
    setTimeout(() => {
      const { value: stateValue } = this.state;
      if (stateValue.length < 1) return this.setState(initialState);
      const re = new RegExp(_.escapeRegExp(stateValue), 'i');
      const isMatch = result => re.test(result.title);
      this.setState({
        isLoading: false,
        results: _.filter(symbolObjs, isMatch),
      });
      return 0;
    }, 300);
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { isLoading, value, results } = this.state;
    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true,
        })}
        results={results}
        value={value}
      />
    );
  }
}

/**
 * Definition of search proptypes
 */
WatchListInstrumentSearch.propTypes = {
  symbolChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  watchlist: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default WatchListInstrumentSearch;
