import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Modal } from 'semantic-ui-react';
import LoginModal from '../pages/users/LoginModal';
import RegisterModal from '../pages/users/RegisterModal';
import authenticationService from '../../services/authenticationService';
import NavbarDesktopMenu from './NavbarDesktopMenu';
import NavbarMobileMenu from './NavbarMobileMenu';

/**
 * Navbar to display main pages to route to when logged in
 */
class Navbar extends Component {
  /**
   * constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { page } = this.props;
    this.state = {
      activeItem: page || 'home',
      redirect: false,
      registered: true,
      loginWindow: false,
    };
  }

  /**
   * Toggle registered state for navbar display
   */
  toggleRegistered = () => {
    const { registered } = this.state;
    this.setState({ registered: !registered });
  };

  /**
   * Redirect if navbar page clicked
   * @param {String} name - name of active item clicked
   */
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name, redirect: true });
    // history.push(name);
  };

  /**
   * Toggle the login window if login button clicked
   */
  toggleLoginWindow = () => {
    const { loginWindow } = this.state;
    this.setState({ loginWindow: !loginWindow });
  };

  /**
   * Refresh the page when redirecting
   */
  refreshPage = () => {
    this.setState({ redirect: true });
  };

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  render() {
    const { currentUserValue } = authenticationService;
    const firstName = currentUserValue && currentUserValue.firstName;
    const { activeItem, registered, loginWindow } = this.state;
    const { redirect } = this.state;

    /**
     * renders component
     * @return {ReactElement} markup
     */
    return (
      <div className="navbar">
        {redirect && <Redirect to={`/${activeItem}`} />}
        <Modal
          basic
          dimmer="inverted"
          open={loginWindow}
          onClose={() => {
            this.toggleLoginWindow();
          }}
        >
          {registered && (
            <LoginModal
              onSuccess={() => this.toggleLoginWindow()}
              notRegistered={this.toggleRegistered}
            />
          )}
          {!registered && (
            <RegisterModal
              onSuccess={() => {
                this.toggleRegistered();
                this.toggleLoginWindow();
              }}
              toggleRegistered={this.toggleRegistered}
            />
          )}
        </Modal>

        <MediaQuery query="(max-width: 1030px)">
          <NavbarMobileMenu
            handleItemClick={this.handleItemClick}
            toggleLoginWindow={this.toggleLoginWindow}
            setState={newState => this.setState(newState)}
            refreshPage={this.refreshPage}
            activeItem={activeItem}
            registered={registered}
          />
        </MediaQuery>
        <MediaQuery query="(min-width: 1030px)">
          <NavbarDesktopMenu
            handleItemClick={this.handleItemClick}
            toggleLoginWindow={this.toggleLoginWindow}
            setState={newState => this.setState(newState)}
            refreshPage={newState => this.refreshPage(newState)}
            firstName={firstName}
            activeItem={activeItem}
            registered={registered}
          />
        </MediaQuery>
      </div>
    );
  }
}

export default Navbar;
