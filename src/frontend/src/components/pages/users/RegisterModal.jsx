import React, { Component } from 'react';
import {
  Card, Form, Button, Icon, Label,
} from 'semantic-ui-react';
import authenticationService from '../../../services/authenticationService';


/**
 * A modal to handle registration detail input for new users
 */
class RegisterModal extends Component {
  state = { registerFailed: false }

  /**
   * Updates state to then show error if registration failed
   */
  onFailure = () => {
    this.setState({ registerFailed: true, passwordMatchFailed: false, emptyFields: false });
  }

  /**
   *  Checks if a string is empty 
   * @param {string} s - A string to check the emptiness of.
   */
  emptyString = s => s.length === 0

  /**
   * Upon submission, checks input values and checks if registration was a success
   * @param {Object} event - relevant event data to retrieve submission value
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    const repassword = event.target.repassword.value;
    if (password !== repassword) {
      this.setState({ passwordMatchFailed: true });
      return;
    }
    const { onSuccess } = this.props;
    const username = event.target.username.value;
    const email = event.target.email.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    if ([username, email, password, firstName, lastName].some(this.emptyString)) {
      this.setState({ emptyFields: true });
      return;
    }
    await authenticationService.register(
      username, email, password, firstName, lastName, onSuccess, this.onFailure,
    );
  }

  /**
   * Appropriate styling to show error in the case of registration failed
   */
  componentDidUpdate = () => {
    const { registerFailed } = this.state;
    if (registerFailed) {
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
    const {
      registerFailed, passwordMatchFailed, emptyFields,
    } = this.state;
    const { toggleRegistered } = this.props;
    return (
      <Card className="centered raised animated fadeInLeft faster">
        {/* Animation and relevant text for failed registration */}
        {
            emptyFields
            && (
              <Label className="animated fadeIn" color="red" attached="top">Please Fill all Fields</Label>
            )
          }
        {
            registerFailed
            && (
              <Label className="animated fadeIn" color="red" attached="top">User already exists</Label>
            )
          }
        {
            passwordMatchFailed
            && (
              <Label className="animated fadeIn" color="red" attached="top">Passwords must match!</Label>
            )
          }
        {/* Card for registration form input */}
        <Card.Content>
          <Card.Header>Register</Card.Header>
          <Card.Description>
            <Form
              onSubmit={this.handleSubmit}
              onChange={() => this.setState({
                registerFailed: false,
                passwordMatchFailed: false,
                emptyFields: false,
              })}
            >
              <Form.Input name="firstName" label="Your First Name" />
              <Form.Input name="lastName" label="Your Last Name" />
              <Form.Input name="username" label="Username" type="text" />
              <Form.Input name="email" label="Email" type="email" />
              <Form.Input name="password" label="Password" type="password" />
              <Form.Input alt="re-enter your password" name="repassword" label="Re-enter Password" type="password" />
              <Button className="brandButton" primary type="submit">Register</Button>
            </Form>
          </Card.Description>
        </Card.Content>
        {/* Card to display modal navigation */}
        <Card.Content extra className="centered">
          <Button alt="return to login" animated basic size="mini" onClick={() => toggleRegistered()}>
            <Button.Content visible>Back to login</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

export default RegisterModal;
