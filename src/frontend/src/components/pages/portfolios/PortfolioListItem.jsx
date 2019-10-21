import React from 'react';
import { Item } from 'semantic-ui-react';

/**
 * An individual portfolio item within a list of portfolios
 * @param {Object} - holds relevant informatoin about a individual portfolio to display
 */
const PortfolioItem = ({
  redirect, dateCreated, id, title, description, units, value, averagePrice,
}) => (
  <Item inverted as="a" onClick={() => redirect(`/portfolios/${id}`)}>
    <Item.Image src="https://react.semantic-ui.com/images/wireframe/image.png" />
    <Item.Content>
      <Item.Header inverted>{title}</Item.Header>
      <Item.Meta>
        <span className="dateCreated">
          Created:
          {' '}
          {dateCreated}
        </span>
      </Item.Meta>
      <Item.Description>{description}</Item.Description>
      <Item.Description>{units}</Item.Description>
      <Item.Description>{value}</Item.Description>
      <Item.Description>{averagePrice}</Item.Description>
    </Item.Content>
  </Item>
);

export default PortfolioItem;
