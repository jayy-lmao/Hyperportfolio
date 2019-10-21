import React, { Component } from 'react';
import {
  Card, Form, Button, Label,
} from 'semantic-ui-react';
import watchlistService from '../../../services/watchlistService';

/**
 * A component that handles watchlist creation, saving releant data
 */
export default class CreateWatchlistPage extends Component {
  state = { error: false };
  /**
   * Saves watchlist data upon form in modal submission
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const { toggleCreator, watchlists } = this.props;
    if (watchlists.map(watchlist => watchlist.name).includes(name)) {
      this.setState({ error: 'Name used' });
      return;
    }
    watchlistService.createWatchlist(name, description, toggleCreator);
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { error } = this.state;
    const { toggleCreator } = this.props;
    return (
      <Card className="centered animated fadeInUp faster">
        <Card.Content className="raised">
          <Card.Header>Create a Watchlist</Card.Header>
          <Card.Description>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input name="name" label="Watchlist Name" type="name" maxLength="16" />
              <Form.Input name="description" label="Description" type="description" />
              <Button alt="create a watchlist" className="brandButton" primary type="submit">
                Create Watchlist
              </Button>
              {error && <Label className="errorText">{error}</Label>}
              <Button alt="cancel" basic floated="right" onClick={() => toggleCreator()}>
                Cancel
              </Button>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
