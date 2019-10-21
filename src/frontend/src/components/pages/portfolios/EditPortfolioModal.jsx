import React, { Component } from 'react';
import {
  Card, Form, Button, Label,
} from 'semantic-ui-react';
import portfolioService from '../../../services/portfolioService';

/**
 * Modal to edit a given portfolio
 */
export default class EditPortfolioPage extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { portfolio } = this.props;
    const { name, description } = portfolio;
    portfolioService.getPortfolios(this.getNames);
    this.state = {
      error: false,
      originalName: name,
      name,
      description,
      portfolioNames: [],
    };
  }

    /**
     * Saves fields upon submit and removes modal
     * Error checks for name usage
     * @param {Object} event - holds information about changed values
     */
    handleSubmit = async (event) => {
      event.preventDefault();
      const { toggleEditor } = this.props;
      const { name, originalName, portfolioNames } = this.state;
      const description = event.target.description.value;
      const { id } = this.props;
      if (portfolioNames.includes(name) && name !== originalName) {
        this.setState({ error: 'Name used' });
        return;
      }
      portfolioService.editPortfolio(name, description, id, toggleEditor);
    }

    /**
     * Get names of all portfolios for rendering
     */
    getNames = portfolios => this.setState(
      {
        portfolioNames: portfolios.map(
          portfolio => portfolio.name,
        ),
      },
    );

    /**
     * Lifecycle function which runs after loading of component
     */
    componentDidMount = () => {
    }

    /**
     * Change given name of portfolio
     * @param {Object} event - relevant event data to retrieve submission values
     */
    handleNameChange = (event) => {
      const name = event.target.value;
      this.setState({ name });
    }

    /**
     * Change given description of portfolio
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
            {/* <Card.Header>{portfolio.name}</Card.Header> */}
            <Card.Description>
              <Form onSubmit={this.handleSubmit}>
                <Form.Input
                  icon="edit"
                  name="name"
                  type="name"
                  maxLength="16"
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
                <Button alt="salve changes" className="brandButton" primary type="submit">Save Changes</Button>
                {
                    error
                    && <Label className="errorText">{error}</Label>
                }
                <Button alt="cancel" basic type="button" floated="right" onClick={() => toggleEditor()}>Cancel</Button>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    }
}
