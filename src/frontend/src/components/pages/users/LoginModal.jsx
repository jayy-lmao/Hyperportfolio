import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Form, Button, Icon, Label,
} from 'semantic-ui-react';
import authenticationService from '../../../services/authenticationService';

/**
 * A modal for users logging in
 */
class LoginModal extends Component {
  /**
   * Default modal state
   */
  state = { loginFailed: false }

  /**
   * Set state to show error upon failed loging
   */
  onFailure = () => {
    this.setState({ loginFailed: true });
  }

  /**
   * Process user authentication upon submission
   * utilises the authentication service
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleSubmit = async (event) => {
    const { onSuccess } = this.props;
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    await authenticationService.login(email, password, onSuccess, this.onFailure);
  }

  /**
   * Appropriately styles depending on whether error shown
   */
  componentDidUpdate = () => {
    const { loginFailed } = this.state;
    if (loginFailed) {
      document.getElementsByClassName('card')[0].style.top = '-15px';
      return;
    }
    document.getElementsByClassName('card')[0].style.top = '0px';
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { loginFailed } = this.state;
    const { notRegistered } = this.props;
    return (
      <Card className="centered raised login animated fadeInRight faster" id="login">
        {
            loginFailed
            && (
              <Label className="animated fadeIn faster" color="red" attached="top">Wrong details</Label>
            )
          }
        {/* Login card for form input */}
        <Card.Content>
          <Card.Header>Login</Card.Header>
          <Card.Description>
            <Form
              onSubmit={this.handleSubmit}
              onChange={() => this.setState({ loginFailed: false })}
            >
              <Form.Input name="email" label="Enter email or username" type="text" />
              <Form.Input name="password" label="Enter Password" type="password" />
              <Button alt="submit" className="brandButton" primary id="submit" type="submit">Login</Button>
            </Form>
          </Card.Description>
        </Card.Content>
        {/* Registration button */}
        <Card.Content extra className="centered">
          <Button alt="register" animated basic size="mini" onClick={() => notRegistered()}>
            <Button.Content visible>No account yet? Register here!</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

/**
 * Login prop prototype declaration
 */
LoginModal.propTypes = {
  notRegistered: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default LoginModal;
