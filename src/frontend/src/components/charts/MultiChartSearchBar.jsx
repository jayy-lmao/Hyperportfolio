import { debounce as loDebounce, escapeRegExp as loEscapeRegExp, filter as loFilter } from 'lodash';
import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import instrumentService from '../../services/instrumentService'; import history from '../../helpers/history';

/**
 * Initial state of the multi search bar
 */
const initialState = {
  isLoading: false, results: [], selectedResults: [], value: [], searchText: '',
};

/**
 * Multi search bar that
 */
export default class MultiSearchBar extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const initialValue = [];
    this.state = { ...initialState, value: initialValue };
    this.handleSelectSymbol = this.handleSelectSymbol.bind(this);
  }

  /**
   * Handles the searching and retrieval of appropriate result amounts
   * Uses the instrument search to retreieve instruments
   */
  getSearch = loDebounce(() => {
    const { searchText, selectedResults } = this.state;
    const { onResults } = this.props;
    const re = new RegExp(loEscapeRegExp(searchText), 'i');
    const isMatch = result => re.test(result.symbol) || re.test(result.name);

    /**
     * Utilise instrument service for in chart searching and comparing multiple stocks from the
     * found and selected instruments.
     */
    instrumentService.search({
      searchQuery: searchText,
      onSuccess: (data) => {
        const results = loFilter(data, isMatch)
          .slice(0, 5)
          .map(result => ({
            key: result.symbol, value: result.symbol, text: result.symbol, description: result.name,
          }));
        selectedResults.forEach((result) => {
          results.push(result);
        });

        this.setState({
          isLoading: false,
          results,
        }, () => {
          if (onResults) {
            const { results: oldResults } = this.state;
            onResults(oldResults);
          }
        });
      },
    });
  }, 1000);

  /**
   * Sets the state depending on the selected results
   * @param {String} value - the search query for results to be filtered by
   */
  handleSelectSymbol = (e, { value }) => {
    const { results } = this.state;
    const { onSelectedSymbols } = this.props;
    const selectedResults = results.filter(result => value.includes(result.value));
    this.setState({ value, selectedResults });
    onSelectedSymbols(value);
  }

  /**
   * Reset displayed search results depending on the updated search query
   * @param {Object} e - holds the value inputted into search
   */
  handleSearchChange = (e) => {
    this.setState({ isLoading: true, searchText: e.target.value });
    this.getSearch();
  }

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Dropdown
        placeholder="Enter symbols"
        loading={isLoading}
        onSearchChange={loDebounce(this.handleSearchChange, 1000, {
          leading: true,
        })}
        fluid
        multiple
        search
        selection
        onChange={this.handleSelectSymbol}
        onKeyPress={({ key }) => { if (key === 'Enter') { history.push(`/search?query=${value}`); } }}
        onSubmit={() => history.push()}
        options={results}
        value={value}
      />
    );
  }
}
