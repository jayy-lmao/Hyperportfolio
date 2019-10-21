import { debounce as loDebounce, escapeRegExp as loEscapeRegExp, filter as loFilter } from 'lodash';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import axios from 'axios';
import instrumentService from '../../services/instrumentService';
import history from '../../helpers/history';

const { CancelToken } = axios;

/**
 * Initial state of search bar
 */
const initialState = {
  isLoading: false,
  results: [],
  value: '',
};

/**
 * Main search bar component for instrument searching
 */
export default class searchBar extends Component {
  /**
   * Updates the page upon querying.
   * Utilises a debounce for responsiveness.
   * @param {String} value - search query
   */
  updateParent = loDebounce((value) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(value);
    }
  }, 500);

  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    const { defaultsymbol } = this.props;
    const initialValue = defaultsymbol || '';
    const source = CancelToken.source();
    this.state = { ...initialState, value: initialValue, source };
  }


  /**
   * Retrieves intermediate search results as user is typing before submission
   * Utilises a debounce for more appropriate responsiveness.
   */
  getSearch = loDebounce(() => {
    const { value, source } = this.state;
    const { onResults } = this.props;

    if (value.length < 1) return this.setState(initialState);

    const re = new RegExp(loEscapeRegExp(value), 'i');
    const isMatch = result => re.test(result.symbol) || re.test(result.name);
    instrumentService.search({
      searchQuery: value,
      cancelToken: source.token,
      onSuccess: (data) => {
        this.setState(
          {
            isLoading: false,
            results: loFilter(data, isMatch)
              .slice(0, 5)
              .map(result => ({ title: result.symbol, description: result.name })),
          },
          () => {
            if (onResults) {
              const { results } = this.state;
              onResults(results);
            }
          },
        );
      },
    });
    return 0;
  }, 1000);

  /**
   * Wrapper called to update page upon search selection
   * @param {Object} result - relevant data of selected result
   */
  handleResultSelect = (e, { result }) => {
    const name = result.title;
    this.setState({ value: name },
      () => {
        const { value } = this.state;
        this.updateParent(value);
      });
  }

  /**
   * Wrapped around updates to results in intermediate (before submission) searching
   * @param {String} value - search value to update parent with
   */
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value }, this.updateParent(''));
    this.getSearch();
  };

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
    const { isLoading, value, results } = this.state;

    return (
      <Search
        className="prompt"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={loDebounce(this.handleSearchChange, 1000, {
          leading: true,
        })}
        onKeyPress={({ key }) => {
          if (key === 'Enter') {
            history.push(`/search?query=${value}`);
          }
        }}
        onSubmit={() => history.push()}
        results={results}
        value={value}
        {...this.props}
      />
    );
  }
}
