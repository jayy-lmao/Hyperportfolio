import React from 'react';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * A react component for a single watchlist item
 * @param {Object} - holds the relevant details for watchlist item creation
 * Within exists:
 * {function} redirect - to redirect upon completion
 * {Date} dateCreated - metadata for date of item creation
 * {String} id - id of created item
 * {String} title - title of created item
 * {String} description - description of created item
 */
const WatchlistItem = ({
  redirect, dateCreated, id, title, description,
}) => (
  <Item className="watchlist-item" as="a" onClick={() => redirect(`/watchlists/${id}`)}>
    {/* <Item.Image src="https://react.semantic-ui.com/images/wireframe/image.png" /> */}
    <Item.Content>
      <Item.Header>{title}</Item.Header>
      <Item.Meta>
        <span className="dateCreated">
          Created:
          {' '}
          {dateCreated}
        </span>
      </Item.Meta>
      <Item.Description>{description}</Item.Description>
    </Item.Content>
  </Item>
);

/**
 * Definition of item proptypes
 */
WatchlistItem.propTypes = {
  redirect: PropTypes.func.isRequired,
  dateCreated: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default WatchlistItem;
