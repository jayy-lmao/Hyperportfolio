import React from 'react';

/**
 * Render stock list separately given a list from pops
 * @param {Object} props
 */
const StockList = (props) => {
  const { stocks } = props;
  const stocksRender = stocks.map(() => <div>stock display</div>);
  return <div>{stocksRender}</div>;
};

export default StockList;
