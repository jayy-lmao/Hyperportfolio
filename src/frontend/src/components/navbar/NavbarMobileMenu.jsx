import React from 'react';
import {
  Menu, Button, Icon, Grid, Image,
} from 'semantic-ui-react';
import authenticationService from '../../services/authenticationService';
import brandLine from '../../assets/images/hyperportfolio.svg';

/**
 * Adapt navbar for the mobile platform
 * @param {Object} props
 * @return {ReactElement} markup
 */
const NavbarMobileMenu = (props) => {
  const {
    activeItem,
    handleItemClick,
    registered,
    toggleLoginWindow,
    setState,
    refreshPage,
  } = props;

   /**
   * Renders component
   * Populate navbar with appropriate items, depending on if user has been authenticated
   * @return {ReactElement} markup
   */
  return (
    <Grid relaxed padded>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Image floated="left" className="brandLine" src={brandLine} alt="Logo" />
        </Grid.Column>
        <footer className="mobile-buttons">
          <Menu pointing fluid widths={4} secondary inverted className="navmenu" icon="labeled">
            <Menu.Item
              className="navitem"
              name="home"
              active={activeItem === 'home'}
              onClick={handleItemClick}
            >
              <Icon name="home" />
              Home
            </Menu.Item>
            {authenticationService.currentUserValue && (
              <Menu.Item
                className="navitem"
                name="Watchlists"
                active={activeItem === 'Watchlists'}
                onClick={handleItemClick}
              >
                <Icon name="eye" />
                Watchlists
              </Menu.Item>
            )}

            {authenticationService.currentUserValue && (
              <Menu.Item
                className="navitem"
                name="Portfolios"
                active={activeItem === 'Portfolios'}
                onClick={handleItemClick}
              >
                <Icon name="chart line" />
                Portfolios
              </Menu.Item>
            )}
            <Menu.Item
              className="navitem"
              name="Search"
              active={activeItem === 'Search'}
              onClick={handleItemClick}
            >
              <Icon name="search" />
              Search
            </Menu.Item>
          </Menu>
        </footer>
        <Grid.Column>
          <Menu.Menu position="right">
            {!authenticationService.currentUserValue ? (
              <Menu.Item
                className="navitem"
                name={registered ? 'login' : 'register'}
                active={activeItem === 'login'}
                onClick={() => {
                  toggleLoginWindow();
                }}
              >
                <Button alt="login or register button" floated="right" basic inverted>
                  {registered ? 'Login' : 'Register'}
                </Button>
              </Menu.Item>
            ) : (
              <Menu.Item
                className="navitem"
                name="logout"
                active={activeItem === 'logout'}
                onClick={() => {
                  authenticationService.logout();
                  setState({
                    activeItem: 'home',
                  });
                  refreshPage();
                }}
              >
                <Button alt="logout button" size="small" floated="right" basic inverted>
                  Logout
                </Button>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default NavbarMobileMenu;
