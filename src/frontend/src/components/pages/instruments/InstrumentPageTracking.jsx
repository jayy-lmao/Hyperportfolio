import React from 'react';
import {
  Container, Popup, Modal, Menu,
} from 'semantic-ui-react';
import AddToWatchlistMenu from './AddToWatchlistMenu';
import CreateTransactionModal from '../transactions/CreateTransactionModal';

/**
 * Displays components for transaction and tracking for portfolio and watchlists
 * respectively. Requires a user to be logged in for display.
 * @param {Object} props
 * @return {ReactElement} markup
 */
const InstrumentPageTracking = (props) => {
  const {
    loggedIn, symbol, toggleCreator, popUp, price, regularMarketPrice, creator,
  } = props;
  return (
    <div>
      {' '}
      <Container>
        {loggedIn && <AddToWatchlistMenu symbol={symbol} />}
        {'       '}
        {loggedIn && (
          <Popup
            content="Added to porfolio!"
            open={popUp}
            position="right center"
            disabled={!popUp}
            trigger={(
              <Menu compact onClick={toggleCreator} content="Buy/Sell">
                <Menu.Item as="a">Buy/Sell</Menu.Item>
              </Menu>
)}
          />
        )}
      </Container>
      {/* Separate modael for creation of transaction */}
      <Modal className="CreatorModal" basic dimmer="inverted" open={creator}>
        <CreateTransactionModal
          defaultsymbol={symbol}
          defaultPrice={price && regularMarketPrice ? regularMarketPrice.raw : 0}
          toggleCreator={toggleCreator}
        />
      </Modal>
    </div>
  );
};

export default InstrumentPageTracking;
