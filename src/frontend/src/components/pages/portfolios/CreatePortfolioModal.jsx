import React, { Component } from 'react';
import {
  Card, Form, Button, Label,
} from 'semantic-ui-react';
import portfolioService from '../../../services/portfolioService';

/**
 * Modal that pops up when creation portfolio
 */
export default class CreatePortfolioModal extends Component {
  /**
   * Initial state
   */
  state = { error: false };

  /**
   * Save inputted data upon submission and error check
   * Close modal
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const { toggleCreator, portfolios } = this.props;
    if (portfolios.map(portfolio => portfolio.name).includes(name)) {
      this.setState({ error: 'Name used' });
      return;
    }
    portfolioService.createPortfolio(name, description, toggleCreator);
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
          <Card.Header>Create a Portfolio</Card.Header>
          <Card.Description>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input name="name" label="Portfolio Name" type="name" maxLength="16" />
              <Form.Input name="description" label="Description" type="description" />
              <Button
                alt="button to create a porfolio"
                className="brandButton"
                primary
                type="submit"
              >
                Create Portfolio
              </Button>
              {error && (
                <Label id="errorText" className="errorText">
                  {error}
                </Label>
              )}
              <Button alt="button to cancel" basic floated="right" onClick={() => toggleCreator()}>
                Cancel
              </Button>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
