import React, { Component } from 'react';
import {
  Grid, Checkbox, Card, Icon, Button,
} from 'semantic-ui-react';

/**
 * Presents options to allow user to show/hide table fields within portfolios
 */
class OptionsModal extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    const { options } = this.props;
    this.state = { options };
  }

  /**
   * Saves the options changed upon selection
   * @param {String} identifier - identifier for option change
   */
  changeOption = (identifier) => {
    const { options } = this.state;
    const toChange = options.find(option => option.identifier === identifier);
    toChange.enabled = !toChange.enabled;
    this.setState({ options });
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { options } = this.state;
    const { updateOptions } = this.props;

    return (
      <Card className="centered raised animated fadeInUp">
        <Card.Content>

          <Card.Header>
            <Icon name="setting" />
              Options
          </Card.Header>
          <Card.Description>
            Choose what you want visible.
            <br />
            <br />
            <br />
            <Grid>
              {options.map(option => (
                <Grid.Row key={option.identifier}>
                  <Grid.Column width={10}>{option.name}</Grid.Column>
                  <Grid.Column width={4}>
                    <Checkbox
                      toggle
                      checked={option.enabled}
                      onChange={() => this.changeOption(option.identifier)}
                    />
                  </Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
            <br />
            <br />
            <br />
            <Button alt="save" floated="right" className="brandButton" primary onClick={() => updateOptions(options)}>Save</Button>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default OptionsModal;
