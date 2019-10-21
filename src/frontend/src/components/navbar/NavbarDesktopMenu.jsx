import React from 'react';
import MediaQuery from 'react-responsive';
import { Menu, Icon } from 'semantic-ui-react';
import authenticationService from '../../services/authenticationService';
import SearchBar from '../searchbars/SearchBar';
import history from '../../helpers/history';
import brandLine from '../../assets/images/hyperportfolio.svg';

/**
 * Adapt navbar for the desktop platform
 * @param {Object} props
 * @return {ReactElement} markup
 */
const NavbarDesktopMenu = (props) => {
  const {
    handleItemClick,
    activeItem,
    firstName,
    registered,
    toggleLoginWindow,
    refreshPage,
    setState,
  } = props;

  /**
   * Renders component
   * @return {ReactElement} markup
   */
  return (
    <Menu pointing secondary inverted className="navmenu">
      <MediaQuery query="(min-width: 1030px)">
        <Menu.Item
          name="home"
          className="navitem"
          active={activeItem === 'home'}
          onClick={handleItemClick}
        >
          <img className="brandLine" src={brandLine} alt="Logo" />
        </Menu.Item>
      </MediaQuery>

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

      <Menu.Menu position="right">
        {activeItem !== 'home' && activeItem !== 'Search' && (
          <SearchBar
            className="navSearch"
            onSelect={(newSelectedSymbol) => {
              if (typeof newSelectedSymbol === 'string' && newSelectedSymbol !== '') {
                history.push(`/instruments/${newSelectedSymbol}`);
              }
            }}
          />
        )}
        {authenticationService.currentUserValue && (
          <Menu.Item
            className="navitem-greetings"
            name="user"
            content={firstName && `Hi, ${firstName}!`}
          />
        )}
        {!authenticationService.currentUserValue ? (
          <Menu.Item
            className="navitem"
            name={registered ? 'login' : 'register'}
            active={activeItem === 'login'}
            onClick={() => {
              toggleLoginWindow();
            }}
          />
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
          />
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default NavbarDesktopMenu;
