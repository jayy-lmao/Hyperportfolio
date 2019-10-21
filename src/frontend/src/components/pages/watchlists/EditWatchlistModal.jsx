import React, { Component } from 'react';
import {
  Card, Form, Button, Label,
} from 'semantic-ui-react';
import watchlistService from '../../../services/watchlistService';

/**
 * A modal that pops up when the user wishes to edit their watchlist
 */
export default class EditWatchlistModal extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    const { watchlist } = this.props;
    const { name, description } = watchlist;
    watchlistService.getWatchlists(this.getNames);
    this.state = {
      error: false,
      originalName: name,
      name,
      description,
      watchlistNames: [],
    };
  }

    /**
     * Saves edited data upon modal form submission
     * @param {Object} event - relevant event data to retrieve submission value
     */
    handleSubmit = async (event) => {
      event.preventDefault();
      const { toggleEditor } = this.props;
      const { name, originalName, watchlistNames } = this.state;
      const description = event.target.description.value;
      const { id } = this.props;
      if (watchlistNames.includes(name) && name !== originalName) {
        this.setState({ error: 'Name used' });
        return;
      }
      watchlistService.editWatchlist(name, description, id, toggleEditor);
    }

    /**
     * Retrieves the names of each watchlist
     */
    getNames = watchlists => this.setState(
      {
        watchlistNames: watchlists.map(
          watchlist => watchlist.name,
        ),
      },
    );

    /**
     * Saves the watchlist name upon editing
     * @param {Object} event - relevant event data to retrieve submission value
     */
    handleNameChange = (event) => {
      const name = event.target.value;
      this.setState({ name });
    }

    /**
     * Saves the watchlist description upon editing
     * @param {Object} event - relevant event data to retrieve submission value
     */
    handleDescriptionChange = (event) => {
      const description = event.target.value;
      this.setState({ description });
    }

    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
      const { toggleEditor } = this.props;
      const { error, name, description } = this.state;
      return (
        <Card className="centered raised animated fadeInUp">
          <Card.Content>
            <Card.Meta>Editing</Card.Meta>
          </Card.Content>
          <Card.Content>
            <Card.Description>
              <Form onSubmit={this.handleSubmit}>
                <Form.Input
                  icon="edit"
                  name="name"
                  maxLength="16"
                  type="name"
                  size="huge"
                  onChange={this.handleNameChange}
                  value={name}
                />
                <Form.TextArea
                  icon="edit"
                  name="description"
                  type="description"
                  onChange={this.handleDescriptionChange}
                  value={description}
                />
                <Button alt="save changes" className="brandButton" primary type="submit">Save Changes</Button>
                {
                    error
                    && <Label className="errorText">{error}</Label>
                }
                <Button alt="cancel changes" basic type="button" floated="right" onClick={() => toggleEditor()}>Cancel</Button>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    }
}
